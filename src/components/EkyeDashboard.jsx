import React, { useState } from "react";
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

const EkyeDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const EkyeDashboardDataPerPage = 3;
  const startIndex = (currentPage - 1) * EkyeDashboardDataPerPage;
  const endIndex = startIndex + EkyeDashboardDataPerPage;
  const EkyeDashboardData = [
    {
      Sn: 1,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      position: "junior",
    },
    {
      Sn: 2,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      position: "junior",
    },
    {
      Sn: 3,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      position: "junior",
    },
    {
      Sn: 4,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      position: "junior",
    },
    {
      Sn: 5,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      position: "junior",
    },
    {
      Sn: 6,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      position: "junior",
    },
    {
      Sn: 7,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      position: "junior",
    },
    {
      Sn: 8,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      position: "junior",
    },
    {
      Sn: 9,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      position: "junior",
    },
    {
      Sn: 10,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      position: "junior",
    },
  ];
  const paginatedEkye = EkyeDashboardData.slice(startIndex, endIndex);

  const handlePageChange = (EkyeDashboard) => {
    setCurrentPage(EkyeDashboard);
  };

  return (
    <div className=" overflow-auto mt-4  h-full">
      <Table bordered aria-label="Dyanamic Attendance Table">
        <TableHeader className="Capitalize">
          <TableColumn>S.N</TableColumn>
          <TableColumn>RCL-ID</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Department</TableColumn>
          <TableColumn>Position</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody>
          {EkyeDashboardData.map((data) => (
            <TableRow key={data.Sn}>
              <TableCell>{data.Sn}</TableCell>
              <TableCell>{data.RCLID}</TableCell>
              <TableCell>{data.Name}</TableCell>
              <TableCell>{data.Email}</TableCell>
              <TableCell>{data.Department}</TableCell>
              <TableCell>{data.position}</TableCell>
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
      {/* <div className="mt-4 ml-96">
        {/* <Pagination
          initialPage={1}
          total={Math.ceil(EkyeDashboardData.length / EkyeDashboardDataPerPage)}
          onChange={handlePageChange}
        /> */}
      {/* </div> */}
    </div>
  );
};

export default EkyeDashboard;
