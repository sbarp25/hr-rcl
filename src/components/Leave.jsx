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
  const [leaveList, setLeaveList] = useState([]);
  // const LeaveList = [
  //   {
  //     Sn: 1,
  //     RCLID: "01235642",
  //     Name: "prativa Oli",
  //     Department: "UI/UX",
  //     Fromdate: "2025-02-01",
  //     todate: "2025-03-01",
  //   },
  //   {
  //     Sn: 2,
  //     RCLID: "01235642",
  //     Name: "prativa Oli",
  //     Department: "UI/UX",
  //     Fromdate: "2025-02-01",
  //     todate: "2025-03-01",
  //   },
  //   {
  //     Sn: 3,
  //     RCLID: "01235642",
  //     Name: "prativa Oli",
  //     Department: "UI/UX",
  //     Fromdate: "2025-02-01",
  //     todate: "2025-03-01",
  //   },
  //   {
  //     Sn: 4,
  //     RCLID: "01235642",
  //     Name: "prativa Oli",
  //     Department: "UI/UX",
  //     Fromdate: "2025-02-01",
  //     todate: "2025-03-01",
  //   },
  //   {
  //     Sn: 5,
  //     RCLID: "01235642",
  //     Name: "prativa Oli",
  //     Department: "UI/UX",
  //     Fromdate: "2025-02-01",
  //     todate: "2025-03-01",
  //   },
  //   {
  //     Sn: 6,
  //     RCLID: "01235642",
  //     Name: "prativa Oli",
  //     Department: "UI/UX",
  //     Fromdate: "2025-02-01",
  //     todate: "2025-03-01",
  //   },
  //   {
  //     Sn: 7,
  //     RCLID: "01235642",
  //     Name: "prativa Oli",
  //     Department: "UI/UX",
  //     Fromdate: "2025-02-01",
  //     todate: "2025-03-01",
  //   },
  // ];
  const fetchTodayLeave = async () => {
    try {
      const response = await axiosInstance.get(`api/leave/today_and_upcoming`);
      if (response?.data?.responseCode === "200") {
        setLeaveList(response?.data?.datalist || []);
      } else {
        toast.error(response?.data?.data?.message);
      }
    } catch (error) {
      const errorMessage = error?.data?.error?.errorList?.[0]?.errorMessage;
      toast.error(errorMessage || "Check In Failed");
    }
  };
  const fetchUpComing = async () => {
    try {
      const response = await axiosInstance.get(`/Leave/Upcoming`);
      if (response?.data?.responseCode === "200") {
        setLeaveList(response?.data?.datalist || []);
      } else {
        toast.error(response?.data?.data?.message);
      }
    } catch (error) {
      const errorMessage = error?.data?.error?.errorList?.[0]?.errorMessage;
      toast.error(errorMessage || "Check In Failed");
    }
  };
  useEffect(() => {
    if (isToday) {
      fetchTodayLeave();
    } else {
      fetchUpComing();
    }
  }, [isToday]);

  return (
    <>
      <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full px-4 py-3 border-b gap-3">
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
                    "w-16 md:w-48 h-fit",
                    "flex items-center justify-center",
                    "p-2",
                    // "rounded-lg bg-default-100 hover:bg-default-200",
                  ],
                })}>
                {isSelected ? <p>Today Leave</p> : <p>Upcoming Leave</p>}
              </div>
            </Component>
          </div>
          {/* <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="bg-blue-900 text-white text-sm shadow-sm"
              size="sm">
              Today Leave
            </Button>
            <Button
              type="button"
              className="bg-red-700 text-white text-sm shadow-sm"
              size="sm">
              Upcoming Leave
            </Button>
          </div> */}
        </div>
        <div className="w-full overflow-x-auto">
          <div className="  ">
            <Table
              bordered
              isHeaderSticky
              aria-label="Dynamic Attendance Table"
              className="min-w-full h-auto max-h-[60vh] overflow-auto">
              <TableHeader className="Capitalize gap-4  ">
                <TableColumn>S.N</TableColumn>
                <TableColumn>RCL-ID</TableColumn>
                <TableColumn>Name</TableColumn>

                <TableColumn>Department</TableColumn>
                <TableColumn>From Date</TableColumn>
                <TableColumn>To Date</TableColumn>
              </TableHeader>
              <TableBody>
                {leaveList.map((data) => (
                  <TableRow
                    key={data.Sn}
                    className="h-20 justify-center items-center border-b-2 border-gray-300">
                    <TableCell>{data.Sn}</TableCell>
                    <TableCell>{data.rclId}</TableCell>
                    <TableCell>{data.Name}</TableCell>

                    <TableCell>{data.Department}</TableCell>
                    <TableCell>{data.leaveStartDate}</TableCell>
                    <TableCell>{data.leaveEndDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leave;
