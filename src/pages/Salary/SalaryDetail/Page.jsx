import BreadcrumbsComponent from "../../../components/ui/BreadCrumbsComp.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSalary } from "../../../hooks/useAuth.js";
import Loader from "../../../components/Loader/Loader.jsx";

const SalaryEdit = () => {
  const month = "January";
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Employees", href: "/Employees" },
    { label: "Edit Salary Details", href: "/notice" },
  ];

  const { data: salary, isLoading } = useSalary();

  const hasaccess = true;
  const navigate = useNavigate();
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);
  if (isLoading) {
    <Loader />;
  }
  return (
    <div className="flex flex-col space-y-8">
      <BreadcrumbsComponent items={breadcrumbItems} />
      <div className="max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-300 p-2 rounded-lg">
        <div className="bg-white rounded-lg border-2  pb-2">
          {/**Heading Section */}
          <div className="rounded-lg w-full bg-blue-100 border-b-2 border-gray-300">
            <div className="p-2 flex text-center justify-center   items-center font-bold">
              <p className="text-2xl  font-semibold">Salary BreakDown</p>
            </div>
          </div>

          <div className=" p-2 flex flex-col justify-between items-centerfont-bold gap-3">
            <div className=" flex justify-between ">
              <span className="text-blue-400 px-3  ">Basic Salary</span>
              <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
                {salary?.basicSalary || "N/A"}
              </div>
            </div>

            <div className=" flex justify-between ">
              <span className="text-blue-400 px-3 ">Performance Incentive</span>
              <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
                {salary?.performanceIncentive || "N/A"}
              </div>
            </div>

            <div className=" flex justify-between ">
              <span className="text-blue-400 px-3 ">Dearness Allowance</span>
              <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
                {salary?.dearnessAllowance || "N/A"}
              </div>
            </div>

            <div className=" flex justify-between ">
              <span className="font-bold px-3 text-lg">Gross Salary</span>
              <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
                {salary?.grossSalary || "N/A"}
              </div>
            </div>
          </div>
        </div>
        {/* Payable Salary OF Month  */}
        <div className="border-2 rounded-lg mt-2 space-y-4">
          <div className="rounded-lg w-full bg-blue-100 ">
            <div className="p-2 flex text-center  justify-center items-center font-semibold text-2xl">
              <p>Payable Salary of {month}</p>
            </div>
          </div>
          <div className="flex justify-between text-teal-500 lex items-center gap-2">
            <span className="  px-3  font-semibold ">Gross Salary</span>
            <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
              {salary?.grossSalary || "N/A"}
            </div>
          </div>
          <div className="flex justify-between text-teal-500  items-center gap-2">
            <span className=" px-3  font-semibold">OverTime</span>
            <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
              {salary?.OverTime || "N/A"}
            </div>
          </div>
          <div className="flex justify-between text-teal-500 items-center gap-2 ">
            <span className="   px-3  font-semibold text-teal-500 ">
              Other Allowance
            </span>
            <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
              {salary?.dearnessAllowance || "N/A"}
            </div>
          </div>
          <div className="flex justify-between items-center gap-2 text-red-500">
            <span className=" px-3  font-semibold">Entertainment Fee</span>
            <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
              {salary?.entertainmentFee || "N/A"}
            </div>
          </div>

          <div className="flex  justify-between items-center gap-2 text-red-500">
            <span className=" px-3  font-semibold">Advance</span>
            <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
              {salary?.advanceSalaryDeduction || "N/A"}
            </div>
          </div>

          <div className="flex justify-between items-center gap-2 text-red-500">
            <span className=" px-3  font-semibold">Tax</span>
            <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
              {salary?.tax || "N/A"}
            </div>
          </div>

          <div className="flex justify-between items-center gap-2 text-red-500">
            <span className=" px-3  font-semibold">Leave</span>
            <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
              {salary?.excessLeaveDeduction || "N/A"}
            </div>
          </div>
          <div className="flex justify-between text-bold items-center gap-2">
            <span className=" px-3  font-bold ">Net Salary</span>
            <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
              {salary?.netSalary || "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryEdit;
