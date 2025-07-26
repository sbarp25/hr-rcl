import { Divider } from "@heroui/react";
import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";

const Salary = ({ employeeData }) => {
  const salary = employeeData?.salaryResponseDTO || [];

  const mon = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const d = new Date();
  let month = mon[d.getMonth()];

  // Component for salary row with responsive layout
  const SalaryRow = ({
    label,
    value,
    color = "text-blue-300",
    showIcon = false,
    isBold = false,
  }) => (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div
          className={`flex items-center gap-2 ${color} ${
            isBold ? "font-bold" : ""
          }`}>
          <span className="text-sm sm:text-base">{label}</span>
          {showIcon && <FaRegEye className="text-xs sm:text-sm" />}
        </div>
        <div
          className={`flex items-center gap-2 ${color} ${
            isBold ? "font-bold" : ""
          }`}>
          <span className="text-sm sm:text-base">NRs</span>
          <span className="text-sm sm:text-base font-medium">
            {value || "N/A"}
          </span>
        </div>
      </div>
      <Divider className="my-2 sm:my-4" />
    </div>
  );

  return (
    <div className="flex flex-col space-y-6 sm:space-y-10 max-h-[75vh] overflow-y-auto">
      <div className="flex flex-col justify-between max-h-[90vh] overflow-y-auto p-2 sm:p-4">
        {/* Main Title */}
        <h1 className="flex justify-center font-bold text-xl sm:text-2xl mb-4 sm:mb-6">
          Salary Details
        </h1>

        {/* Salary Breakdown Section */}
        <div className="rounded-lg border-2 mt-2 pb-2 bg-white   dark:bg-black  border-gray-300 shadow-sm">
          {/* Section Header */}
          <div className="rounded-t-lg w-full border-b-2 bg-gray-50 dark:bg-black">
            <div className="p-3 sm:p-4 flex justify-center items-center">
              <p className="text-lg sm:text-2xl font-semibold text-gray-800">
                Salary Breakdown
              </p>
            </div>
          </div>

          {/* Salary Breakdown Content */}
          <div className="p-3 sm:p-4 space-y-2 sm:space-y-0">
            <SalaryRow
              label="Basic Salary"
              value={salary?.basicSalary}
              color="text-blue-500"
            />
            <SalaryRow
              label="Performance Incentive"
              value={salary?.performanceIncentive}
              color="text-blue-500"
            />
            <SalaryRow
              label="Dearness Allowance"
              value={salary?.dearnessAllowance}
              color="text-blue-500"
            />
            <div className="pt-2 border-t-2 border-gray-200">
              <SalaryRow
                label="Gross Salary"
                value={salary?.grossSalary}
                color="text-gray-800"
                isBold={true}
              />
            </div>
          </div>
        </div>

        {/* Payable Salary Section */}
        <div className="border-2 rounded-lg mt-4 sm:mt-6 bg-white dark:bg-black border-gray-300 shadow-sm">
          {/* Section Header */}
          <div className="rounded-t-lg w-full border-b border-gray-300 bg-gray-50 dark:bg-black">
            <div className="p-3 sm:p-4 flex justify-center items-center">
              <p className="text-lg sm:text-2xl font-semibold text-gray-800 text-center">
                Payable Salary of {month}
              </p>
            </div>
          </div>

          {/* Payable Salary Content */}
          <div className="p-3 sm:p-4 space-y-2 sm:space-y-0">
            {/* Positive Items (Green/Teal) */}
            <SalaryRow
              label="Gross Salary"
              value={salary?.grossSalary}
              color="text-teal-600"
            />
            <SalaryRow
              label="OverTime"
              value={salary?.OverTime}
              color="text-teal-600"
              showIcon={true}
            />
            <SalaryRow
              label="Other Allowance"
              value={salary?.OverTime}
              color="text-teal-600"
              showIcon={true}
            />

            {/* Separator for deductions */}
            <div className="py-2 sm:py-3">
              <p className="text-xs sm:text-sm font-medium text-gray-500 text-center">
                Deductions
              </p>
              <Divider className="my-2" />
            </div>

            {/* Negative Items (Red) */}
            <SalaryRow
              label="Entertainment Fee"
              value={salary?.entertainmentFee}
              color="text-red-500"
            />
            <SalaryRow
              label="Advance"
              value={salary?.advanceSalaryDeduction}
              color="text-red-500"
              showIcon={true}
            />
            <SalaryRow
              label="Tax"
              value={salary?.tax}
              color="text-red-500"
              showIcon={true}
            />
            <SalaryRow
              label="Leave"
              value={salary?.excessLeaveDeduction}
              color="text-red-500"
              showIcon={true}
            />

            {/* Net Salary - Final Result */}
            <div className="pt-3 sm:pt-4 border-t-2 border-gray-200 bg-gray-50 dark:bg-black -mx-3 sm:-mx-4 px-3 sm:px-4 pb-2 rounded-b-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div className="flex items-center gap-2 text-gray-800 font-bold">
                  <span className="text-base sm:text-lg">Net Salary</span>
                </div>
                <div className="flex items-center gap-2 text-gray-800 font-bold">
                  <span className="text-base sm:text-lg">NRs</span>
                  <span className="text-lg sm:text-xl font-bold text-green-600">
                    {salary?.netSalary || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Salary;
