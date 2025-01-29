import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";

const WorkFromHome = () => {
  const WorkfromHomeDate = [
    {
      Sn: 1,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      ApprovedBy: "Sam Thapa",
    },
    {
      Sn: 2,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      ApprovedBy: "Sam Thapa",
    },
    {
      Sn: 3,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      ApprovedBy: "Sam Thapa",
    },
    {
      Sn: 4,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      ApprovedBy: "Sam Thapa",
    },
    {
      Sn: 5,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      ApprovedBy: "Sam Thapa",
    },
    {
      Sn: 6,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      ApprovedBy: "Sam Thapa",
    },
    {
      Sn: 7,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      ApprovedBy: "Sam Thapa",
    },
  ];
  return (
    <div className="">
      <Table
        bordered
        aria-label="Dyanamic Attendance Table"
        isHeaderSticky
        className="max-h-[25vh] overflow-auto"
      >
        <TableHeader className="Capitalize ">
          <TableColumn>S.N</TableColumn>
          <TableColumn>RCL-ID</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Department</TableColumn>
          <TableColumn>Approved By</TableColumn>
        </TableHeader>
        <TableBody>
          {WorkfromHomeDate.map((data) => (
            <TableRow key={data.Sn}>
              <TableCell>{data.Sn}</TableCell>
              <TableCell>{data.RCLID}</TableCell>
              <TableCell>{data.Name}</TableCell>
              <TableCell>{data.Email}</TableCell>
              <TableCell>{data.Department}</TableCell>
              <TableCell>{data.ApprovedBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WorkFromHome;
