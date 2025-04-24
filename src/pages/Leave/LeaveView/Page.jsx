import React, { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios-Instance";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import GoBack from "../../../components/GoBack";
import { FaArrowLeft } from "react-icons/fa";

const LeaveView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [leaveByIdData, setLeaveByIdData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchLeaveById = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/api/leave/leaveId", {
          data: { rclId: id },
        });
        if (response.data.responseCode === "200") {
          setLeaveByIdData(response.data.datalist[0]);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching Leave:", error);
        toast.error("Error fetching Leave.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveById();
  }, [id]);

  const hasaccess = true;
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-lg">Loading leave details...</div>
      </div>
    );
  }

  // Format status for display
  const formatStatus = (status) => {
    if (!status) return "PENDING";
    return status.replace(/_/g, " ");
  };

  return (
    <div className=" mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Leave Details</h1>
        <GoBack />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with leave ID */}
        <div className="bg-blue-50 p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Leave Request
            </h2>
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                ID: {leaveByIdData?.leaveId || "N/A"}
              </span>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                RCL: {leaveByIdData?.rclId || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Card content */}
        <div className="p-6 space-y-4">
          {/* Leave Type and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3 border-b border-gray-100">
            <div>
              <span className="text-gray-600 text-sm">Leave Type</span>
              <p className="text-gray-800 font-semibold">
                {leaveByIdData?.leaveType || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Leave Category</span>
              <p className="text-gray-800 font-semibold">
                {leaveByIdData?.leaveCategory
                  ? leaveByIdData.leaveCategory.replace(/_/g, " ")
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Subject */}
          <div className="pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-600 text-sm">Subject</span>
            </div>
            <p className="text-gray-800 pl-6">
              {leaveByIdData?.leaveSubject || "N/A"}
            </p>
          </div>

          {/* Date Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-3 border-b border-gray-100">
            <div className="flex items-start gap-2">
              <div>
                <span className="text-gray-600 text-sm">Leave Period</span>
                <p className="text-gray-800">
                  {leaveByIdData?.leaveStartDate || "N/A"} to{" "}
                  {leaveByIdData?.leaveEndDate || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div>
                <span className="text-gray-600 text-sm">Request Date</span>
                <p className="text-gray-800">
                  {leaveByIdData?.requestDate || "N/A"}
                </p>
              </div>
            </div>

            {leaveByIdData?.approvedDate && (
              <div className="flex items-start gap-2">
                <div>
                  <span className="text-gray-600 text-sm">Approved Date</span>
                  <p className="text-gray-800">
                    {leaveByIdData?.approvedDate || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Team Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <div>
                <span className="text-gray-600 text-sm">Team Leader</span>
                <p className="text-gray-800">
                  {leaveByIdData?.teamLeaderName || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div>
                <span className="text-gray-600 text-sm">
                  Associate Team Lead
                </span>
                <p className="text-gray-800">
                  {leaveByIdData?.associateTeamLeadName || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Approval Information */}
          {leaveByIdData?.approvedBy && (
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-start gap-2">
                <div>
                  <span className="text-gray-600 text-sm">Approved By</span>
                  <p className="text-gray-800">
                    {leaveByIdData?.approvedBy || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rejection Information */}
          {leaveByIdData?.rejectedBy && (
            <div className="pt-3 border-t border-gray-100">
              <div>
                <span className="text-gray-600 text-sm">Rejected By</span>
                <p className="text-gray-800">
                  {leaveByIdData?.rejectedBy || "N/A"}
                </p>
              </div>
              {leaveByIdData?.rejectionRemark && (
                <div className="mt-2">
                  <span className="text-gray-600 text-sm">
                    Rejection Remark
                  </span>
                  <p className="text-gray-800">
                    {leaveByIdData?.rejectionRemark}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with status */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex justify-end">
            <div
              className={`px-3 py-1 rounded text-sm font-medium ${
                leaveByIdData?.leaveStatus === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : leaveByIdData?.leaveStatus === "REJECTED"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}>
              {formatStatus(leaveByIdData?.leaveStatus)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveView;
