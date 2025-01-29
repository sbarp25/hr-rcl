import { Divider, Form, Input } from "@nextui-org/react";
import React from "react";
import { FaDiamond } from "react-icons/fa6";

const PersonalAction = () => {
  return (
    <div className="relative flex flex-col bg-white mt-16 border-2 rounded-md shadow-lg p-8  ">
      {/* Header Section */}
      <div className="absolute bg-black w-auto rounded-t-2xl -top-12   left-1 px-6 py-2">
        <h1 className="text-2xl font-bold text-white">Personal Detail</h1>
      </div>

      {/* Form Section */}
      <Form className="mt-8 grid grid-cols-1 gap-12">
        <div className="bg-white text-lg p-6 rounded-lg">
          <h1 className="text-xl font-semibold flex underline underline-offset-4 decoration-red-500 mb-6">
            <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-2" />
            Personal Details
          </h1>
          {/* Column 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 ">
            <div>
              <Input
                isReadOnly
                label="Name"
                labelPlacement="outside"
                name="name"
                placeholder="Prativa Oli"
              />
            </div>
            <div className="flex">
              <Input
                isReadOnly
                label="Age"
                labelPlacement="outside"
                name="age"
                placeholder="24"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Gender"
                labelPlacement="outside"
                name="gender"
                placeholder="Female"
              />
            </div>
          </div>
          <Divider className="mt-6 mb-6" />
          {/* Column 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 ">
            <div>
              <Input
                isReadOnly
                label="Phone No."
                labelPlacement="outside"
                name="phone"
                placeholder="98523156"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Email"
                labelPlacement="outside"
                name="email"
                placeholder="Prativaoli@gmail.com"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Date of Birth"
                labelPlacement="outside"
                name="dob"
                placeholder="2057/04/12"
              />
            </div>
          </div>
          <Divider className="mt-6 mb-6" />

          {/* Column 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 ">
            <div>
              <Input
                isReadOnly
                label="Blood Type"
                labelPlacement="outside"
                name="bloodType"
                placeholder="+O"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Department"
                labelPlacement="outside"
                name="department"
                placeholder="UI/UX"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Position"
                labelPlacement="outside"
                name="position"
                placeholder="Junior"
              />
            </div>
          </div>
          <Divider className="mt-6 mb-6" />

          {/* Column 4 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 ">
            <div>
              <Input
                isReadOnly
                label="Guardian Name"
                labelPlacement="outside"
                name="guardianName"
                placeholder="Sapana Roka"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Guardian Number"
                labelPlacement="outside"
                name="guardianNumber"
                placeholder="85909055"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Guardian Relationship"
                labelPlacement="outside"
                name="guardianRelationship"
                placeholder="Sister"
              />
            </div>
          </div>
          <Divider className="mt-6 mb-6" />
          {/* Column 5 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 ">
            <div>
              <Input
                isReadOnly
                label="Emergency Name"
                labelPlacement="outside"
                name="emergencyName"
                placeholder="Kumar Thapa"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Emergency Number"
                labelPlacement="outside"
                name="emergencyNumber"
                placeholder="85909055"
              />
            </div>
            <div>
              <Input
                isReadOnly
                label="Emergency Relationship"
                labelPlacement="outside"
                name="emergencyRelationship"
                placeholder="Uncle"
              />
            </div>
          </div>
        </div>
        <Divider className="mb-6" />
      </Form>
    </div>
  );
};

export default PersonalAction;
