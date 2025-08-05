import { useEffect, useState } from "react";
import GoBack from "../../../components/GoBack";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosRemoveCircle } from "react-icons/io";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import { hasReadAccess, MENU_NAMES } from "../../../utils/permissionUtils";

const ViewWorkFromHome = () => {
  const [workFromHomeByIdData, setWorkFromHomeByIdData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const hasaccess = hasReadAccess(MENU_NAMES.WFHSTATUS);
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  const fetchWFHById = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/api/leave/leaveId", {
        data: { rclId: id },
      });
      if (response.data.responseCode === "200") {
        setWorkFromHomeByIdData(response.data.datalist[0]);
        // toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching Leave.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchWFHById();
  }, [id]);

  const formatStatus = (status) => {
    if (!status) return "PENDING";
    return status.replace(/_/g, " ");
  };
  return (
    <div className=" mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <GoBack />
        <h1 className="text-2xl font-bold">WFH Details</h1>
        <div></div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with leave ID */}
        <div className="bg-blue-50 p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Work Form Home Request
            </h2>
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                ID:
                {workFromHomeByIdData?.rclId || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Card content */}
        <div className="p-6 space-y-4">
          {/* Leave Type and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-3 border-b border-gray-300">
            <div>
              <span className="text-gray-600 text-sm">
                Work From Home Title
              </span>
              <p className="text-gray-800 font-semibold">
                {workFromHomeByIdData?.title
                  ? workFromHomeByIdData.title
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Subject */}
          <div className="pb-3 border-b border-gray-300">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-600 text-sm">Body</span>
            </div>
            <p className="text-gray-800 ">
              {workFromHomeByIdData?.leaveSubject || "N/A"}
            </p>
          </div>

          {/* Date Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-3 border-b border-gray-300">
            <div className="flex items-start gap-2">
              <div>
                <span className="text-gray-600 text-sm">
                  Work from home Period
                </span>
                <p className="text-gray-800">
                  {workFromHomeByIdData?.leaveStartDate || "N/A"} to{" "}
                  {workFromHomeByIdData?.leaveEndDate || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div>
                <span className="text-gray-600 text-sm">Request Date</span>
                <p className="text-gray-800">
                  {workFromHomeByIdData?.requestDate || "N/A"}
                </p>
              </div>
            </div>

            {workFromHomeByIdData?.approvedDate && (
              <div className="flex items-start gap-2">
                <div>
                  <span className="text-gray-600 text-sm">Approved Date</span>
                  <p className="text-gray-800">
                    {workFromHomeByIdData?.approvedDate || "N/A"}
                  </p>
                </div>
              </div>
            )}
            {workFromHomeByIdData?.rejectedData && (
              <div className="flex items-start gap-2">
                <div>
                  <span className="text-gray-600 text-sm">Rejected Date</span>
                  <p className="text-gray-800">
                    {workFromHomeByIdData?.rejectedData || "N/A"}
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
                  {workFromHomeByIdData?.teamLeaderName || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div>
                <span className="text-gray-600 text-sm">
                  Associate Team Lead
                </span>
                <p className="text-gray-800">
                  {workFromHomeByIdData?.associateTeamLeadName || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Approval Information */}
          {workFromHomeByIdData?.approvedBy && (
            <div className="pt-3 border-t border-gray-300">
              <div className="flex items-start gap-2">
                <div>
                  <span className="text-gray-600 text-sm">Approved By</span>
                  <p className="text-gray-800">
                    {workFromHomeByIdData?.approvedBy || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rejection Information */}
          {workFromHomeByIdData?.rejectedBy && (
            <div className="pt-3 border-t border-gray-300">
              <div>
                <span className="text-gray-600 text-sm">Rejected By</span>
                <p className="text-gray-800">
                  {workFromHomeByIdData?.rejectedBy || "N/A"}
                </p>
              </div>
              {workFromHomeByIdData?.rejectionRemark && (
                <div className="mt-2">
                  <span className="text-gray-600 text-sm">
                    Rejection Remark
                  </span>
                  <p className="text-gray-800">
                    {workFromHomeByIdData?.rejectionRemark}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with status */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-gray-700">
                Team Lead:
              </span>
              {workFromHomeByIdData?.isTeamLeadApproved === true ? (
                <FaCircleCheck className="text-green-500 w-5 h-5" />
              ) : workFromHomeByIdData?.isTeamLeadApproved === false ? (
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
              {workFromHomeByIdData?.isAssociateTeamLeadApproved === true ? (
                <FaCircleCheck className="text-green-500 w-5 h-5" />
              ) : workFromHomeByIdData?.isAssociateTeamLeadApproved ===
                false ? (
                <IoIosRemoveCircle className="text-red-500 w-5 h-5" />
              ) : (
                <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-2xl border-2 border-yellow-300">
                  Pending
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <div
              className={`px-3 py-1 rounded text-sm font-medium ${
                workFromHomeByIdData?.leaveStatus === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : workFromHomeByIdData?.leaveStatus === "REJECTED"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}>
              {formatStatus(workFromHomeByIdData?.leaveStatus)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewWorkFromHome;
