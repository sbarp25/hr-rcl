import { useEffect, useState } from "react";
import { Divider, Form, Button } from "@nextui-org/react";
import { FaRegEye } from "react-icons/fa6";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../Loader";
import EkyeDetailsComponent from "../../EkyeDetailsComponent";
import RejectComp from "../../RejectComp";
import { FaCheck } from "react-icons/fa6";
import UnderlineComponent from "../../underlinecomponent";

const EducationAction = ({ employeeData }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [EducationDocument, setEducationDocument] = useState(false);
  const { rclId } = useParams();
  const educationalDetail = employeeData?.educationalDetails?.[0];

  useEffect(() => {
    if (employeeData?.educationalDetails?.[0].documentUrl) {
      setEducationDocument(true);
    }
  }, []);

  const onApprove = async () => {
    const submitData = {
      userId: rclId,
      status: "APPROVED",
      remark: "Congrulations",
    };
    try {
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
            Education Detail
          </h1>
        </div>

        {/* Single Form Section */}
        <Form className="mt-8 grid grid-cols-1 gap-12">
          {/* Education Details Section */}
          <div className="bg-white text-lg p-6 rounded-lg">
            <h1 className="text-xl font-semibold flex mb-6">
              <span className="relative">
                Education Details
                <UnderlineComponent />
              </span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <EkyeDetailsComponent
                label="level"
                placeholder={educationalDetail?.degree || "N/A"}
              />
              <EkyeDetailsComponent
                label="Institute"
                placeholder={educationalDetail?.institution || "N/A"}
              />
              <EkyeDetailsComponent
                label="Faculty"
                placeholder={educationalDetail?.faculty || "N/A"}
              />
            </div>
            <Divider className="mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EkyeDetailsComponent
                label="Start Date"
                placeholder={educationalDetail?.startYear || "N/A"}
              />
              <EkyeDetailsComponent
                label="End Date"
                placeholder={educationalDetail?.endYear || "N/A"}
              />
              <EkyeDetailsComponent
                label="Status"
                placeholder={educationalDetail?.status || "N/A"}
              />
            </div>
            <Divider className="mt-6 mb-6" />

            <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-black font-semibold text-sm">
                  Education Certificate
                </label>
                {EducationDocument ? (
                  <a
                    href={employeeData?.educationDetails?.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-green-600 underline mb-2">
                    <span className="flex items-center gap-x-2">
                      <FaRegEye />
                      View Uploaded Certificate
                    </span>
                  </a>
                ) : (
                  <div className="text-xs text-red-500">No Links Available</div>
                )}
              </div>
            </div>
          </div>
        </Form>

        {/* Buttons Section */}
        <div className="mt-6 flex justify-end gap-4">
          {/* <Button className="bg-red-700 text-white" onPress={onOpen}>
            Reject
          </Button> */}
          <RejectComp employeeData={employeeData} />
          <Button className="bg-green-700 text-white" onPress={onApprove}>
            <FaCheck />
            Approve
          </Button>
        </div>
        {/**Modal For Reject  */}
      </div>
    </>
  );
};

export default EducationAction;
