import React, { useState } from "react";
import { Button, Form, Input } from "@nextui-org/react";
import { IoEyeOutline } from "react-icons/io5";
import { FaDiamond, FaRegEye } from "react-icons/fa6";
import ReadOnlyInput from "../../ReadOnlyInput";
const EkyeEducationDetails = () => {
  const [EducationDocument, setEducationDocument] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center bg-white py-6 w-full mx-auto rounded-md">
      <div className="bg-white  text-lg w-[85%]  shadow-md rounded-lg p-6 mt-2 ">
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

        <Form className="py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReadOnlyInput label="level" placeholder="Bachlor's" />
          <ReadOnlyInput label="Institute" placeholder="" />
          <ReadOnlyInput label="Faculty" placeholder="Bachlor's" />
          <ReadOnlyInput label="Start Date" placeholder="2072/12/12" />
          <ReadOnlyInput label="End Date" placeholder="2058/12/12" />
          <ReadOnlyInput label="Status" placeholder="Completed" />
          <div>
            <label className="text-black text-xs">
              Citizenship Front Photo
            </label>
            {EducationDocument ? (
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-green-600 underline mb-2">
                <span className="flex items-center gap-x-2">
                  <FaRegEye />
                  View Uploaded PAN Card
                </span>
              </a>
            ) : (
              <div className="text-xs text-red-500">No Links Available</div>
            )}
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
