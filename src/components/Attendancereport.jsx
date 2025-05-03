import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { FaChevronDown } from "react-icons/fa";

import { useState } from "react";

const AttendanceReport = ({ attendanceData }) => {
  // const AttendanceReport = () => {
  const [expandedRow, setExpandedRow] = useState(null);

  // Toggle expanded row for mobile view
  const toggleExpandedRow = (sn) => {
    setExpandedRow(expandedRow === sn ? null : sn);
  };

  return (
    <div className="w-full px-2 sm:px-4">
      {/* Large screens - Full table */}
      <div className="hidden lg:block">
        <Table
          bordered
          shadow="sm"
          aria-label="Dynamic Attendance Table"
          classNames={{
            wrapper: "min-h-[200px]",
            table: "min-w-full",
          }}>
          <TableHeader className="bg-gray-50">
            <TableColumn>S.N</TableColumn>
            <TableColumn>Day</TableColumn>
            <TableColumn>Is Delayed</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>CheckIn type</TableColumn>
            <TableColumn>CheckIn Time</TableColumn>
            <TableColumn>Checkout Time</TableColumn>
            <TableColumn>Location</TableColumn>
            <TableColumn>Early/Delay time</TableColumn>
            <TableColumn>Total Time of work</TableColumn>
            <TableColumn>Attendance Status</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No attendance data available">
            {attendanceData?.map((data) => (
              <TableRow key={data.SN} className="hover:bg-gray-50">
                <TableCell>{data.SN || "N/A"}</TableCell>
                <TableCell>{data.Day || "N/A"}</TableCell>
                <TableCell>{data.isDelay ? "Yes" : "No"}</TableCell>
                <TableCell>{data.weekDays || "N/A"}</TableCell>
                <TableCell>{data.checkinType || "N/A"}</TableCell>
                <TableCell>{data.checkInTime || "N/A"}</TableCell>
                <TableCell>{data.checkOutTime || "N/A"}</TableCell>
                <TableCell>{data.workLocation || "N/A"}</TableCell>
                <TableCell>
                  <div
                    className={`px-3 py-1.5 rounded-full text-xs font-medium text-center w-fit ${
                      data.attendanceStatus === "present" ||
                      data.attendanceStatus === "pending"
                        ? data.isDelay
                          ? "border border-red-500 text-red-700 bg-red-100"
                          : "border border-green-500 text-green-700 bg-green-100"
                        : ""
                    }`}>
                    {data.earlyDelayTime || "N/A"}
                  </div>
                </TableCell>
                <TableCell>{data.totaltimeOfWork || "N/A"}</TableCell>
                <TableCell>
                  <div
                    className={`px-3 py-1.5 text-xs font-medium rounded-full text-center inline-flex items-center justify-center shadow-sm ${
                      data.attendanceStatus?.toLowerCase() === "present"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : data.attendanceStatus?.toLowerCase() === "absent"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                    }`}>
                    {data.attendanceStatus
                      ? data.attendanceStatus.charAt(0).toUpperCase() +
                        data.attendanceStatus.slice(1)
                      : "N/A"}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Medium screens - Simplified table */}
      <div className="hidden md:block lg:hidden">
        <Table
          bordered
          shadow="sm"
          aria-label="Dynamic Attendance Table"
          classNames={{
            wrapper: "min-h-[400px]",
          }}>
          <TableHeader className="bg-gray-50">
            <TableColumn>Date</TableColumn>
            <TableColumn>Day</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Work Time</TableColumn>
            <TableColumn>Location</TableColumn>
            <TableColumn>Details</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No attendance data available">
            {attendanceData?.map((data) => (
              <TableRow key={data.SN} className="hover:bg-gray-50">
                <TableCell>{data.weekDays || "N/A"}</TableCell>
                <TableCell>{data.Day || "N/A"}</TableCell>
                <TableCell>
                  <div
                    className={`px-2 py-1 text-xs rounded-full text-center ${
                      data.attendanceStatus?.toLowerCase() === "present"
                        ? "bg-green-100 text-green-800"
                        : data.attendanceStatus?.toLowerCase() === "absent"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {data.attendanceStatus || "N/A"}
                  </div>
                </TableCell>
                <TableCell>{data.totaltimeOfWork || "N/A"}</TableCell>
                <TableCell>{data.workLocation || "N/A"}</TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="light" size="sm">
                        Details
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Attendance Details">
                      <DropdownItem>
                        Delay: {data.isDelay ? "Yes" : "No"}
                      </DropdownItem>
                      <DropdownItem>
                        Early/Delay: {data.earlyDelayTime || "N/A"}
                      </DropdownItem>
                      <DropdownItem>
                        Checkin Type: {data.checkinType || "N/A"}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Small screens - Card-like view */}
      <div className="block md:hidden">
        <div className="space-y-4">
          {attendanceData?.map((data) => (
            <div
              key={data.SN}
              className="border rounded-lg overflow-hidden shadow-sm">
              <div
                className="flex justify-between items-center p-3 cursor-pointer bg-gray-50"
                onClick={() => toggleExpandedRow(data.SN)}>
                <div className="font-medium">
                  {data.Day} ({data.weekDays || "N/A"})
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`px-2 py-1 text-xs rounded-full ${
                      data.attendanceStatus?.toLowerCase() === "present"
                        ? "bg-green-100 text-green-800"
                        : data.attendanceStatus?.toLowerCase() === "absent"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {data.attendanceStatus || "N/A"}
                  </div>
                  <FaChevronDown
                    size={16}
                    className={`transition-transform ${
                      expandedRow === data.SN ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              <div
                className={`${
                  expandedRow === data.SN ? "block" : "hidden"
                } p-3 space-y-2 text-sm`}>
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Work Time:</div>
                  <div>{data.totaltimeOfWork || "N/A"}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Location:</div>
                  <div>{data.workLocation || "N/A"}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Is Delay:</div>
                  <div>{data.isDelay ? "Yes" : "No"}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Early/Delay:</div>
                  <div>{data.earlyDelayTime || "N/A"}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Checkin Type:</div>
                  <div>{data.checkinType || "N/A"}</div>
                </div>
              </div>
            </div>
          ))}

          {(!attendanceData || attendanceData.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              No attendance data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
