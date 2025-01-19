import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";

const LeaveStatus = () => {
  const data = {
    employee: {
      id: "EMP12345",
      name: "Jane Doe",
      designation: "Frontend Developer",
      department: "Engineering",
    },
    leaveRequests: [
      {
        leaveId: "LV20241231",
        leaveType: "Paid Leave",
        startDate: "2024-12-20",
        endDate: "2024-12-25",
        daysRequested: 5,
        status: "Approved",
        remarks: "Enjoy your vacation!",
        approver: {
          name: "John Smith",
          designation: "Engineering Manager",
        },
        appliedOn: "2024-12-15",
        history: [
          {
            date: "2024-12-15",
            action: "Applied",
            comment: "Submitted for approval",
          },
          {
            date: "2024-12-16",
            action: "Approved",
            comment: "Approved by John Smith",
          },
        ],
      },
      {
        leaveId: "LV20240105",
        leaveType: "Sick Leave",
        startDate: "2024-12-28",
        endDate: "2024-12-30",
        daysRequested: 3,
        status: "Pending",
        remarks: "",
        approver: {
          name: "John Smith",
          designation: "Engineering Manager",
        },
        appliedOn: "2024-12-27",
        history: [
          {
            date: "2024-12-27",
            action: "Applied",
            comment: "Submitted for approval",
          },
        ],
      },
    ],
  };
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Leave", href: "" },
    { label: "Leave Status", href: "/Leave/Status" },
  ];
  const statusColors = {
    Approved: "bg-green-500 text-white",
    Pending: "bg-yellow-500 text-white",
    Rejected: "bg-red-500 text-white",
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Leave Status</h1>
      <BreadcrumbsComponent items={breadcrumbItems} />
      <h2 className="text-xl font-semibold text-center mb-6">
        {data.employee.name} ({data.employee.designation})
      </h2>
      <div className="overflow-y-auto max-h-96">
        {data.leaveRequests.map((request) => (
          <div
            key={request.leaveId}
            className="border border-gray-300 rounded-lg mb-4 p-4 bg-gray-50">
            <h3 className="text-lg font-semibold">{request.leaveType}</h3>
            <p>
              <strong>Leave ID:</strong> {request.leaveId}
            </p>
            <p>
              <strong>Dates:</strong> {request.startDate} to {request.endDate}
            </p>
            <p>
              <strong>Days Requested:</strong> {request.daysRequested}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`inline-block px-3 py-1 rounded ${
                  statusColors[request.status]
                }`}>
                {request.status}
              </span>
            </p>
            <p>
              <strong>Remarks:</strong> {request.remarks || "N/A"}
            </p>
            <p>
              <strong>Approver:</strong> {request.approver.name} (
              {request.approver.designation})
            </p>
            <p>
              <strong>Applied On:</strong> {request.appliedOn}
            </p>
            <div className="mt-4">
              <strong>History:</strong>
              {request.history.map((history, index) => (
                <div
                  key={index}
                  className="mt-2 text-sm text-gray-700 border-t pt-2">
                  <strong>{history.date}:</strong> {history.action} (
                  {history.comment})
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveStatus;
