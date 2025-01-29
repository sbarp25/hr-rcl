import React from "react";
import { Button, Divider, Form, Input } from "@nextui-org/react";
import { IoEyeOutline } from "react-icons/io5";
import { FaDiamond } from "react-icons/fa6";

const EkyeDocumentDetail = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white py-6 border-solid w-[60vw] mx-auto mt-8 border-2 rounded-md     ">
      <div className="flex items-center  gap-[60vh]">
        <div className=" flex text-bold text-4xl font-Poppins w-full text-left px-2 py-2 mt-3 underline underline-offset-4 decoration-red-500 ">
          <FaDiamond className="h-5 w-3 text-red-700  mt-7 ml-3" />
          Document Detail
        </div>
        <div className="flex gap-1 items-end justify-end text-right">
          <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
          <div className="flex w-2 h-2 rounded-full bg-black"></div>
          <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
        </div>
      </div>

      {/* Guardian and Emergency Details Side-by-Side */}
      <div className="flex justify-between w-[90%] mt-2 px-8 gap-6">
        {/* Guardian Details Section */}
        <div className="bg-white text-lg w-[50%] p-6 shadow-md rounded-lg">
          <h1 className="text-lg font-semibold mb-4 text-left flex underline underline-offset-4 decoration-red-500">
            <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
            Citizenship Details
          </h1>
          <Form className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Row 1: Two inputs */}
            <Input
              isReadOnly
              label="Citizenship Number"
              labelPlacement="outside"
              name="Citizenship Number"
              placeholder="345689000000"
              className="w-full"
            />
            <Input
              isReadOnly
              label="Issued Dater"
              labelPlacement="outside"
              name="Issued Date"
              placeholder="2074/8/30"
              className="w-full"
            />

            {/* Row 2: One input spanning full width */}
            <Input
              isReadOnly
              label="Issued Placed"
              labelPlacement="outside"
              name="Issued Placed"
              placeholder="Dang"
              className="w-full"
            />

            <div className="flex flex-col w-full mr-6">
              {/* Label */}
              <label className="text-black font-medium">PAN Photo</label>

              {/* View Photo Button */}
              <button className="text-blue-500 flex items-center self-start">
                <IoEyeOutline size={20} className="" />
                View Photo
              </button>
            </div>
          </Form>
        </div>

        {/* Emergency Details Section */}
        <div className="bg-white text-lg w-[50%] p-6 shadow-md rounded-lg">
          <h1 className="text-lg font-semibold mb-4 text-left flex  underline underline-offset-4 decoration-red-500 ">
            {" "}
            <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
            PAN Details{" "}
          </h1>
          <Form className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Row 1: Two inputs */}
            <Input
              isReadOnly
              label="PAN Number"
              labelPlacement="outside"
              name="PAN Number"
              placeholder="345689000000"
              className="w-full"
            />
            <Input
              isReadOnly
              label="Issued Placed"
              labelPlacement="outside"
              name="Issued Placedr"
              placeholder="Kathmandu"
              className="w-full"
            />

            {/* Row 2: One input spanning full width */}
            <div className="flex flex-col w-full space-y-2">
              {/* Label */}
              <label className="text-black font-medium">PAN Photo</label>

              {/* View Photo Button */}
              <button className="text-blue-500 flex items-center self-start">
                <IoEyeOutline size={20} className="mr-1" />
                View Photo
              </button>
            </div>
          </Form>
        </div>
      </div>

      {/* Buttons Section */}
    </div>
  );
};

export default EkyeDocumentDetail;
