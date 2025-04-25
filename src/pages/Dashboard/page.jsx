import Attendancereport from "../../components/Attendancereport.jsx";
import { Input } from "@nextui-org/input";

import WorkFromHome from "../../components/WorkFromHome.jsx";
import Leave from "../../components/Leave.jsx";
import CheckIn from "../../components/CheckIn.jsx";
import axiosInstance from "../../lib/axios-Instance.js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  // const [checkedInStatus, setCheckedInStatus] = useState(true);
  const [checkedInStatus, setCheckedInStatus] = useState(false);
  const [totalDelayTime, setTotalDelayTime] = useState("");
  const [totalEarlyTime, setTotalEarlyTime] = useState("");
  const username = localStorage.getItem("fullName");

  const getWeeklyAttendanceReport = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/attendance/weekly_attendances"
      );

      if (response?.data?.responseCode === "200") {
        setAttendanceData(response?.data?.data?.weeklyAttendanceReport);
        setTotalDelayTime(response?.data?.data?.totalDelayTime);
        setTotalEarlyTime(response?.data?.data?.totalEarlyTime);
        setCheckedInStatus(response?.data?.data?.isCheckedIn);
      } else {
        toast.error(
          response?.data?.message || "Failed to retrieve attendance data"
        );
      }
    } catch (error) {
      const errorMessage = error?.data?.error?.errorList?.[0]?.errorMessage;
      toast.error(errorMessage || "Something went wrong");
    }
  };

  useEffect(() => {
    getWeeklyAttendanceReport();
  }, [checkedInStatus]);

  return (
    <div className="w-full h-[97vh] overflow-y-auto">
      <div className="w-full flex flex-col gap-4 ">
        <div className="hidden md:block">
          <CheckIn checkedInStatus={checkedInStatus} />
        </div>

        {/* Welcome Banner */}
        <div className="flex justify-center bg-white items-center rounded-md w-full shadow-sm">
          <p className="font-light text-lg leading-10">
            Welcome, {username || "User"}
          </p>
        </div>

        {/* Weekly Attendance Report */}
        <div className="flex flex-col bg-white rounded-lg w-full border border-gray-300 shadow-sm">
          <div className="flex flex-col justify-center items-center">
            <h1 className="page-title mt-2 text-xl font-bold">
              Weekly Attendance Report
            </h1>
            <div className="w-full ">
              <Attendancereport attendanceData={attendanceData} />
            </div>
          </div>
          <div className="text-md font-bold text-right mt-1 mr-4 mb-3">
            <p className="text-green-700 mt-1">
              Total Early Time: {totalEarlyTime || "N/A"}
            </p>
            <p className="text-red-700 mt-1">
              Total delay Time: {totalDelayTime || "N/A"}
            </p>
          </div>
        </div>

        {/* WFH and Leave Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Work From Home Panel */}
          <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full px-4 py-3 border-b gap-3">
              <h3 className="text-xl font-bold">Work From Home</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm">Search </p>
                <Input
                  className="max-w-xs w-full sm:w-auto"
                  type="search"
                  placeholder="Search for employees..."
                  size="sm"
                />
              </div>
            </div>

            <div className="w-full">
              <WorkFromHome />
            </div>
          </div>

          {/* Leave Panel */}
          <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="w-full ">
              <Leave />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
