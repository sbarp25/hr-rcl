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

const LeaveStatus = () => {
  const [ekyeDashboardDataPerPage, setEkyeDashboardDataPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [eKyeData, setEkyeData] = useState([]);
  const dropdownItems = [5, 10, 20, 30, 50, 100];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [leaveData, setleaveData] = useState([]);
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Leave", href: "" },
    { label: "Leave Status", href: "/Leave/Status" },
  ];

  useEffect(() => {
    const fetchLeave = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/leave/all", {});
        if (response.data.responseCode === "200") {
          setleaveData(response.data.datalist);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Error fetching employees.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeave();
  }, []);

  return (
    <div className="container space-y-4">
      {/**Page Section */}
      <div className="space-y-4">
        <BreadcrumbsComponent items={breadcrumbItems} />
        <h1 className="page-title">Leave Status</h1>
      </div>
      {/**Table Section */}
      <div className="max-h-[80vh] overflow-auto mt-4 rounded-3xl max-w-[100%]">
        <Table bordered aria-label="List of Employees who have Completed EKYE">
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
          <TableBody>
            {leaveData.map((data, index) => (
              <TableRow key={data.rclId} className="h-14">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{data?.leaveStartDate || "N/A"}</TableCell>
                <TableCell>{data?.leaveType || "N/A"}</TableCell>
                <TableCell>{data?.leaveStartDate || "N/A"}</TableCell>
                <TableCell>{data?.leaveEndDate || "N/A"}</TableCell>
                <TableCell>{data?.Days || "N/A"}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-white shadow-sm">
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
                  <div>
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
        <div className="flex mt-4 justify-between">
          <div className="flex text-xs">
            <span>Showing:</span>
            <span className="font-bold">{ekyeDashboardDataPerPage}</span>
            <span>of</span>
            <span>{eKyeData.length}</span>
          </div>
          <Pagination
            initialPage={1}
            total={Math.ceil(eKyeData.length / ekyeDashboardDataPerPage)}
            onChange={handlePageChange}
          />
          <div className="flex justify-center items-center">
            <span className="text-xs">Lines Per Page :</span>
            <DropDownComp
              items={dropdownItems}
              onSelect={setEkyeDashboardDataPerPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveStatus;
