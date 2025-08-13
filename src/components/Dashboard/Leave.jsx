import { useEffect, useState } from "react";
import { useApprovedLeave } from "../../hooks/useAuth.js";

const CustomToggleButton = ({ isSelected, onChange }) => {
  return (
    <div className="w-60 flex items-center justify-center">
      <div
        onClick={onChange}
        className="relative flex items-center p-1  w-full h-12 bg-gray-200 dark:bg-neutral-700  rounded-full cursor-pointer transition-all duration-300 shadow-inner">
        {/* Sliding toggle */}
        <div
          className={`absolute h-10 w-1/2 bg-white dark:bg-neutral-900 rounded-full shadow-md transform transition-transform duration-300 ${
            isSelected ? "translate-x-0 ml-1" : "translate-x-full -ml-3"
          }`}
        />
        {/* Labels */}
        <div className="flex w-full z-10 text-sm font-medium">
          <div className="w-1/2 text-center py-2">
            <span
              className={`transition-colors duration-300 text-black dark:text-white`}>
              Today <br />
              Leave
            </span>
          </div>
          <div className="w-1/2 text-center py-2 ">
            <span
              className={`transition-colors duration-300 text-black dark:text-white`}>
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
  const [leaveList, setLeaveList] = useState([]);

  const handleToggleChange = () => {
    setIsToday(!isToday);
  };

  const { data: approvedLeaveData } = useApprovedLeave();
  const todayLeave = approvedLeaveData?.data?.today;
  const upComingLeave = approvedLeaveData?.data.upcoming;

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
      <div className="flex flex-col bg-white dark:bg-black rounded-lg shadow-sm  ">
        <div className="flex flex-row sm:flex-row sm:items-center justify-between w-full px-4 py-3 border-b dark:border-b-slate-500 gap-3">
          <p className="text-xl font-bold">Leave</p>
          <div>
            <CustomToggleButton
              isSelected={isToday}
              onChange={handleToggleChange}
            />
          </div>
        </div>
        <div className="w-full p-2 ">
          <div className="max-h-[30vh] overflow-y-auto ">
            {leaveList && leaveList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leaveList.map((data, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-black rounded-lg shadow-md p-4 border dark:border-slate-500 border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 mr-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full font-bold shadow-md text-lg bg-green-100 dark:bg-green-400 border border-green-600 text-green-600">
                          {data?.fullName?.toUpperCase().charAt(0) || "?"}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {data.fullName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-white">
                          Department: {data.departmentName}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-slate-500 pt-3">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="font-medium text-gray-500 dark:text-white">
                            From:
                          </span>
                          <span className="ml-1 text-gray-800 dark:text-white">
                            {formatDate(data.leaveStartDate)}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-500 dark:text-white">
                            To:
                          </span>
                          <span className="ml-1 text-gray-800 dark:text-white">
                            {formatDate(data.leaveEndDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-black rounded-lg shadow-md p-8 text-center text-gray-500 dark:text-white">
                No Data available
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Leave;
