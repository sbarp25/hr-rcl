import { Button, Form, Input } from "@nextui-org/react";
import React from "react";
import { FaDiamond } from "react-icons/fa6";

const ViewPage = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white w-[60vw] mx-auto mt-8  rounded-md  h-[40vw]  ">
      <div className="flex items-center  gap-[55vh]">
        <div className=" flex text-bold text-4xl font-Poppins w-full text-left px-2 py-2 mt-7 underline underline-offset-4 decoration-red-500 ">
          <FaDiamond className="h-5 w-3 text-red-700  mt-7 ml-3" />
          Personal Information
        </div>
        <div className="flex gap-1 items-end justify-end text-right">
          <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
          <div className="flex w-2 h-2 rounded-full bg-black"></div>
          <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
        </div>
        {/* Personal Information Section */}
      </div>
      <div className="bg-white mt-6 text-lg w-[85%] p-6 shadow-md rounded-lg">
        <h1 className="py-2 text-left text-xl font-semibold flex underline underline-offset-4 decoration-red-500">
          <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
          Personal Information Details
        </h1>
        <Form className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6 w-full h-[10vw]">
          {/* Row 1 */}
          <Input
            isReadOnly
            label="Name"
            labelPlacement="outside"
            name="name"
            placeholder="Prativa Oli"
            className="w-full"
          />
          <Input
            isReadOnly
            label="Age"
            labelPlacement="outside"
            name="age"
            placeholder="24"
            className="w-full"
          />
          <Input
            isReadOnly
            label="Gender"
            labelPlacement="outside"
            name="gender"
            placeholder="Female"
            className="w-full"
          />

          {/* Row 2 */}
          <Input
            isReadOnly
            label="Phone No."
            labelPlacement="outside"
            name="phone"
            placeholder="98523156"
            className="w-full"
          />
          <Input
            isReadOnly
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder="Prativaoli@gmail.com"
            className="w-full"
          />
          <Input
            isReadOnly
            label="Date of Birth"
            labelPlacement="outside"
            name="dob"
            placeholder="2057/04/12"
            className="w-full"
          />

          {/* Row 3 */}
          <Input
            isReadOnly
            label="Blood Type"
            labelPlacement="outside"
            name="bloodType"
            placeholder="+O"
            className="w-full"
          />
          <Input
            isReadOnly
            label="Department"
            labelPlacement="outside"
            name="department"
            placeholder="UI/UX"
            className="w-full"
          />
          <Input
            isReadOnly
            label="Position"
            labelPlacement="outside"
            name="position"
            placeholder="Junior"
            className="w-full"
          />
        </Form>
      </div>

      {/* Guardian and Emergency Details Side-by-Side */}
      <div className="flex justify-between w-[90%] mt-8 px-8 gap-6">
        {/* Guardian Details Section */}
        <div className="bg-white text-lg w-[50%] p-6 shadow-md rounded-lg">
          <h1 className="text-lg font-semibold mb-4 text-left flex underline underline-offset-4 decoration-red-500">
            <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
            Guardian Details
          </h1>
          <Form className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Row 1: Two inputs */}
            <Input
              isReadOnly
              label="Guardian Name"
              labelPlacement="outside"
              name="guardianName"
              placeholder="Sapana Roka"
              className="w-full"
            />
            <Input
              isReadOnly
              label="Guardian Number"
              labelPlacement="outside"
              name="guardianNumber"
              placeholder="85909055"
              className="w-full"
            />

            {/* Row 2: One input spanning full width */}
            <Input
              isReadOnly
              label="Guardian Relationship"
              labelPlacement="outside"
              name="guardianRelationship"
              placeholder="Sister"
              className="col-span-2 w-full"
            />
          </Form>
        </div>

        {/* Emergency Details Section */}
        <div className="bg-white text-lg w-[50%] p-6 shadow-md rounded-lg">
          <h1 className="text-lg font-semibold mb-4 text-left flex underline underline-offset-4 decoration-red-500">
            <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
            Emergency Details
          </h1>
          <Form className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Row 1: Two inputs */}
            <Input
              isReadOnly
              label="Emergency Name"
              labelPlacement="outside"
              name="emergencyName"
              placeholder="Kumar Thapa"
              className="w-full"
            />
            <Input
              isReadOnly
              label="Emergency Number"
              labelPlacement="outside"
              name="emergencyNumber"
              placeholder="85909055"
              className="w-full"
            />

            {/* Row 2: One input spanning full width */}
            <Input
              isReadOnly
              label="Emergency Relationship"
              labelPlacement="outside"
              name="emergencyRelationship"
              placeholder="Uncle"
              className="col-span-2 w-full"
            />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ViewPage;
