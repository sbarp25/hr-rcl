import { Button } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { VisuallyHidden, useSwitch } from "@nextui-org/react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../lib/axios-Instance";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Leave = (props) => {
  const [isToday, setIsToday] = useState(true);
  const [todayLeave, setTodayLeave] = useState([]);
  const [upComingLeave, setUpComingLeave] = useState([]);
  const [leaveList, setLeaveList] = useState([]);

  const switchProps = {
    ...props,
    isSelected: isToday,
    onChange: () => {
      setIsToday(!isToday);
    },
  };
  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch(switchProps);

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
            <Component {...getBaseProps()}>
              <VisuallyHidden>
                <input {...getInputProps()} />
              </VisuallyHidden>
              <div
                {...getWrapperProps()}
                className={slots.wrapper({
                  class: [
                    "w-40 md:w-48 h-fit",
                    "flex items-center justify-center",
                    "p-2",
                  ],
                })}>
                {isSelected ? <p>Today Leave</p> : <p>Upcoming Leave</p>}
              </div>
            </Component>
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
