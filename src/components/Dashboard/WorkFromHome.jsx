import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios-Instance.js";
import { toast } from "sonner";
const CustomToggleButton = ({ isSelected, onChange }) => {
  return (
    <div className="w-60 flex items-center justify-center">
      <div
        onClick={onChange}
        className="relative flex items-center p-1  w-full h-12 bg-gray-200 rounded-full cursor-pointer transition-all duration-300 shadow-inner">
        {/* Sliding toggle */}
        <div
          className={`absolute h-10 w-1/2 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            isSelected ? "translate-x-0 ml-1" : "translate-x-full -ml-3"
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
              WFH
            </span>
          </div>
          <div className="w-1/2 text-center py-2">
            <span
              className={`transition-colors duration-300 ${
                !isSelected ? "text-gray-900" : "text-gray-400"
              }`}>
              Upcoming <br />
              WFH
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkFromHome = () => {
  const [isToday, setIsToday] = useState(true);
  const [todayWFH, setTodayWFH] = useState([]);
  const [upComingWFH, setUpComingWFH] = useState([]);
  const [wfhList, setWFHList] = useState([]);

  const handleToggleChange = () => {
    setIsToday(!isToday);
  };

  const fetchWFH = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/work_from_home/approved_today_and_upcoming`
      );
      if (response?.data?.responseCode === "200") {
        const todayData = response?.data?.data?.today || [];
        const upcomingData = response?.data?.data?.upcoming || [];

        setTodayWFH(todayData);
        setUpComingWFH(upcomingData);
        setWFHList(isToday ? todayData : upcomingData);
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        // toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error?.data?.error?.errorList?.[0]?.errorMessage;
      toast.error(errorMessage || "Something Went Wrong");
    }
  };

  useEffect(() => {
    fetchWFH();
  }, []);

  useEffect(() => {
    if (isToday) {
      setWFHList(todayWFH);
    } else {
      setWFHList(upComingWFH);
    }
  }, [isToday, todayWFH, upComingWFH]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <>
      <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-row sm:flex-row sm:items-center justify-between w-full px-4 py-3 border-b gap-3">
          <p className="hidden md:block text-xl font-bold">Work From Home</p>
          <p className="flex md:hidden text-xl font-bold">WFH</p>
          <div>
            <CustomToggleButton
              isSelected={isToday}
              onChange={handleToggleChange}
            />
          </div>
        </div>
        <div className="w-full p-2 ">
          <div className="max-h-[30vh] overflow-auto">
            {wfhList && wfhList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2    gap-4">
                {wfhList.map((data, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 mr-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full font-bold shadow-md text-lg bg-green-100 border border-green-600 text-green-600">
                          {(data?.userName || data?.fullName || "?").charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {data.userName || data.fullName || "Unknown"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Department: {data.departmentName || "N/A"}
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
                            {formatDate(data.workFromHomeStartDate)}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-500">To:</span>
                          <span className="ml-1 text-gray-800">
                            {formatDate(data.workFromHomeEndDate)}
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
      </div>
    </>
  );
};

export default WorkFromHome;
