import Attendancereport from "../../components/Dashboard/Attendancereport.jsx";
import WorkFromHome from "../../components/Dashboard/WorkFromHome.jsx";
import Leave from "../../components/Dashboard/Leave.jsx";
import CheckIn from "../../components/Dashboard/CheckIn.jsx";
import { useEffect, useState } from "react";
import TemporaryAdmin from "../../components/TemporaryAdmin.jsx";
import { useWeeklyAttendanceReport } from "../../hooks/useAuth.js";
import { ThemeSwitcher } from "../../components/ThemeSwitcher.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../../lib/axios-Instance.js";
import LocalStorageUtil from "../../utils/LocalStorageUtil.js";

const Page = () => {
  const [checkedInStatus, setCheckedInStatus] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState();
  const [rclId, setRclId] = useState();
  const [employeeData, setEmployeeData] = useState();
  const navigate = useNavigate();

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
  // const ekeyStep = localStorage.getItem("ekeyStep");

  // useEffect(() => {
  //   if (ekeyStep !== null) {
  //     navigate("/EKYE");
  //   }
  // }, [ekeyStep]);
  const fetchrcl = async () => {
    try {
      setIsDetailsLoading(true);
      const response = await axiosInstance.get(`/api/v1/auth/ekye/details`);
      if (response.data.responseCode === "200") {
        const data = response?.data?.data?.rclId;
        setRclId(data);
      } else {
        // toast.error(response?.data?.Message);
      }
    } catch (error) {
      // toast.error("Failed to fetch RCL ID", error);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  // const
  const fetchEmployeeData = async () => {
    try {
      setIsDetailsLoading(true);
      const response = await axiosInstance.get(`/api/v1/auth/get-logged-user`);
      if (response.data.responseCode === "200") {
        const data = response?.data?.data;
        const position = data.postionName;
        LocalStorageUtil.setItem("position", position), setEmployeeData(data);
      } else {
        // toast.error(response?.data?.Message);
      }
    } catch (error) {
      //
    } finally {
      setIsDetailsLoading(false);
    }
  };

  // First fetch the rclId
  useEffect(() => {
    fetchrcl();
  }, []);

  // Then fetch employee data once rclId is available
  useEffect(() => {
    if (rclId) {
      fetchEmployeeData();
    }
  }, [rclId]);

  return (
    <div className="w-[calc(100%-1rem)] flex flex-col gap-4">
      {/* Theme Switcher and CheckIn next to each other */}
      <div className="flex items-center justify-end gap-4">
        <div className="">
          <ThemeSwitcher />
        </div>
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
      </div>

      {/* <TemporaryAdmin /> */}

      {/* Welcome Banner */}
      <div className="relative flex justify-center bg-white dark:bg-black items-center rounded-md w-full shadow-sm py-2 px-4">
        <p className="font-light text-lg leading-10">
          Welcome, {username || "User"}
        </p>
      </div>

      {/* Weekly Attendance Report */}
      <div className="flex flex-col  rounded-lg w-full p-1 shadow-sm">
        <div className="flex flex-col justify-center items-center">
          <h1 className="page-title mt-2 text-xl font-bold dark:text-gray-300">
            Weekly Attendance Report
          </h1>
          <div className="w-full ">
            {/* <div className="w-full bg-green-500"> */}
            {isLoading ? (
              <div className="text-center py-4">Loading attendance data...</div>
            ) : (
              <div className="w-full overflow-x-auto ">
                <Attendancereport attendanceData={attendanceData} />
              </div>
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
        <div className="flex flex-col bg-white dark:bg-black rounded-lg shadow-sm border border-gray-100 dark:border-gray-500">
          <div className="">
            <WorkFromHome />
          </div>
        </div>

        {/* Leave Panel */}
        <div className="flex flex-col bg-white dark:bg-black rounded-lg shadow-sm border border-gray-100 dark:border-gray-500">
          <div className="">
            <Leave />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
