import { useEffect, useState } from "react";
import { Button, Divider, Form } from "@nextui-org/react";
import { FaDiamond, FaRegEye } from "react-icons/fa6";
import EkyeDetailsComponent from "../../EkyeDetailsComponent";
import RejectComp from "../../RejectComp";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../lib/axios-Instance";
import { FaCheck } from "react-icons/fa6";

const EkyeEducationDetails = ({ employeeData }) => {
  const navigate = useNavigate();
  const [EducationDocument, setEducationDocument] = useState(false);

  const educationalDetail = employeeData?.educationalDetails?.[0];
  const { rclId } = useParams();
  useEffect(() => {
    if (employeeData?.educationalDetails?.[0].documentUrl) {
      setEducationDocument(true);
    }
  }, []);
  const onApprove = async () => {
    const approve = {
      userId: rclId,
      status: "APPROVED",
      // remarks: "Congrulations",
    };
    try {
      const response = await axiosInstance.post(
        "/api/v1/approved/users",
        approve,
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
    <div className="relative  max-h-[75vh] overflow-auto flex flex-col items-center bg-gray-50  h-[75vh] py-6 w-full mx-auto rounded-md ">
      <div className="bg-white  text-lg w-[75vw]  shadow-md rounded-lg px-6 mt-2 mx-1 ">
        <div className="flex justify-between items-center">
          <h1 className=" flex py-2 text-left text-xl font-semibold underline underline-offset-4 decoration-red-500">
            <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
            Education Details
          </h1>
          <div className="flex gap-1 items-end justify-end text-right">
            <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
            <div className="flex w-2 h-2 rounded-full bg-black"></div>
            <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
          </div>
        </div>

        <Form className="py-6 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
            <EkyeDetailsComponent
              label="level"
              placeholder={educationalDetail?.degree}
            />
            <EkyeDetailsComponent
              label="Institute"
              placeholder={educationalDetail?.institution}
            />
            <EkyeDetailsComponent
              label="Faculty"
              placeholder={educationalDetail?.faculty}
            />
          </div>
          <Divider />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
            <EkyeDetailsComponent
              label="Start Date"
              placeholder={educationalDetail?.startYear}
            />
            <EkyeDetailsComponent
              label="End Date"
              placeholder={educationalDetail?.endYear}
            />
            <EkyeDetailsComponent
              label="Status"
              placeholder={educationalDetail?.status}
            />
          </div>
          <Divider />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
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
        </Form>
      </div>

      <div className="mt-52 ml-[62vw] flex justify-end items-end gap-4">
        <RejectComp employeeData={employeeData} />
        <Button className="bg-green-700 text-white" onPress={onApprove}>
          <FaCheck />
          Approve
        </Button>
      </div>
    </div>
  );
};

export default EkyeEducationDetails;
