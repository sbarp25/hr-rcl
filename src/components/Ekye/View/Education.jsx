import { useEffect, useState } from "react";
import { Button, Divider, Form } from "@nextui-org/react";
import { FaDiamond, FaRegEye } from "react-icons/fa6";
import EkyeDetailsComponent from "../../EkyeDetailsComponent";
import RejectComp from "../../RejectComp";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../lib/axios-Instance";
import { FaCheck } from "react-icons/fa6";
import UnderlineComponent from "../../underlinecomponent";

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

  const onApprove = async () => {
    const approve = {
      userId: rclId,
      status: "APPROVED",
    };
    try {
      const response = await axiosInstance.post(
        "/api/v1/approved/users",
        approve,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response?.data?.responseCode === "201") {
        toast.success(response?.data?.message);
        navigate("/AdminEkye");
      } else {
        toast.error(response?.data?.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <>
      <div className="relative max-h-[75vh] overflow-auto flex flex-col items-center  bg-gray-50 h-[75vh] py-6 w-full mx-auto rounded-lg border border-gray-300">
        <div className="bg-white text-lg w-[75vw]  rounded-lg px-6 mt-2 mx-1">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold flex mb-6">
              <span className="relative">
                Education Details
                <UnderlineComponent />
              </span>
            </h1>
            <div className="flex gap-1 items-end justify-end text-right">
              <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
              <div className="flex w-2 h-2 rounded-full bg-black"></div>
              <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>

          {employeeData?.educationalDetails?.length > 0 ? (
            employeeData.educationalDetails.map((education, index) => (
              <div key={index} className="mb-6 p-4 rounded-md ">
                <Form className="py-6 gap-6">
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
                      {educationDocuments[index] ? (
                        <a
                          href={education.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-green-600 underline mb-2">
                          <span className="flex items-center gap-x-2">
                            <FaRegEye />
                            View Certificate
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
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No Education Details Available
            </div>
          )}
        </div>
      </div>
      <div className="absolute right-28 -mt-20 flex items-end justify-end  gap-4">
        <RejectComp employeeData={employeeData} />
        <Button className="bg-teal-500 text-white" onPress={onApprove}>
          <FaCheck />
          Approve
        </Button>
      </div>
    </>
  );
};

export default EkyeEducationDetails;
