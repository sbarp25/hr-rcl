import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Link, useParams } from "react-router-dom";

const Leave = () => {
  const truncateText = (text, maxLength) =>
    text.length > maxLength ? `${text?.slice(0, maxLength)}...` : text;
  const LeaveList = [
    {
      Sn: 1,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      Fromdate: "2025-02-01",
      todate: "2025-03-01",
      ApprovedBy: "Sam Thapa",
    },
    {
      Sn: 2,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      Fromdate: "2025-02-01",
      todate: "2025-03-01",
      ApprovedBy: "Sam Thapa",
    },
    {
      Sn: 3,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      Fromdate: "2025-02-01",
      todate: "2025-03-01",
      ApprovedBy: "Sam Thapa",
    },
    {
      Sn: 4,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      Fromdate: "2025-02-01",
      todate: "2025-03-01",
      ApprovedBy: "Sam Thapa",
    },
    {
      Sn: 5,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      Fromdate: "2025-02-01",
      todate: "2025-03-01",
      ApprovedBy: "Sam Thapa",
    },
    {
      Sn: 6,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      Fromdate: "2025-02-01",
      todate: "2025-03-01",
      ApprovedBy: "Sam Thapa",
    },
    {
      Sn: 7,
      RCLID: "01235642",
      Name: "prativa Oli",
      Email: "Example@gmail.com",
      Department: "UI/UX",
      Fromdate: "2025-02-01",
      todate: "2025-03-01",
      ApprovedBy: "Sam Thapa",
    },
  ];
  return (
    <>
      <div>
        <div className="  ">
          <Table
            bordered
            isHeaderSticky
            aria-label="Dynamic Attendance Table"
            className="max-h-[25vh] overflow-auto  w-[42vw]"
          >
            <TableHeader className="Capitalize gap-4  ">
              <TableColumn>S.N</TableColumn>
              <TableColumn>RCL-ID</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Department</TableColumn>
              <TableColumn>From Date</TableColumn>
              <TableColumn>To Date</TableColumn>
              <TableColumn>Approved By</TableColumn>
            </TableHeader>
            <TableBody>
              {LeaveList.map((data) => (
                <TableRow key={data.Sn}>
                  <TableCell>{data.Sn}</TableCell>
                  <TableCell>{data.RCLID}</TableCell>
                  <TableCell>{data.Name}</TableCell>
                  <TableCell title={data.Email}>
                    {truncateText(data.Email, 7)}
                  </TableCell>
                  <TableCell>{data.Department}</TableCell>
                  <TableCell>{data.Fromdate}</TableCell>
                  <TableCell>{data.todate}</TableCell>
                  <TableCell>{data.ApprovedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default Leave;
