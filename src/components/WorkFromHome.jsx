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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-full">
      {WorkfromHomeDate && WorkfromHomeDate.length > 0 ? (
        <div>
          {WorkfromHomeDate.map((data) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 mr-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full font-bold shadow-md text-lg bg-green-100 border border-green-600 text-green-600">
                    {data?.fullName?.charAt(0) || "?"}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {data.fullName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Team Lead: {data.teamLeaderName}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium text-gray-500">From:</span>
                    <span className="ml-1 text-gray-800">
                      {formatDate(data.leaveStartDate)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-500">To:</span>
                    <span className="ml-1 text-gray-800">
                      {formatDate(data.leaveEndDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          No Data available
        </div>
      )}
    </div>
  );
};

export default WorkFromHome;
