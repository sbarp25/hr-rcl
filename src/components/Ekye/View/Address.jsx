import React from "react";
import { Button, Form, Input } from "@nextui-org/react";
import { FaDiamond } from "react-icons/fa6";

const EkyeAdreess = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white w-[60vw] mx-auto mt-8   rounded-md">
      <div className="flex items-center gap-[65vh] ">
        <div className=" flex text-bold text-4xl font-Poppins w-full text-left px-2 py-2 mt-3  underline underline-offset-4 decoration-red-500 ">
          <FaDiamond className="h-5 w-3 text-red-700  mt-7 ml-3" />
          Address detail
        </div>
        <div className="flex gap-1 items-end justify-end text-right">
          <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
          <div className="flex w-2 h-2 rounded-full bg-black"></div>
          <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
        </div>
        {/* Personal Information Section */}
      </div>
      <div className="bg-white mt-6 text-lg w-[85%] p-6 shadow-md rounded-lg ">
        <h1 className="py-2 text-left text-xl font-semibold font-Poppins flex underline underline-offset-4 decoration-red-500 ">
          <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
          Permanent Address Details
        </h1>
        <Form className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6 w-full h-[10vw]">
          {/* Row 1 */}
          <Input
            isReadOnly
            label="Provinces "
            labelPlacement="outside"
            name="Provinces "
            placeholder="2"
            className="w-full"
          />
          <Input
            isReadOnly
            label="District"
            labelPlacement="outside"
            name="District"
            placeholder="Kathamndu"
            className="w-full"
          />
          <Input
            isReadOnly
            label="Municipality"
            labelPlacement="outside"
            name="Municipality"
            placeholder="Kathmandu"
            className="w-full"
          />

          {/* Row 2 */}
          <Input
            isReadOnly
            label="Ward No"
            labelPlacement="outside"
            name="Ward No"
            placeholder="05"
            className="w-full"
          />
          <Input
            isReadOnly
            label="Pincode"
            labelPlacement="outside"
            name="Pincode"
            placeholder="012546"
            className="w-full"
          />
          <Input
            isReadOnly
            label="Tole/Arear:"
            labelPlacement="outside"
            name="Tole/Arear:"
            placeholder="Manamaiju mandir"
            className="w-full"
          />
        </Form>
      </div>
      <div className="bg-white mt-6 text-lg w-[85%] p-6 shadow-md rounded-lg">
        <h1 className="py-2 text-left text-xl font-semibold flex underline underline-offset-4 decoration-red-500">
          <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
          Temporary Address Details
        </h1>
        <Form className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {/* Row 1 */}
          <Input
            isReadOnly
            label="Provinces "
            labelPlacement="outside"
            name="Provinces "
            placeholder="2"
            className="w-full"
          />
          <Input
            isReadOnly
            label="District"
            labelPlacement="outside"
            name="District"
            placeholder="Kathamndu"
            className="w-full"
          />
          <Input
            isReadOnly
            label="Municipality"
            labelPlacement="outside"
            name="Municipality"
            placeholder="Kathmandu"
            className="w-full"
          />

          {/* Row 2 */}
          <Input
            isReadOnly
            label="Ward No"
            labelPlacement="outside"
            name="Ward No"
            placeholder="05"
            className="w-full"
          />
          <Input
            isReadOnly
            label="Pincode"
            labelPlacement="outside"
            name="Pincode"
            placeholder="012546"
            className="w-full"
          />
          <Input
            isReadOnly
            label="Tole/Arear:"
            labelPlacement="outside"
            name="Tole/Arear:"
            placeholder="Manamaiju mandir"
            className="w-full"
          />
        </Form>
      </div>

      {/* Buttons Section */}
    </div>
  );
};

export default EkyeAdreess;
