import React from "react";
import { Button, Form, Input } from "@nextui-org/react";
import { FaDiamond } from "react-icons/fa6";
import ReadOnlyInput from "../../ReadOnlyInput";

const EkyeAdreess = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center rounded-md space-y-3 ">
        <div className="bg-white text-lg w-full p-6 rounded-xl">
          <div className="flex justify-between items-center">
            <h1 className="py-2 text-left text-xl font-semibold font-Poppins flex underline underline-offset-4 decoration-red-500 ">
              <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
              Permanent Address Details
            </h1>
            <div className="flex gap-1 items-end justify-end text-right">
              <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
              <div className="flex w-2 h-2 rounded-full bg-black"></div>
              <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>
          {/**Permanent Address */}
          <Form className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <ReadOnlyInput label="Provinces" placeholder="Bagmati" />
            <ReadOnlyInput label="District" placeholder="Makwanpur" />
            <ReadOnlyInput label="Municipality" placeholder="Hetauda" />
            <ReadOnlyInput label="Ward No" placeholder="2" />
            <ReadOnlyInput label="Pin code" placeholder="44600" />
            <ReadOnlyInput label="Tole/Area" placeholder="Sano Pokhara" />
          </Form>
        </div>
        <div className="bg-white text-lg w-full p-6 rounded-xl">
          <div className="flex justify-between items-center">
            <h1 className="py-2 text-left text-xl font-semibold flex underline underline-offset-4 decoration-red-500">
              <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
              Temporary Address Details
            </h1>
            <div className="flex gap-1 items-end justify-end text-right">
              <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
              <div className="flex w-2 h-2 rounded-full bg-black"></div>
              <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>
          <Form className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <ReadOnlyInput label="Provinces" placeholder="Bagmati" />
            <ReadOnlyInput label="District" placeholder="Makwanpur" />
            <ReadOnlyInput label="Municipality" placeholder="Hetauda" />
            <ReadOnlyInput label="Ward No" placeholder="2" />
            <ReadOnlyInput label="Pin code" placeholder="44600" />
            <ReadOnlyInput label="Tole/Area" placeholder="Sano Pokhara" />
          </Form>
        </div>

        {/* Buttons Section */}
      </div>
    </div>
  );
};

export default EkyeAdreess;
