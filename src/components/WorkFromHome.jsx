import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";

const WorkFromHome = () => {
  const truncateText = (text, maxLength) =>
    text.length > maxLength ? `${text?.slice(0, maxLength)}...` : text;
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
    <div className="w-full">
      <Table
        bordered
        aria-label="Dyanamic Attendance Table"
        isHeaderSticky
        className="max-h-[30vh] overflow-auto  w-[40vw] ">
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
            <TableRow
              key={data.Sn}
              className="h-20 justify-center items-center border-b-2 border-gray-300">
              <TableCell>{data.Sn}</TableCell>
              <TableCell>{data.RCLID}</TableCell>
              <TableCell>{data.Name}</TableCell>
              <TableCell title={data.Email}>
                {truncateText(data.Email, 7)}
              </TableCell>
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
