import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
const Attendancereport = ({ attendanceData }) => {
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
          {attendanceData &&
            attendanceData.map((data) => (
              <TableRow key={data.sn} className="border-b border-gray-200">
                <TableCell>{data.sn || "N/A"}</TableCell>
                <TableCell>{data.weekDay || "N/A"}</TableCell>
                <TableCell>{data.checkInOut || "N/A"}</TableCell>
                <TableCell>{data.totalTimeOfWork || "N/A"}</TableCell>
                <TableCell>{data.isDelay || "N/A"}</TableCell>
                <TableCell>{data.attendanceStatus || "N/A"}</TableCell>
                <TableCell>{data.earlyDelayTime || "N/A"}</TableCell>
                <TableCell>{data.checkinType || "N/A"}</TableCell>
                <TableCell>{data.checkoutType || "N/A"}</TableCell>
                <TableCell>{data.workLocation || "N/A"}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Attendancereport;
