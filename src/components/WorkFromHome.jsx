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
        className="min-w-full h-auto max-h-[50vh] overflow-auto">
        <TableHeader className="capitalize">
          <TableColumn>S.N</TableColumn>
          <TableColumn>RCL-ID</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Team Lead</TableColumn>
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
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
      {(!WorkfromHomeDate || WorkfromHomeDate.length === 0) && (
        <div className="p-8 text-center text-gray-500">No data available</div>
      )}
    </div>
  );
};

export default WorkFromHome;
