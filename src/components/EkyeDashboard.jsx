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

import DropDownComp from "./Dropdown";

import { useNavigate } from "react-router-dom";

const EkyeDashboard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const EkyeDashboardDataPerPage = 10;
  const startIndex = (currentPage - 1) * EkyeDashboardDataPerPage;
  const endIndex = startIndex + EkyeDashboardDataPerPage;
  const TotalEmployee = 30;
  const employeesPerPage = 10;
  const dropdownItems = [10, 20, 30, 50, 100];

  const [eKyeData, setEkyeData] = useState([]);

  const paginatedEkye = eKyeData?.slice(startIndex, endIndex);

  const handlePageChange = (EkyeDashboard) => {
    setCurrentPage(EkyeDashboard);
  };
  const handleChange = (action, rclId) => {
    switch (action) {
      case "view":
        navigate(`/View/${rclId}`); // Pass the RCLID dynamically in the route
        break;
      case "action":
        navigate(`/EkyeAction/${rclId}`);
        console.log(`Edit action for RCLID: ${rclId}`); // Optional for handling the edit case
        break;
      default:
        console.log("Invalid action");
    }
  };

  useEffect(() => {
    const FetchAllEKYE = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.post(
          "/api/v1/admin/completedEkyeUsers",
          {}
        );
        if (response?.data?.responseCode === "200") {
          setEkyeData(response?.data?.data?.content);
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
    <>
      <div className="max-h-[90vh] overflow-auto mt-4 rounded-3xl max-w-[100%] ">
        <Table
          bordered
          aria-label="List of Employees who have Completed into EKYE"
        >
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
              <TableRow
                key={data.rclId}
                className="h-16" // Adjusts row height
              >
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
                      onClick={() => handleChange("view", data.RCLID)}
                    />
                    <FaEdit
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      title="Edit"
                      onClick={() => handleChange("action", data.RCLID)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className=" flex mt-4 justify-between ">
        <div>
          <div className="flex text-xs">
            <span>Showing:</span>
            <div className="flex justify-between gap-x-1">
              <span className="font-bold">{employeesPerPage}</span>
              <span>of</span>
              <span>{TotalEmployee}</span>
            </div>
          </div>
        </div>
        <Pagination
          initialPage={1}
          total={Math.ceil(eKyeData.length / EkyeDashboardDataPerPage)}
          onChange={handlePageChange}
        />
        <div className="flex justify-center items-center">
          <span className="text-xs">Lines Per Page :</span>
          <div>
            <DropDownComp items={dropdownItems} />
          </div>
        </div>
        {/* <EkyeAction /> */}
        {/* <Filter /> */}
      </div>
    </>
  );
};

export default EkyeDashboard;
