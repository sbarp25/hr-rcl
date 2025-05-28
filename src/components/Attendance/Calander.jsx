import { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import axiosInstance from "../../lib/axios-Instance";
import Loader from "../Loader/Loader";
import { toast } from "sonner";

const Calander = () => {
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
    calander();
  }, []);

  const sortedData = [...calendarData].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  if (sortedData.length === 0) return <div>No calendar data available.</div>;

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
    calendarCells.push(<div key={`empty-${i}`} className="h-16" />);
  }

  // Add each day's cell
  for (let day = 1; day <= totalDays; day++) {
    const dayData = dateMap[day];

    let cellClass = "border rounded p-2 h-16";
    if (dayData?.is_holiday) {
      cellClass += " bg-red-100 border-red-400";
    } else if (dayData?.is_present === true) {
      cellClass += " bg-green-100 border-green-400";
    } else if (dayData?.is_present === false) {
      cellClass += " bg-orange-100 border-orange-400";
    } else {
      cellClass += " border-gray-200";
    }

    calendarCells.push(
      <div key={day} className={cellClass} onClick={() => handleDateClick(day)}>
        <div className="flex justify-between">
          <span className="font-semibold">{day}</span>
          {dayData?.day && (
            <span className="text-xs text-gray-500">{dayData.day}</span>
          )}
        </div>

        {/* Attendance info */}
        {dayData?.is_present && (
          <div className="mt-1 text-xs text-green-600">
            <div>Present</div>
          </div>
        )}

        {/* Event info */}
        {dayData?.event_name && (
          <div className="text-xs text-blue-600 truncate mt-1">
            {dayData.event_name}
          </div>
        )}
      </div>
    );
  }

  const getStatusComponent = () => {
    if (!selectedDay) return null;

    if (selectedDay.is_holiday) {
      return <div className="text-red-500 font-medium">Holiday</div>;
    } else if (selectedDay.is_present === true) {
      return <div className="text-green-500 font-medium">Present</div>;
    } else if (selectedDay.is_present === false) {
      return <div className="text-orange-500 font-medium">Absent</div>;
    } else {
      return <div className="text-gray-500 font-medium">Upcoming</div>;
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
          <div className="p-4 bg-white rounded-lg shadow h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{monthTitle}</h2>
              <div className="text-sm text-gray-600 flex items-center space-x-4">
                <Legend color="green" label="Present" />
                <Legend color="red" label="Holiday" />
                <Legend color="orange" label="Absent" />
              </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">{calendarCells}</div>
          </div>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {() => (
                <>
                  <ModalHeader className="flex flex-col gap-2 border-b border-gray-200 pb-2">
                    {selectedDay && (
                      <div className="flex items-center justify-between w-full">
                        <div className="text-base font-medium text-gray-800">
                          {selectedDay.day}, {selectedDay.date}
                        </div>
                        {getStatusComponent()}
                      </div>
                    )}
                  </ModalHeader>

                  <ModalBody>
                    {selectedDay && (
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
                          Attendance Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Status:</span>
                            <span className="font-medium text-gray-800">
                              {selectedDay.is_holiday
                                ? "Holiday"
                                : selectedDay.is_present === true
                                ? "Present"
                                : selectedDay.is_present === false
                                ? "Absent"
                                : "Upcoming"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Check-in Time:
                            </span>
                            <span className="font-medium text-gray-800">
                              {formatTime(selectedDay.check_in_time)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Total Working Hours:
                            </span>
                            <span className="font-medium text-gray-800">
                              {formatTime(selectedDay.total_working_hour)}
                            </span>
                          </div>
                          {hasValidTime(selectedDay.delay_check_in_time) && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">
                                Delay Check-in:
                              </span>
                              <span className="font-medium text-red-600">
                                {formatTime(selectedDay.delay_check_in_time)}
                              </span>
                            </div>
                          )}
                          {hasValidTime(selectedDay.early_check_in_time) && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">
                                Early Check-in:
                              </span>
                              <span className="font-medium text-green-600">
                                {formatTime(selectedDay.early_check_in_time)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </ModalBody>

                  {/* <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter> */}
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

const Legend = ({ color, label }) => (
  <span className="flex items-center space-x-1">
    <span
      className={`inline-block w-3 h-3 rounded-full bg-${color}-100 border border-${color}-400`}></span>
    <span>{label}</span>
  </span>
);

export default Calander;
