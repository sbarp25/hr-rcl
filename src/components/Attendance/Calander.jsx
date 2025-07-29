import { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import axiosInstance from "../../lib/axios-Instance";
import Loader from "../Loader/Loader";
import { toast } from "sonner";
//comnet
const Calander = ({ employeeData, calendarData: propsCalendarData }) => {
  const [calendarData, setCalanderData] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const calander = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        "api/attendance/monthly_attendance"
      );

      if (response.data.responseCode === "200") {
        setCalanderData(response.data.datalist);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If calendar data is provided via props, use the attendanceData property
    if (
      propsCalendarData?.attendanceData &&
      propsCalendarData.attendanceData.length > 0
    ) {
      setCalanderData(propsCalendarData.attendanceData);
    } else {
      // Otherwise, fetch from API
      calander();
    }
  }, [propsCalendarData]);

  // Use props attendanceData if available, otherwise use state data
  const activeCalendarData =
    propsCalendarData?.attendanceData &&
    propsCalendarData.attendanceData.length > 0
      ? propsCalendarData.attendanceData
      : calendarData;

  const sortedData = [...activeCalendarData].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  if (sortedData.length === 0)
    return (
      <div className="p-4 text-center text-sm sm:text-base text-gray-700 dark:text-gray-300">
        No calendar data available.
      </div>
    );

  const currentDate = new Date(sortedData[0].date);
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const monthTitle = `${currentMonth} ${currentYear}`;

  const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1);
  const startingDayIndex = firstDayOfMonth.getDay();
  const totalDays = new Date(
    currentYear,
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const dateMap = {};
  sortedData.forEach((item) => {
    const day = new Date(item.date).getDate();
    dateMap[day] = item;
  });

  const handleDateClick = (day) => {
    if (dateMap[day]) {
      setSelectedDay(dateMap[day]);
      onOpen();
    }
  };

  const hasValidTime = (timeStr) => {
    return timeStr && timeStr !== "00:00:00";
  };

  // Build calendar cells
  const calendarCells = [];

  // Add empty cells before the first day
  for (let i = 0; i < startingDayIndex; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-12 sm:h-16" />);
  }

  // Add each day's cell
  for (let day = 1; day <= totalDays; day++) {
    const dayData = dateMap[day];

    let cellClass =
      "border rounded p-1 sm:p-2 h-12 sm:h-16 cursor-pointer hover:shadow-md transition-shadow";
    if (dayData?.is_holiday) {
      cellClass +=
        " bg-red-100 dark:bg-red-900/30 border-red-400 dark:border-red-600";
    } else if (dayData?.is_present === true) {
      cellClass +=
        " bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600";
    } else if (dayData?.is_present === false) {
      cellClass +=
        " bg-orange-100 dark:bg-orange-900/30 border-orange-400 dark:border-orange-600";
    } else {
      cellClass +=
        " border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800";
    }

    calendarCells.push(
      <div key={day} className={cellClass} onClick={() => handleDateClick(day)}>
        <div className="flex justify-between items-start">
          <span className="font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200">
            {day}
          </span>
          {dayData?.day && (
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              {dayData.day}
            </span>
          )}
        </div>

        {/* Attendance info - more compact on mobile */}
        {dayData?.is_present && (
          <div className="mt-1 text-xs text-green-600 dark:text-green-400">
            <div className="hidden sm:block">Present</div>
            <div className="sm:hidden">✓</div>
          </div>
        )}

        {/* Event info - hide on very small screens */}
        {dayData?.event_name && (
          <div className="text-xs text-blue-600 dark:text-blue-400 truncate mt-1 hidden sm:block">
            {dayData.event_name}
          </div>
        )}
      </div>
    );
  }

  const getStatusComponent = () => {
    if (!selectedDay) return null;

    if (selectedDay.is_holiday) {
      return (
        <div className="text-red-500 dark:text-red-400 font-medium">
          Holiday
        </div>
      );
    } else if (selectedDay.is_present === true) {
      return (
        <div className="text-green-500 dark:text-green-400 font-medium">
          Present
        </div>
      );
    } else if (selectedDay.is_present === false) {
      return (
        <div className="text-orange-500 dark:text-orange-400 font-medium">
          Absent
        </div>
      );
    } else {
      return (
        <div className="text-gray-500 dark:text-gray-400 font-medium">
          Upcoming
        </div>
      );
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr || timeStr === "00:00:00") return "N/A";
    return timeStr.split(".")[0]; // Remove milliseconds if present
  };

  return (
    <>
      {isloading ? (
        <Loader />
      ) : (
        <>
          <div className="p-2 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/10 h-full">
            {/* Header - responsive layout */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
                {monthTitle}
              </h2>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2 sm:space-x-4">
                <Legend color="green" label="Present" />
                <Legend color="red" label="Holiday" />
                <Legend color="orange" label="Absent" />
              </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                  {/* Show abbreviated names on mobile */}
                  <span className="sm:hidden">{day.slice(0, 1)}</span>
                  <span className="hidden sm:block">{day}</span>
                </div>
              ))}
            </div>

            {/* Calendar Grid - responsive gaps */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarCells}
            </div>
          </div>

          {/* Modal with responsive sizing */}
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="sm"
            className="mx-2 sm:mx-0">
            <ModalContent className="bg-white dark:bg-gray-800 border dark:border-gray-700">
              {() => (
                <>
                  <ModalHeader className="flex flex-col gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 px-4 sm:px-6">
                    {selectedDay && (
                      <div className="flex items-center justify-between w-full">
                        <div className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">
                          {selectedDay.day}, {selectedDay.date}
                        </div>
                        {getStatusComponent()}
                      </div>
                    )}
                  </ModalHeader>

                  <ModalBody className="px-4 sm:px-6 pb-6">
                    {selectedDay && (
                      <div className="bg-white dark:bg-gray-800 p-3 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-4 sm:space-y-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-2">
                          Attendance Details
                        </h3>

                        {/* Responsive grid - single column on mobile */}
                        <div className="grid grid-cols-1 gap-y-3 sm:gap-y-4 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700">
                            <span className="text-gray-500 dark:text-gray-400">
                              Status:
                            </span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {selectedDay.is_holiday
                                ? "Holiday"
                                : selectedDay.is_present === true
                                ? "Present"
                                : selectedDay.is_present === false
                                ? "Absent"
                                : "Upcoming"}
                            </span>
                          </div>

                          <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700">
                            <span className="text-gray-500 dark:text-gray-400">
                              Check-in Time:
                            </span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {formatTime(selectedDay.check_in_time)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700">
                            <span className="text-gray-500 dark:text-gray-400">
                              Total Working Hours:
                            </span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {formatTime(selectedDay.total_working_hour)}
                            </span>
                          </div>

                          {hasValidTime(selectedDay.delay_check_in_time) && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700">
                              <span className="text-gray-500 dark:text-gray-400">
                                Delay Check-in:
                              </span>
                              <span className="font-medium text-red-600 dark:text-red-400">
                                {formatTime(selectedDay.delay_check_in_time)}
                              </span>
                            </div>
                          )}

                          {hasValidTime(selectedDay.early_check_in_time) && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700">
                              <span className="text-gray-500 dark:text-gray-400">
                                Early Check-in:
                              </span>
                              <span className="font-medium text-green-600 dark:text-green-400">
                                {formatTime(selectedDay.early_check_in_time)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

const Legend = ({ color, label }) => {
  const colorClasses = {
    green:
      "bg-green-100 dark:bg-green-900/50 border-green-400 dark:border-green-600",
    red: "bg-red-100 dark:bg-red-900/50 border-red-400 dark:border-red-600",
    orange:
      "bg-orange-100 dark:bg-orange-900/50 border-orange-400 dark:border-orange-600",
  };

  return (
    <span className="flex items-center space-x-1">
      <span
        className={`inline-block w-2 h-2 sm:w-3 sm:h-3 rounded-full border ${colorClasses[color]}`}></span>
      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        {label}
      </span>
    </span>
  );
};
export default Calander;
