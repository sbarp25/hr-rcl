import { Divider } from "@nextui-org/react";
import React from "react";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Input } from "@nextui-org/input";

const SalaryEdit = () => {
  const month = "January";
  return (
    <div className="max-h-[95vh] overflow-y-auto bg-white border-2 border-gray-300 p-2">
      {" "}
      <div className="bg-white rounded-lg border-2 mt-2 pb-2">
        {/**Heading Section */}
        <div className="rounded-lg w-full bg-blue-100 border-b-2">
          <div className="p-2 flex text-center justify-center   items-center font-bold">
            <p className="text-2xl  font-semibold">Salary BreakDown</p>
          </div>
        </div>

        <div className=" p-2 flex flex-col justify-between items-centerfont-bold gap-3">
          <p className=" flex justify-between ">
            <span className="text-purple-300 px-3  font-semibold">
              Basic Salary
            </span>
            <Input
              className="w-auto border border-gray-600 rounded-lg  bg-white mr-64 "
              type="email"
              placeholder="NPR.5000"
            />
          </p>

          <p className=" flex justify-between ">
            <span className="text-purple-300 px-3 font-semibold">
              Performance Incentive
            </span>

            {/* <span>{salary?.performanceIncentive}</span> */}
            <Input
              className="w-auto border border-gray-600 rounded-lg  bg-white mr-64 "
              type="email"
              placeholder="NPR.5000"
            />
          </p>

          <p className=" flex justify-between ">
            <span className="text-purple-300 px-3 font-semibold">
              Dearness Allowance
            </span>

            {/* <span>{salary?.dearnessAllowance}</span> */}
            <Input
              className="w-auto border border-gray-600 rounded-lg  bg-white mr-64 "
              type="email"
              placeholder="NPR.5000"
            />
          </p>

          <p className=" flex justify-between ">
            <span className="font-bold px-3 text-lg">Gross Salary</span>

            {/* <span>{salary?.grossSalary}</span> */}
            <Input
              className="w-auto border border-gray-600 rounded-lg  bg-white mr-64 "
              type="email"
              placeholder="NPR.5000"
            />
          </p>
        </div>
      </div>
      {/* Payable Salary OF Month  */}
      <div className="border-2 rounded-lg mt-2">
        <div className="rounded-lg w-full bg-blue-100 ">
          <div className="p-2 flex text-center  justify-center items-center font-bold">
            <p>Payable Salary of {month}</p>
          </div>
        </div>
        <p className="flex justify-between text-green-300 lex items-center gap-2">
          <span className="  px-3  font-semibold ">Gross Salary</span>
          {/* <span>{salary?.grossSalary}</span> */}
          <Input
            className="w-auto border border-gray-600 rounded-lg my-2  bg-white mr-64 "
            type="email"
            placeholder="NPR.5000"
          />
        </p>

        <p className="flex justify-between text-green-300  items-center gap-2">
          <span className=" px-3  font-semibold">OverTime</span>
          <Input
            className="w-auto border border-gray-600 rounded-lg my-2  bg-white mr-64 "
            type="email"
            placeholder="NPR.5000"
          />
        </p>

        <p className="flex justify-between items-center gap-2 ">
          <span className="   px-3  font-semibold text-green-300 ">
            Other Allowance
          </span>
          <Input
            className="w-auto border border-gray-600 rounded-lg my-2  text-yellow-500 bg-white mr-64 "
            type="email"
            // value={"NRP5000"}
            placeholder="NPR.5000"
          />
        </p>

        <p className="flex justify-between items-center gap-2 text-red-500">
          <span className=" px-3  font-semibold">Entertainment Fee</span>
          <Input
            className="w-auto border border-gray-600 rounded-lg my-2  bg-white mr-64 "
            type="email"
            placeholder="NPR.5000"
          />
        </p>

        <p className="flex  justify-between items-center gap-2 text-red-500">
          <span className=" px-3  font-semibold">Advance</span>

          <Input
            className="w-auto border border-gray-600 rounded-lg my-2  bg-white mr-64 "
            type="email"
            placeholder="NPR.5000"
          />
        </p>

        <p className="flex justify-between items-center gap-2 text-red-500">
          <span className=" px-3  font-semibold">Tax</span>
          <Input
            className="w-auto border border-gray-600 rounded-lg my-2  bg-white mr-64 "
            type="email"
            placeholder="NPR.5000"
          />
        </p>

        <p className="flex justify-between items-center gap-2 text-red-500">
          <span className=" px-3  font-semibold">Leave</span>
          <Input
            className="w-auto border border-gray-600 rounded-lg my-2  bg-white mr-64 "
            type="email"
            placeholder="NPR.5000"
          />
        </p>

        <p className="flex justify-between items-center gap-2">
          <span className=" px-3  font-bold ">Net Salary</span>
          <Input
            className="w-auto border border-gray-600 rounded-lg my-2  bg-white mr-64 "
            type="email"
            placeholder="NPR.5000"
          />
        </p>
      </div>
    </div>
  );
};

export default SalaryEdit;
