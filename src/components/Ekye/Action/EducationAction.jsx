import { useEffect, useState } from "react";
import { Divider, Form, Button } from "@heroui/react";
import { FaRegEye } from "react-icons/fa6";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

import EkyeDetailsComponent from "../../ui/EkyeDetailsComponent.jsx";
import RejectComp from "../../RejectComp";
import { FaCheck } from "react-icons/fa6";
import UnderlineComponent from "../../ui/UnderlineComponent.jsx";
import Loader from "../../Loader/Loader.jsx";
import {
  hasApproveAccess,
  hasUpdateAccess,
  MENU_NAMES,
} from "../../../utils/permissionUtils.js";
import { FaTimes } from "react-icons/fa";

const EducationAction = ({ employeeData }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [educationDocument, setEducationDocument] = useState(false);
  const { rclId } = useParams();

  useEffect(() => {
    if (employeeData?.educationalDetails) {
      const docStatus = {};
      employeeData.educationalDetails.forEach((edu, index) => {
        docStatus[index] = !!edu.documentUrl;
      });
      setEducationDocument(docStatus);
    }
  }, [employeeData]);

  const hasEKYEApproveAccess = hasApproveAccess(MENU_NAMES.EKYE);
  const onApprove = async () => {
    const submitData = {
      userId: rclId,
      status: "APPROVED",
    };
    try {
      setIsLoading(true);
      if (hasEKYEApproveAccess) {
        const response = await axiosInstance.post(
          "/api/v1/approved/users",
          submitData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response?.data?.responseCode === "201") {
          navigate("/AdminEkye");
        } else {
          toast.error(response?.data?.error?.errorList?.[0]?.errorMessage);
        }
      } else {
        toast.error("Access Denied");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(true);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="relative flex flex-col bg-white dark:bg-black mt-16 border border-black dark:border-slate-600 rounded-b-md shadow-lg p-8">
        {/* Header Section */}
        <div className="absolute bg-black  w-auto rounded-t-2xl -top-12   -left-0.5 px-6 py-2">
          <h1 className="text-2xl font-semibold text-white">
            Education Details
          </h1>
        </div>

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
                      <label className="text-black font-semibold text-sm">
                        Education Certificate
                      </label>
                      {educationDocument[index] ? (
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

export default EducationAction;
