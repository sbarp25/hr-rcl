import React, { useState } from "react";
import { Button, Divider, Form, Input } from "@nextui-org/react";
import { IoEyeOutline } from "react-icons/io5";
import { FaDiamond, FaRegEye } from "react-icons/fa6";
import ReadOnlyInput from "../../ReadOnlyInput";

const EkyeDocumentDetail = () => {
  const [citizenshipFront, setCitizenshipFront] = useState(false);
  const [citizenshipBack, setCitizenshipBack] = useState(false);
  const [photoPAN, setPhotoPAN] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center bg-white py-6 border-solid mx-auto rounded-md">
      <div className="flex justify-between w-[90%] mt-2 px-8 gap-6">
        {/**Citizenship details */}
        <div className="bg-white text-lg w-[50%] p-6 shadow-md rounded-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold mb-4 text-left flex underline underline-offset-4 decoration-red-500">
              <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
              Citizenship Details
            </h1>
            <div className="flex gap-1 items-end justify-end text-right">
              <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
              <div className="flex w-2 h-2 rounded-full bg-black"></div>
              <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>
          <Form className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Row 1: Two inputs */}
            <ReadOnlyInput
              label="Citizenship Number"
              placeholder="345689000000"
            />
            <ReadOnlyInput label="Issued Date" placeholder="2074/8/30" />
            <ReadOnlyInput label="Issued Place" placeholder="Dang" />

            <div className="flex flex-col w-full mr-6">
              {/* Citizenship Front Photo */}
              <div>
                <label className="text-black text-xs">
                  Citizenship Front Photo
                </label>
                {citizenshipFront ? (
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
              {/**Citizenship Back Photo */}
              <div>
                <label className="text-black text-xs">
                  Citizenship Back Photo
                </label>
                {citizenshipBack ? (
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
            </div>
          </Form>
        </div>

        {/**Pan Details */}
        <div className="bg-white text-lg w-[50%] p-6 shadow-md rounded-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold mb-4 text-left flex  underline underline-offset-4 decoration-red-500 ">
              <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
              PAN Details{" "}
            </h1>
            <div className="flex gap-1 items-end justify-end text-right">
              <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
              <div className="flex w-2 h-2 rounded-full bg-black"></div>
              <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>
          <Form className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Row 1: Two inputs */}
            <ReadOnlyInput label="Issued Number" placeholder="44600" />
            <ReadOnlyInput label="Issued Place" placeholder="Hetauda" />
            <ReadOnlyInput label="Issued Date" placeholder="2024-10-24" />
            <div>
              <label className="text-black text-xs">PAN Photo</label>
              {photoPAN ? (
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
      </div>

      {/* Buttons Section */}
    </div>
  );
};

export default EkyeDocumentDetail;
