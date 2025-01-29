import React from "react";
import { Divider, Form, Input } from "@nextui-org/react";
import { FaDiamond } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";

const DocumentAction = () => {
  return (
    <div className="relative flex flex-col bg-white mt-16 border-2 rounded-md shadow-lg p-8">
      {/* Header Section */}
      <div className="absolute bg-black w-auto rounded-t-2xl -top-12   left-1  px-6 py-2">
        <h1 className="text-2xl font-bold text-white">Document Detail</h1>
      </div>

      {/* Single Form Section */}
      <Form className="mt-8 grid grid-cols-1 gap-12">
        {/* Citizenship Details Section */}
        <div className="bg-white text-lg p-6 rounded-lg">
          <h1 className="text-xl font-semibold flex underline underline-offset-4 decoration-red-500 mb-6">
            <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-2" />
            Citizenship Details
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <Input
                isReadOnly
                label="Citizenship Number"
                labelPlacement="outside"
                name="citizenshipNumber"
                placeholder="345689000000"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Issued Date"
                labelPlacement="outside"
                name="issuedDate"
                placeholder="2074/8/30"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Issued Place"
                labelPlacement="outside"
                name="issuedPlace"
                placeholder="Dang"
              />
            </div>
          </div>
          <Divider className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="flex flex-col">
              <label className="text-black font-medium">
                Citizenship Photo
              </label>
              <button className="text-blue-500 flex items-center">
                <IoEyeOutline size={20} className="mr-1" />
                View Photo
              </button>
            </div>
          </div>
          <Divider className="mt-6" />
        </div>

        {/* PAN Details Section */}
        <div className="bg-white text-lg p-6 rounded-lg">
          <h1 className="text-xl font-semibold flex underline underline-offset-4 decoration-red-500 mb-6">
            <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-2" />
            PAN Details
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <Input
                isReadOnly
                label="PAN Number"
                labelPlacement="outside"
                name="panNumber"
                placeholder="345689000000"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Issued Place"
                labelPlacement="outside"
                name="panIssuedPlace"
                placeholder="Kathmandu"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black font-medium">PAN Photo</label>
              <button className="text-blue-500 flex items-center">
                <IoEyeOutline size={20} className="mr-1" />
                View Photo
              </button>
            </div>
          </div>
          <Divider className="mb-6" />
        </div>
      </Form>
    </div>
  );
};

export default DocumentAction;
