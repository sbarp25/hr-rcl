import { useEffect, useState } from "react";
import { Divider, Form, Button } from "@nextui-org/react";
import { FaRegEye } from "react-icons/fa6";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

import EkyeDetailsComponent from "../../EkyeDetailsComponent";
import RejectComp from "../../RejectComp";
import { FaCheck } from "react-icons/fa6";
import UnderlineComponent from "../../ui/UnderlineComponent.jsx";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import Loader from "../../Loader/Loader.jsx";

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
  const menu = LocalStorageUtil.getItem("menu");

  const hasApproveAccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 17)
  );
  const onApprove = async () => {
    const submitData = {
      userId: rclId,
      status: "APPROVED",
      remark: "Congrulations",
    };
    try {
      if (hasApproveAccess) {
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
          toast.success(response?.data?.message);
          navigate("/AdminEkye");
        } else {
          toast.error(response?.data?.data?.message);
        }
      } else {
        toast.error("Access Denied");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="relative flex flex-col bg-white mt-16 border border-black rounded-b-md shadow-lg p-8">
        {/* Header Section */}
        <div className="absolute bg-black w-auto rounded-t-2xl -top-12   -left-0.5 px-6 py-2">
          <h1 className="text-2xl font-semibold text-white">
            Education Details
          </h1>
        </div>

        {/* Single Form Section */}
        <div className="bg-white text-lg w-[45vw] rounded-lg px-6 mt-2 mx-1">
          <h1 className="text-xl font-semibold flex mb-6">
            <span className="relative">
              Education Details
              <UnderlineComponent />
            </span>
          </h1>

          {employeeData?.educationalDetails?.length > 0 ? (
            employeeData.educationalDetails.map((education, index) => (
              <div key={index} className="mb-6 p-4 rounded-md ">
                <Form className="w-full py-6 gap-6">
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
                </Form>
                <Divider />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No Education Details Available
            </div>
          )}
        </div>

        {/* Buttons Section */}
        {employeeData?.status === "PENDING" ||
          (employeeData?.status === "REJECTED" && (
            <div className="mt-6 flex justify-end gap-4">
              <RejectComp employeeData={employeeData} />
              <Button className="bg-emerald-500 text-white" onPress={onApprove}>
                <FaCheck />
                Approve
              </Button>
            </div>
          ))}
      </div>
    </>
  );
};

export default EducationAction;
