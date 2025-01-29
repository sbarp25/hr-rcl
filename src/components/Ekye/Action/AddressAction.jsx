import React from "react";
import { Divider, Form, Input } from "@nextui-org/react";
import { FaDiamond } from "react-icons/fa6";

const AddressAction = () => {
  return (
    <div className="relative flex flex-col bg-white mt-16 border-2 rounded-md shadow-lg p-8">
      {/* Header Section */}
      <div className="absolute bg-black w-auto rounded-t-2xl -top-12   left-1 px-6 py-2">
        <h1 className="text-2xl font-bold text-white">Address Detail</h1>
      </div>

      {/* Single Form Section */}
      <Form className="mt-8 grid grid-cols-1 gap-12">
        {/* Permanent Address Section */}
        <div className="bg-white text-lg p-x-6 rounded-lg">
          <h1 className="text-xl font-semibold flex underline underline-offset-4 decoration-red-500 mb-6">
            <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-2" />
            Permanent Address Details
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <Input
                isReadOnly
                label="Provinces"
                labelPlacement="outside"
                name="permanentProvinces"
                placeholder="2"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="District"
                labelPlacement="outside"
                name="permanentDistrict"
                placeholder="Kathmandu"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Municipality"
                labelPlacement="outside"
                name="permanentMunicipality"
                placeholder="Kathmandu"
              />
            </div>
          </div>
          <Divider className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Input
                isReadOnly
                label="Ward No"
                labelPlacement="outside"
                name="permanentWardNo"
                placeholder="05"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Pincode"
                labelPlacement="outside"
                name="permanentPincode"
                placeholder="012546"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Tole/Area"
                labelPlacement="outside"
                name="permanentTole"
                placeholder="Manamaiju Mandir"
              />
            </div>
          </div>
          <Divider className="mt-6" />
        </div>

        {/* Temporary Address Section */}
        <div className="bg-white text-lg p-6  rounded-lg">
          <h1 className="text-xl font-semibold flex underline underline-offset-4 decoration-red-500 mb-6">
            <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-2" />
            Temporary Address Details
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <Input
                isReadOnly
                label="Provinces"
                labelPlacement="outside"
                name="permanentProvinces"
                placeholder="2"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="District"
                labelPlacement="outside"
                name="permanentDistrict"
                placeholder="Kathmandu"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Municipality"
                labelPlacement="outside"
                name="permanentMunicipality"
                placeholder="Kathmandu"
              />
            </div>
          </div>
          <Divider className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Input
                isReadOnly
                label="Ward No"
                labelPlacement="outside"
                name="permanentWardNo"
                placeholder="05"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Pincode"
                labelPlacement="outside"
                name="permanentPincode"
                placeholder="012546"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Tole/Area"
                labelPlacement="outside"
                name="permanentTole"
                placeholder="Manamaiju Mandir"
              />
            </div>
          </div>
          <Divider className="mt-6" />
        </div>
      </Form>
    </div>
  );
};

export default AddressAction;
