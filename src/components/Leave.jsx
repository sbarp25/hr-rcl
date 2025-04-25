import axiosInstance from "../lib/axios-Instance";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CustomToggleButton = ({ isSelected, onChange }) => {
  return (
    <div className="w-60 flex items-center justify-center">
      <div
        onClick={onChange}
        className="relative flex items-center p-1  w-full h-12 bg-gray-200 rounded-full cursor-pointer transition-all duration-300 shadow-inner">
        {/* Sliding toggle */}
        <div
          className={`absolute h-10 w-1/2 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            isSelected ? "translate-x-0 ml-1" : "translate-x-full -ml-1"
          }`}
        />
        {/* Labels */}
        <div className="flex w-full z-10 text-sm font-medium">
          <div className="w-1/2 text-center py-2">
            <span
              className={`transition-colors duration-300 ${
                isSelected ? "text-gray-900" : "text-gray-400"
              }`}>
              Today <br />
              Leave
            </span>
          </div>
          <div className="w-1/2 text-center py-2">
            <span
              className={`transition-colors duration-300 ${
                !isSelected ? "text-gray-900" : "text-gray-400"
              }`}>
              Upcoming Leave
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
const Leave = () => {
  const [isToday, setIsToday] = useState(true);
  const [todayLeave, setTodayLeave] = useState([]);
  const [upComingLeave, setUpComingLeave] = useState([]);
  const [leaveList, setLeaveList] = useState([]);

  const handleToggleChange = () => {
    setIsToday(!isToday);
  };

  const fetchTodayLeave = async () => {
    try {
      const response = await axiosInstance.get(
        `api/leave/approved_today_and_upcoming`
      );
      if (response?.data?.responseCode === "200") {
        const todayData = response?.data?.data?.today || [];
        const upcomingData = response?.data?.data?.upcoming || [];

        setTodayLeave(todayData);
        setUpComingLeave(upcomingData);
        setLeaveList(isToday ? todayData : upcomingData);
      } else {
        toast.error(response?.data?.data?.message);
      }
    } catch (error) {
      const errorMessage = error?.data?.error?.errorList?.[0]?.errorMessage;
      toast.error(errorMessage || "Something Went Wrong");
    }
  };

  useEffect(() => {
    fetchTodayLeave();
  }, []);

  useEffect(() => {
    if (isToday) {
      setLeaveList(todayLeave);
    } else {
      setLeaveList(upComingLeave);
    }
  }, [isToday, todayLeave, upComingLeave]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <>
      <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-row sm:flex-row sm:items-center justify-between w-full px-4 py-3 border-b gap-3">
          <p className="text-xl font-bold">Leave</p>
          <div>
            <CustomToggleButton
              isSelected={isToday}
              onChange={handleToggleChange}
            />
          </div>
        </div>
        <div className="w-full p-4 ">
          <div className="max-h-[30vh] overflow-auto px-1">
            {leaveList && leaveList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2    gap-4">
                {leaveList.map((data, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 mr-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full font-bold shadow-md text-lg bg-green-100 border border-green-600 text-green-600">
                          {data?.fullName?.charAt(0) || "?"}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {data.fullName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Team Lead: {data.teamLeaderName}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="font-medium text-gray-500">
                            From:
                          </span>
                          <span className="ml-1 text-gray-800">
                            {formatDate(data.leaveStartDate)}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-500">To:</span>
                          <span className="ml-1 text-gray-800">
                            {formatDate(data.leaveEndDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                No Data available
              </div>
            )}
          </div>
        </div>
        {/* <div className="w-full overflow-x-auto">
          <div className="  ">
            <Table
              bordered
              isHeaderSticky
              aria-label="Dynamic Attendance Table"
              className="min-w-full h-auto max-h-[50vh] overflow-auto">
              <TableHeader className="Capitalize gap-4  ">
                <TableColumn>S.N</TableColumn>
                <TableColumn>Name</TableColumn>
                <TableColumn>Team Leader</TableColumn>
                <TableColumn>From Date</TableColumn>
                <TableColumn>To Date</TableColumn>
              </TableHeader>
              <TableBody>
                {leaveList.map((data, index) => (
                  <TableRow
                    key={index + 1}
                    className="h-20 justify-center items-center border-b-2 border-gray-300">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full font-bold shadow-md text-base bg-teal-100 border border-teal-600 text-teal-600`}>
                        {data?.fullName?.charAt(0) || "?"}
                      </div>
                      {data.fullName}
                    </TableCell>
                    <TableCell>{data.teamLeaderName}</TableCell>
                    <TableCell>{data.leaveStartDate}</TableCell>
                    <TableCell>{data.leaveEndDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {(!leaveList || leaveList.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              No Data available
            </div>
          )}
        </div> */}
      </div>
    </>
  );
};

export default Leave;
