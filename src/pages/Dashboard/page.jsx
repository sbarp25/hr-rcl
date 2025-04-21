import Attendancereport from "../../components/Attendancereport.jsx";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import WorkFromHome from "../../components/WorkFromHome.jsx";
import Leave from "../../components/Leave.jsx";
import CheckIn from "../../components/CheckIn.jsx";
import axiosInstance from "../../lib/axios-Instance.js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BiCreditCard } from "react-icons/bi";

const Page = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [checkedInStatus, setCheckedInStatus] = useState(false);
  // const [checkedInStatus, setCheckedInStatus] = useState(true);
  const username = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");
  const lati = localStorage.getItem("latitude");
  const long = localStorage.getItem("longitude");
  const getWeeklyAttendanceReport = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/attendance/weekly_attendances"
      );

      if (response?.data?.responseCode === "200") {
        // setAttendanceData(response?.data?.datalist || []);
        setCheckedInStatus();
      } else {
        toast.error(response?.data?.data?.message);
      }
    } catch (error) {
      const errorMessage = error?.data?.error?.errorList?.[0]?.errorMessage;
      toast.error(errorMessage || "Something went wrong");
    }
  };
  // useEffect(() => {
  //   getWeeklyAttendanceReport();
  // }, [checkedInStatus]);
  // const attendanceData = [
  //   {
  //     sn: 1,
  //     weekDay: "2024-12-1",
  //     checkInOut: "Active",
  //     totalTimeOfWork: "Active",
  //     isDelay: "Active",
  //     attendanceStatus: "Active",
  //     earlyDelayTime: "Active",
  //     checkinType: "Active",
  //     checkoutType: "Active",
  //     workLocation: "Active",
  //   },
  //   {
  //     sn: 2,
  //     weekDay: "2024-12-2",
  //     checkInOut: "Active",
  //     totalTimeOfWork: "Active",
  //     isDelay: "Active",
  //     attendanceStatus: "Active",
  //     earlyDelayTime: "Active",
  //     checkinType: "Active",
  //     checkoutType: "Active",
  //     workLocation: "Active",
  //   },
  //   {
  //     sn: 3,
  //     weekDay: "2024-12-3",
  //     checkInOut: "Active",
  //     totalTimeOfWork: "Active",
  //     isDelay: "Active",
  //     attendanceStatus: "Active",
  //     earlyDelayTime: "Active",
  //     checkinType: "Active",
  //     checkoutType: "Active",
  //     workLocation: "Active",
  //   },
  //   {
  //     sn: 4,
  //     weekDay: "2024-12-4",
  //     checkInOut: "Active",
  //     totalTimeOfWork: "Active",
  //     isDelay: "Active",
  //     attendanceStatus: "Active",
  //     earlyDelayTime: "Active",
  //     checkinType: "Active",
  //     checkoutType: "Active",
  //     workLocation: "Active",
  //   },
  //   {
  //     sn: 5,
  //     weekDay: "2024-12-5",
  //     checkInOut: "Active",
  //     totalTimeOfWork: "Active",
  //     isDelay: "Active",
  //     attendanceStatus: "Active",
  //     earlyDelayTime: "Active",
  //     checkinType: "Active",
  //     checkoutType: "Active",
  //     workLocation: "Active",
  //   },
  //   {
  //     sn: 6,
  //     weekDay: "2024-12-6",
  //     checkInOut: "Active",
  //     totalTimeOfWork: "Active",
  //     isDelay: "Active",
  //     attendanceStatus: "Active",
  //     earlyDelayTime: "Active",
  //     checkinType: "Active",
  //     checkoutType: "Active",
  //     workLocation: "Active",
  //   },
  //   {
  //     sn: 7,
  //     weekDay: "2024-12-7",
  //     checkInOut: "Active",
  //     totalTimeOfWork: "Active",
  //     isDelay: "Active",
  //     attendanceStatus: "Active",
  //     earlyDelayTime: "Active",
  //     checkinType: "Active",
  //     checkoutType: "Active",
  //     workLocation: "Active",
  //   },
  // ];

  // const checkedInStatus = false;
  return (
    <div className="w-full h-[97vh] overflow-y-auto">
      <div className="w-full flex flex-col gap-4 ">
        <CheckIn checkedInStatus={checkedInStatus} />

        {/* Welcome Banner */}
        <div className="flex justify-center bg-white  items-center rounded-md w-full shadow-sm">
          <p className="font-light text-lg leading-10">Welcome, {username}</p>
        </div>

        {/* Weekly Attendance Report */}
        {/* <div className="flex flex-col bg-white rounded-lg w-full border border-gray-300 shadow-sm">
          <div className="flex flex-col justify-center items-center">
            <h1 className="page-title mt-2 text-xl font-bold">
              Weekly Attendance Report
            </h1>
            <div className="w-full overflow-x-auto">
              <Attendancereport attendanceData={attendanceData} />
            </div>
          </div>
          <div className="text-md font-bold text-right mr-4 mb-3">
            <p className="text-teal-500 mt-1">Total Early Time: {"1Hrs"}</p>
            <p className="text-red-500 mt-1">Total delay Time: {"1.5Hrs"}</p>
          </div>
        </div> */}

        {/* WFH and Leave Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Work From Home Panel */}
          {/* <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full px-4 py-3 border-b gap-3">
              <h3 className="text-xl font-bold">Work From Home</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm">Search:</p>
                <Input
                  className="max-w-xs w-full sm:w-auto"
                  type="search"
                  placeholder="Search..."
                  size="sm"
                />
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <WorkFromHome />
            </div>
          </div> */}

          {/* Leave Panel */}
          <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="w-full overflow-x-auto">
              <Leave />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
