import Attendancereport from "../../components/Dashboard/Attendancereport.jsx";
import WorkFromHome from "../../components/Dashboard/WorkFromHome.jsx";
import Leave from "../../components/Dashboard/Leave.jsx";
import CheckIn from "../../components/Dashboard/CheckIn.jsx";
import { useEffect, useState } from "react";
import TemporaryAdmin from "../../components/TemporaryAdmin.jsx";
import { useWeeklyAttendanceReport } from "../../hooks/useAuth.js";

const Page = () => {
  const [checkedInStatus, setCheckedInStatus] = useState(false);

  const username = localStorage.getItem("fullName");

  const {
    data: WeekelyattendaceData,
    isLoading,
    refetch,
  } = useWeeklyAttendanceReport();

  const attendanceData = WeekelyattendaceData?.data?.weeklyAttendanceReport;
  const totalDelayTime = WeekelyattendaceData?.data?.totalDelayTime;
  const totalEarlyTime = WeekelyattendaceData?.data?.totalEarlyTime;

  useEffect(() => {
    setCheckedInStatus(WeekelyattendaceData?.data?.isCheckedIn);
  }, [WeekelyattendaceData?.data?.isCheckedIn]);

  // Status change handler to refresh data
  const handleStatusChange = (newStatus) => {
    setCheckedInStatus(newStatus);
    refetch();
  };

  const email = localStorage.getItem("email");

  return (
    <div className="w-full h-[97vh] overflow-y-auto">
      <div className="w-full flex flex-col gap-4 ">
        <div className="">
          {email === "superadmin@rebootedcl.com" ? (
            ""
          ) : (
            <CheckIn
              checkedInStatus={checkedInStatus}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
        {/* *<TemporaryAdmin /> */}

        {/* Welcome Banner */}
        <div className="flex justify-center bg-white dark:bg-black items-center rounded-md w-full shadow-sm">
          <p className="font-light text-lg leading-10">
            Welcome, {username || "User"}
          </p>
        </div>

        {/* Weekly Attendance Report */}
        <div className="flex flex-col bg-white dark:bg-black rounded-lg w-full p-1 shadow-sm ">
          <div className="flex flex-col justify-center items-center">
            <h1 className="page-title mt-2 text-xl font-bold dark:text-gray-300">
              Weekly Attendance Report
            </h1>
            <div className="w-full ">
              {isLoading ? (
                <div className="text-center py-4">
                  Loading attendance data...
                </div>
              ) : (
                <Attendancereport attendanceData={attendanceData} />
              )}
            </div>
          </div>

          <div className="text-sm font-semibold text-right mt-1 mr-4 mb-3">
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
            <div className="">
              <WorkFromHome />
            </div>
          </div>

          {/* Leave Panel */}
          <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="">
              <Leave />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
