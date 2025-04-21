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
    text?.length > maxLength ? `${text?.slice(0, maxLength)}...` : text;
  const WorkfromHomeDate = []; // This is your empty data array

  return (
    <div className="w-full overflow-x-auto">
      <Table
        bordered
        aria-label="Work From Home Table"
        isHeaderSticky
        className="min-w-full h-auto max-h-[60vh] overflow-auto">
        <TableHeader className="capitalize">
          <TableColumn>S.N</TableColumn>
          <TableColumn>RCL-ID</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Department</TableColumn>
          <TableColumn>Approved By</TableColumn>
        </TableHeader>
        <TableBody>
          {WorkfromHomeDate.length > 0
            ? WorkfromHomeDate.map((data) => (
                <TableRow key={data.Sn} className="h-20 overflow-y-auto">
                  <TableCell>{data.Sn}</TableCell>
                  <TableCell>{data.RCLID}</TableCell>
                  <TableCell>{data.Name}</TableCell>
                  <TableCell title={data.Email}>
                    {truncateText(data.Email, 12)}
                  </TableCell>
                  <TableCell>{data.Department}</TableCell>
                  <TableCell>{data.ApprovedBy}</TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
};

export default WorkFromHome;
