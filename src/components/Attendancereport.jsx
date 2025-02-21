import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
const Attendancereport = () => {
  const attendanceData = [
    {
      sn: 1,
      weekDay: "2024-12-1",
      checkInOut: "Active",
      totalTimeOfWork: "Active",
      isDelay: "Active",
      attendanceStatus: "Active",
      earlyDelayTime: "Active",
      checkinType: "Active",
      checkoutType: "Active",
      workLocation: "Active",
    },
    {
      sn: 2,
      weekDay: "2024-12-2",
      checkInOut: "Active",
      totalTimeOfWork: "Active",
      isDelay: "Active",
      attendanceStatus: "Active",
      earlyDelayTime: "Active",
      checkinType: "Active",
      checkoutType: "Active",
      workLocation: "Active",
    },
    {
      sn: 3,
      weekDay: "2024-12-3",
      checkInOut: "Active",
      totalTimeOfWork: "Active",
      isDelay: "Active",
      attendanceStatus: "Active",
      earlyDelayTime: "Active",
      checkinType: "Active",
      checkoutType: "Active",
      workLocation: "Active",
    },
    {
      sn: 4,
      weekDay: "2024-12-4",
      checkInOut: "Active",
      totalTimeOfWork: "Active",
      isDelay: "Active",
      attendanceStatus: "Active",
      earlyDelayTime: "Active",
      checkinType: "Active",
      checkoutType: "Active",
      workLocation: "Active",
    },
    {
      sn: 5,
      weekDay: "2024-12-5",
      checkInOut: "Active",
      totalTimeOfWork: "Active",
      isDelay: "Active",
      attendanceStatus: "Active",
      earlyDelayTime: "Active",
      checkinType: "Active",
      checkoutType: "Active",
      workLocation: "Active",
    },
    {
      sn: 6,
      weekDay: "2024-12-6",
      checkInOut: "Active",
      totalTimeOfWork: "Active",
      isDelay: "Active",
      attendanceStatus: "Active",
      earlyDelayTime: "Active",
      checkinType: "Active",
      checkoutType: "Active",
      workLocation: "Active",
    },
    {
      sn: 7,
      weekDay: "2024-12-7",
      checkInOut: "Active",
      totalTimeOfWork: "Active",
      isDelay: "Active",
      attendanceStatus: "Active",
      earlyDelayTime: "Active",
      checkinType: "Active",
      checkoutType: "Active",
      workLocation: "Active",
    },
  ];
  return (
    <div className="p-4 w-full ">
      <Table
        bordered
        shadow="none"
        aria-label="Dynamic Attendance Table"
        className="h-[30vh]  ">
        <TableHeader className="capitalize ">
          <TableColumn>S.N</TableColumn>
          <TableColumn>Week Days </TableColumn>
          <TableColumn>Check In/Out</TableColumn>
          <TableColumn>Total Time of work</TableColumn>
          <TableColumn>IS Delay</TableColumn>
          <TableColumn>Attendance Status</TableColumn>
          <TableColumn>Early/Delay Time</TableColumn>
          <TableColumn>Checkin Type</TableColumn>
          <TableColumn>CheckOut Type</TableColumn>
          <TableColumn>Work Location</TableColumn>
        </TableHeader>
        <TableBody>
          {attendanceData.map((data) => (
            <TableRow key={data.sn} className="border-b border-gray-200">
              <TableCell>{data.sn}</TableCell>
              <TableCell>{data.weekDay}</TableCell>
              <TableCell>{data.checkInOut}</TableCell>
              <TableCell>{data.totalTimeOfWork}</TableCell>
              <TableCell>{data.isDelay}</TableCell>
              <TableCell>{data.attendanceStatus}</TableCell>
              <TableCell>{data.earlyDelayTime}</TableCell>
              <TableCell>{data.checkinType}</TableCell>
              <TableCell>{data.checkoutType}</TableCell>
              <TableCell>{data.workLocation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Attendancereport;
