import React, { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios-Instance";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import GoBack from "../../../components/GoBack";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosRemoveCircle } from "react-icons/io";
const LeaveView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [leaveByIdData, setLeaveByIdData] = useState({});
  const { id } = useParams();

  const menu = LocalStorageUtil.getItem("menu");

  /**To check Employee see status */
  const hasaccess = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 56)
  );

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
  useEffect(() => {
    fetchLeaveById();
  }, [id]);

  // useEffect(() => {
  //   if (!hasaccess) {
  //     navigate("/dashboard");
  //   }
  // }, [navigate]);

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
        <GoBack />
        <h1 className="text-2xl font-bold">Leave Details</h1>
        <div></div>
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
                ID:
                {leaveByIdData?.rclId || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Card content */}
        <div className="p-6 space-y-4">
          {/* Leave Type and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-3 border-b border-gray-300">
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
            <div>
              <span className="text-gray-600 text-sm">Leave Title</span>
              <p className="text-gray-800 font-semibold">
                {leaveByIdData?.title ? leaveByIdData.title : "N/A"}
              </p>
            </div>
          </div>

          {/* Subject */}
          <div className="pb-3 border-b border-gray-300">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-600 text-sm">Body</span>
            </div>
            <p className="text-gray-800 ">
              {leaveByIdData?.leaveSubject || "N/A"}
            </p>
          </div>

          {/* Date Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-3 border-b border-gray-300">
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
            {leaveByIdData?.rejectedData && (
              <div className="flex items-start gap-2">
                <div>
                  <span className="text-gray-600 text-sm">Rejected Date</span>
                  <p className="text-gray-800">
                    {leaveByIdData?.rejectedData || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Team Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div className="pt-3 border-t border-gray-300">
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
            <div className="pt-3 border-t border-gray-300">
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
            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-gray-700">
                  Team Lead:
                </span>
                {leaveByIdData?.isTeamLeadApproved === true ? (
                  <FaCircleCheck className="text-green-500 w-5 h-5" />
                ) : leaveByIdData?.isTeamLeadApproved === false ? (
                  <IoIosRemoveCircle className="text-red-500 w-5 h-5" />
                ) : (
                  <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-2xl border-2 border-yellow-300">
                    Pending
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-gray-700">
                  Associate Team Lead:
                </span>
                {leaveByIdData?.isAssociateTeamLeadApproved === true ? (
                  <FaCircleCheck className="text-green-500 w-5 h-5" />
                ) : leaveByIdData?.isAssociateTeamLeadApproved === false ? (
                  <IoIosRemoveCircle className="text-red-500 w-5 h-5" />
                ) : (
                  <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-2xl border-2 border-yellow-300">
                    Pending
                  </span>
                )}
              </div>
            </div>

            <div
              className={`flex justify-center items-center px-3 py-1 rounded-2xl text-sm  border-2  ${
                leaveByIdData?.leaveStatus === "APPROVED"
                  ? "bg-green-100 text-green-800 border-green-300"
                  : leaveByIdData?.leaveStatus === "REJECTED"
                  ? "bg-red-100 text-red-800 border-red-300"
                  : "bg-yellow-100 text-yellow-800 border-yellow-300"
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
