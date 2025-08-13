import { useEffect, useState } from "react";
import { Button, Divider, Form } from "@heroui/react";
import { FaRegEye } from "react-icons/fa6";
import EkyeDetailsComponent from "../../ui/EkyeDetailsComponent.jsx";
import RejectComp from "../../RejectComp";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../lib/axios-Instance";
import { FaCheck } from "react-icons/fa6";
import UnderlineComponent from "../../ui/UnderlineComponent.jsx";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import {
  hasApproveAccess,
  hasUpdateAccess,
  MENU_NAMES,
} from "../../../utils/permissionUtils.js";

const EkyeEducationDetails = ({ employeeData }) => {
  const navigate = useNavigate();
  const [educationDocuments, setEducationDocuments] = useState({});

  const { rclId } = useParams();

  useEffect(() => {
    if (employeeData?.educationalDetails) {
      const docStatus = {};
      employeeData.educationalDetails.forEach((edu, index) => {
        docStatus[index] = !!edu.documentUrl;
      });
      setEducationDocuments(docStatus);
    }
  }, [employeeData]);

  const hasEKYEApproveAccess = hasApproveAccess(MENU_NAMES.EKYE);
  const onApprove = async () => {
    const approve = {
      userId: rclId,
      status: "APPROVED",
    };
    try {
      if (hasEKYEApproveAccess) {
        const response = await axiosInstance.post(
          "/api/v1/approved/users",
          approve,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response?.data?.responseCode === "201") {
          navigate("/AdminEkye");
        } else {
          toast.error(response?.data?.error?.errorList?.[0]?.errorMessage);
        }
      } else {
        toast.error("You currently dont have access to this setting ");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <>
      {/* {isLoading && <Loader />} */}
      <div className="relative flex flex-col bg-white dark:bg-black  border border-gray-300 dark:border-slate-700 rounded-b-md shadow-xl p-8">
        {/* Single Form Section */}
        <div className="bg-white dark:bg-black text-lg  rounded-lg px-6 mt-2 mx-1">
          <h1 className="text-xl font-semibold flex mb-6">
            <span className="relative">
              Education Details
              <UnderlineComponent />
            </span>
          </h1>

          {employeeData?.educationalDetails?.length > 0 ? (
            employeeData.educationalDetails.map((education, index) => (
              <div key={index} className="mb-6 p-4 rounded-md ">
                <div className="w-full py-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
                    <EkyeDetailsComponent
                      label="Level"
                      placeholder={education.degree}
                    />
                    <EkyeDetailsComponent
                      label="Institute"
                      placeholder={education.institution}
                    />
                    <EkyeDetailsComponent
                      label="Faculty"
                      placeholder={education.faculty}
                    />
                  </div>
                  <Divider />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
                    <EkyeDetailsComponent
                      label="Start Date"
                      placeholder={education.startYear}
                    />
                    <EkyeDetailsComponent
                      label="End Date"
                      placeholder={education.endYear}
                    />
                    <EkyeDetailsComponent
                      label="Status"
                      placeholder={education.status}
                    />
                  </div>
                  <Divider />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
                    <div>
                      <label className="text-black dark:text-white font-semibold text-sm">
                        Education Certificate
                      </label>
                      {educationDocuments[index] ? (
                        <a
                          href={education.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-green-600 underline mb-2">
                          <span className="flex items-center gap-x-2">
                            <FaRegEye />
                            View Uploaded Certificate
                          </span>
                        </a>
                      ) : (
                        <div className="text-xs text-red-500">
                          No Links Available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Divider />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No Education Details Available
            </div>
          )}
        </div>
        {/* Buttons Section  */}
        {employeeData?.approvalStatus === "PENDING" ? (
          <div className="flex items-center justify-end gap-4 w-full px-8 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black">
            <RejectComp employeeData={employeeData} />
            <Button
              className="bg-teal-500 hover:bg-active text-white inline-flex items-center gap-2  cursor-pointer"
              onPress={onApprove}>
              <FaCheck />
              {employeeData?.approvalStatus === "REJECTED"
                ? "Re-approve"
                : "Approve"}
            </Button>
          </div>
        ) : employeeData?.approvalStatus === "APPROVED" ? (
          <div className="flex items-center justify-end gap-2 text-green-700 border border-green-700 bg-green-400/10 w-fit p-1 rounded-2xl">
            <span className="text-sm">Approved</span>
          </div>
        ) : employeeData?.approvalStatus === "REJECTED" ? (
          <div className="flex items-center justify-end gap-2 text-red-700 border border-red-700 bg-red-400/10 w-fit p-1 rounded-2xl">
            {/* <FaTimes className="text-red-500" /> */}
            <span className="text-sm">Rejected</span>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default EkyeEducationDetails;
