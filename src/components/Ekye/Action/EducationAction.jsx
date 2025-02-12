import React from "react";
import { Divider, Form, Input, Button } from "@nextui-org/react";
import { FaDiamond } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EducationAction = () => {
  const navigate = useNavigate();
  const onApprove = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/approved/users",
        {},
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
  // const onReject= async()=>{
  //   try{
  //     const response = await axiosInstance.post(

  //     )
  //   }
  // }
  return (
    <div className="relative flex flex-col bg-white mt-16 border-2 rounded-md shadow-lg p-8">
      {/* Header Section */}
      <div className="absolute bg-black w-auto rounded-t-2xl -top-12   left-1 px-6 py-2">
        <h1 className="text-2xl font-bold text-white">Education Detail</h1>
      </div>

      {/* Single Form Section */}
      <Form className="mt-8 grid grid-cols-1 gap-12">
        {/* Education Details Section */}
        <div className="bg-white text-lg p-6 rounded-lg">
          <h1 className="text-xl font-semibold flex underline underline-offset-4 decoration-red-500 mb-6">
            <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-2" />
            Education Details
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <Input
                isReadOnly
                label="Level"
                labelPlacement="outside"
                name="educationLevel"
                placeholder="Bachelor"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Start Year"
                labelPlacement="outside"
                name="startYear"
                placeholder="2076"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="End Year"
                labelPlacement="outside"
                name="endYear"
                placeholder="2076"
              />
            </div>
          </div>
          <Divider className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                isReadOnly
                label="Status"
                labelPlacement="outside"
                name="status"
                placeholder="Complete"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black font-medium">Education Photo</label>
              <button className="text-blue-500 flex items-center">
                <IoEyeOutline size={20} className="mr-1" />
                View Photo
              </button>
            </div>
          </div>
          <Divider className="mt-6" />
        </div>
      </Form>

      {/* Buttons Section */}
      <div className="mt-6 flex justify-end gap-4">
        <Button className="bg-red-700 text-white">Reject</Button>
        <Button className="bg-green-700 text-white" onPress={onApprove}>
          Accept
        </Button>
      </div>
    </div>
  );
};

export default EducationAction;
