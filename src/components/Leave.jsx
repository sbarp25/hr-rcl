import { Button } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../lib/axios-Instance";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CustomToggleButton = ({ isSelected, onChange }) => {
  return (
    <div className="w-60 flex items-center justify-center">
      <div
        onClick={onChange}
        className="relative flex w-full h-10 bg-gray-200 rounded-full cursor-pointer p-1 transition-all duration-300 shadow-inner">
        {/* Sliding toggle */}
        <div
          className={`absolute w-1/2 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            isSelected ? "translate-x-0" : "translate-x-full"
          }`}
        />
        {/* Labels */}
        <div className="flex justify-between items-center w-full z-10 px-3 text-xs font-medium text-gray-700">
          <span
            className={`transition-colors duration-300 ${
              isSelected ? "text-gray-900" : "text-gray-400"
            }`}>
            Today Leave
          </span>
          <span
            className={`transition-colors duration-300 ${
              !isSelected ? "text-gray-900" : "text-gray-400"
            }`}>
            Upcoming Leave
          </span>
        </div>
      </div>
    </div>
  );
};

const Leave = (props) => {
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
        <div className="w-full overflow-x-auto">
          <div className="  ">
            <Table
              bordered
              isHeaderSticky
              aria-label="Dynamic Attendance Table"
              className="min-w-full h-auto max-h-[50vh] overflow-auto">
              <TableHeader className="Capitalize gap-4  ">
                <TableColumn>S.N</TableColumn>
                <TableColumn>RCL-ID</TableColumn>
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
                    <TableCell>{data.rclId}</TableCell>
                    <TableCell>{data.fullName}</TableCell>
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
        </div>
      </div>
    </>
  );
};

export default Leave;
