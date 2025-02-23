import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import DropDownComp from "../../../components/Dropdown";
import { Link } from "react-router-dom";
import SkeletonLoader from "../../../components/SkeletonLoader";

const LeaveStatus = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [leaveData, setleaveData] = useState([]);

  const [leaveDataperpage, setLeaveDataPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Leave Status", href: "" },
  ];

  const dropdownItems = [5, 10, 20, 30, 50, 100];

  useEffect(() => {
    const fetchLeave = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/leave/all", {});
        if (response.data.responseCode === "200") {
          setleaveData(response.data.datalist);
          setTotalPages(response.data.totalPages);
          setTotalRecords(response.data.totalRecords);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Something went wrong";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeave();
  }, []);

  return (
    <>
      <div className="container space-y-4">
        {/**Page Section */}
        <div className="space-y-4">
          <BreadcrumbsComponent items={breadcrumbItems} />
          <h1 className="page-title">Leave Status</h1>
        </div>

        {/**Table Section */}
        <div className="bg-white rounded-lg p-2">
          <div className="max-h-[78vh] overflow-auto mt-4 rounded-3xl max-w-[100%] ">
            <Table bordered aria-label="Table of Leave">
              <TableHeader>
                <TableColumn>S.N</TableColumn>
                <TableColumn>Request Date</TableColumn>
                <TableColumn>Leave Type</TableColumn>
                <TableColumn>Leave Start Date</TableColumn>
                <TableColumn>Leave End Date</TableColumn>
                <TableColumn>Days</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Team Leader</TableColumn>
                <TableColumn>Approver</TableColumn>
              </TableHeader>
              <TableBody
                items={isLoading ? [] : leaveData}
                isLoading={isLoading}
                loadingContent={<SkeletonLoader />}>
                {leaveData.map((data, index) => (
                  <TableRow
                    key={data.rclId}
                    className="h-14 border-b-2 border-gray-300">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{data?.leaveStartDate || "N/A"}</TableCell>
                    <TableCell>{data?.leaveType || "N/A"}</TableCell>
                    <TableCell>{data?.leaveStartDate || "N/A"}</TableCell>
                    <TableCell>{data?.leaveEndDate || "N/A"}</TableCell>
                    <TableCell>{data?.Days || "N/A"}</TableCell>
                    <TableCell>
                      <Link
                        key={data.leaveId}
                        to={`/Leave/apprej/${data.leaveId}`}>
                        <div
                          className={`${
                            data?.leaveStatus === "APPROVED"
                              ? "bg-teal-100 border border-teal-600 text-teal-600"
                              : data?.leaveStatus === "REJECTED"
                              ? "bg-red-100 border border-red-600 text-red-600"
                              : "bg-yellow-100 border border-yellow-500 text-yellow-500"
                          } text-center p-2 rounded-md w-fit`}>
                          {data?.leaveStatus || "N/A"}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 p-2 rounded-lg">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full font-bold shadow-md text-lg ${
                            data?.leaveStatus === "APPROVED"
                              ? "bg-teal-100 text-teal-600"
                              : data?.leaveStatus === "REJECTED"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-500"
                          }`}>
                          {data?.teamLeaderName?.charAt(0) || "?"}
                        </div>
                        <div className="text-gray-800 font-medium">
                          {data?.teamLeaderName || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 p-2 rounded-lg">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full font-bold shadow-md text-lg ${
                            data?.leaveStatus === "APPROVED"
                              ? "bg-teal-100 text-teal-600"
                              : data?.leaveStatus === "REJECTED"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-500"
                          }`}>
                          {data?.Approver?.charAt(0) || "?"}
                        </div>
                        <div>{data?.Approver || "N/A"}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {/* <Spacer /> */}
              </TableBody>
            </Table>
          </div>
          {/**Pagination Section */}
          <div>
            {" "}
            <div className="flex mt-4 justify-between items-center">
              <div className="flex text-xs">
                <span>Showing:</span>
                <span className="font-bold">{leaveDataperpage}</span>
                <span>of</span>
                <span>{totalRecords}</span>
              </div>
              <Pagination
                showControls
                total={totalPages}
                page={currentPage}
                onChange={handlePageChange}
              />
              <div className="flex justify-center items-center">
                <span className="text-xs">Lines Per Page :</span>
                <DropDownComp
                  items={dropdownItems}
                  onSelect={setLeaveDataPerPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaveStatus;
