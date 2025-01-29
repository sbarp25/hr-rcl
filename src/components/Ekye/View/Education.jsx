import React from "react";
import { Button, Form, Input } from "@nextui-org/react";
import { IoEyeOutline } from "react-icons/io5";
import { FaDiamond } from "react-icons/fa6";

const EkyeEducationDetails = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white py-6 w-[60vw] mx-auto mt-8  border-2 rounded-md   ">
      <div className="flex items-center  gap-[60vh]">
        <div className=" flex text-bold text-4xl font-Poppins w-full text-left px-2 py-2 mt-3 underline underline-offset-4 decoration-red-500  ">
          <FaDiamond className="h-5 w-3 text-red-700  mt-7 ml-3" />
          Education Detail
        </div>
        <div className="flex gap-1 items-end justify-end text-right">
          <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
          <div className="flex w-2 h-2 rounded-full bg-black"></div>
          <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
        </div>
      </div>
      <div className="bg-white  text-lg w-[85%]  shadow-md rounded-lg p-6 mt-2 ">
        <h1 className=" flex py-2 text-left text-xl font-semibold underline underline-offset-4 decoration-red-500">
          <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
          Education Details
        </h1>
        <Form className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Row 1 */}
          <Input
            isReadOnly
            label="
Level"
            labelPlacement="outside"
            name="
Level"
            placeholder="Bachelor"
            className="w-full"
          />
          <Input
            isReadOnly
            label="Start Year"
            labelPlacement="outside"
            name="Start Year"
            placeholder="2076"
            className="w-full"
          />
          <Input
            isReadOnly
            label="End Year"
            labelPlacement="outside"
            name="End Year"
            placeholder="2076"
            className="w-full"
          />

          {/* Row 2 */}
          <Input
            isReadOnly
            label="Status"
            labelPlacement="outside"
            name="Status"
            placeholder="Complete"
            className="w-full"
          />
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

      {/* Buttons Section */}
      <div className="mt-6 flex justify-end w-[90%] px-8 mb-3">
        <Button className="bg-red-700 text-white mx-2">Reject</Button>
        <Button className="bg-green-700 text-white mx-2">Accept</Button>
      </div>
    </div>
  );
};

export default EkyeEducationDetails;
