import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { GrView } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import { Pagination } from "@nextui-org/pagination";
import { toast } from "react-toastify/unstyled";
import axiosInstance from "../lib/axios-Instance";

const EkyeDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const EkyeDashboardDataPerPage = 10;
  const startIndex = (currentPage - 1) * EkyeDashboardDataPerPage;
  const endIndex = startIndex + EkyeDashboardDataPerPage;

  const [eKyeData, setEkyeData] = useState([]);

  const paginatedEkye = eKyeData.slice(startIndex, endIndex);

  const handlePageChange = (EkyeDashboard) => {
    setCurrentPage(EkyeDashboard);
  };
  useEffect(() => {
    const FetchAllEKYE = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          "/api/v1/admin/completed_ekye_users",
          {}
        );
        if (response?.data?.responseCode === "200") {
          setEkyeData(response?.data?.datalist);
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching EKYE data");
      } finally {
        setIsLoading(false);
      }
    };
    FetchAllEKYE();
  }, []);
  console.log(eKyeData);
  const headeritem = [
    { label: "Dashboard", href: "/" },
    { label: "Notice", href: "/notice" },
  ];
  return (
    <div className="max-h-[80vh] overflow-auto mt-4 rounded-lg max-w-[80vw]">
      <Table
        bordered
        aria-label="List of Employees who have Completed into EKYE">
        <TableHeader>
          <TableColumn>S.N</TableColumn>
          <TableColumn>RCL-ID</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Department</TableColumn>
          <TableColumn>Position</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedEkye.map((data, index) => (
            <TableRow key={data.rclId}>
              <TableCell>{startIndex + index + 1}</TableCell>
              <TableCell>{data.rclId}</TableCell>
              <TableCell>{data.fullName}</TableCell>
              <TableCell>{data.email}</TableCell>
              <TableCell>{data.departmentName}</TableCell>
              <TableCell>{data.positionName}</TableCell>
              <TableCell>
                {data.Action}
                <div className="flex justify-start gap-4">
                  <GrView
                    className="text-green-500 cursor-pointer hover:text-green-700"
                    title="View"
                  />
                  <FaEdit
                    className="text-red-500 cursor-pointer hover:text-red-700"
                    title="Edit"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 ml-96">
        <Pagination
          initialPage={1}
          total={Math.ceil(eKyeData.length / EkyeDashboardDataPerPage)}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default EkyeDashboard;
