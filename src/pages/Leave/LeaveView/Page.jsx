import React, { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios-Instance";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import GoBack from "../../../components/GoBack";

const LeaveView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [leaveByIdData, setLeaveByIdData] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    const fetchLeaveById = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/api/leave/leaveId", {
          data: {
            rclId: id,
          },
        });
        if (response.data.responseCode === "200") {
          setLeaveByIdData(response.data.datalist[0]);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching Leave:", error);
        toast.error("Error fetching Leave.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveById();
  }, []);
  return (
    <div>
      {" "}
      <div className="">
        <div className="flex justify-between items-center mb-4">
          <h1 className="page-title">Leave Details</h1>
          <GoBack />
        </div>
        <Table aria-label="Details of Leave">
          <TableHeader>
            <TableColumn>LeaveId</TableColumn>
            {/* <TableColumn>Employee Name</TableColumn> */}
            <TableColumn>Leave Type</TableColumn>
            <TableColumn>Leave Start Date</TableColumn>
            <TableColumn>Leave End Date</TableColumn>
            <TableColumn>Leave Duration</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key="1">
              <TableCell>{leaveByIdData?.leaveId || "N/A"}</TableCell>
              {/* <TableCell>{leaveByIdData?.employeeName || "N/A"}</TableCell> */}
              <TableCell>{leaveByIdData?.leaveType || "N/A"}</TableCell>
              <TableCell>{leaveByIdData?.startDate || "N/A"}</TableCell>
              <TableCell>{leaveByIdData?.endDate || "N/A"}</TableCell>
              <TableCell>{leaveByIdData?.leaveDuration || "N/A"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LeaveView;
