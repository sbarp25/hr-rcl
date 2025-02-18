import { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import axiosInstance from "../../lib/axios-Instance";
import { toast } from "react-toastify";
import { FaRegEye } from "react-icons/fa";
import { Divider } from "@nextui-org/react";
import { Link } from "react-router-dom";
const SalaryDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [salary, setSalary] = useState([]);
  const SalaryD = [
    { key: "Gross Salary", value: "NRP 5000", color: "bg-blue-200" },
    { key: "Total Deduction", value: "NRP 500", color: "bg-orange-200" },
    { key: "Salary Period", value: "Dec, 2024", color: "bg-red-200" },
    { key: "Additional Allowance", value: "NRP 5000", color: "bg-purple-200" },
    { key: "Net Salary", value: "NRP 9500", color: "bg-green-200" },
  ];
  const month = "January";

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/salary/get_all", {});
        if (response.data.responseCode === "200") {
          setSalary(response?.data?.datalist);
        } else {
          toast.error(response?.data?.data?.message);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Error fetching departments.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);
  return (
    <div className="max-h-[95vh] overflow-y-auto bg-white border-2 border-gray-300 p-2">
      {/**Top Section With Salary Details  */}
      <div className="rounded-lg border-2 border-gray-300 gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 p-4">
        {SalaryD.map((item, index) => (
          <div
            key={index}
            className={`text-text ${item.color} p-2 rounded-lg text-center`}
          >
            <div className="font-bold">{item.value}</div>
            <div>{item.key}</div>
          </div>
        ))}
      </div>
      {/**Salary BreakDown  */}
      <div className="rounded-lg border-2 mt-2 pb-2">
        {/**Heading Section */}
        <div className="rounded-lg w-full bg-blue-100 border-b-2">
          <div className="p-2 flex  justify-between items-centerfont-bold">
            <p className="text-2xl font-semibold">Salary BreakDown</p>
            <p>
              <Link To="/SalaryDetails">
                <IoIosAddCircleOutline className="text-2xl" />
              </Link>
            </p>
          </div>
        </div>

        <div className=" p-2 flex flex-col justify-between items-centerfont-bold">
          <p className=" flex justify-between ">
            Basic Salary
            <span className="flex mr-80">
              {/* {salary?.basicSalary} */}
              NPR. 5000
            </span>
          </p>

          <Divider className="my-4" />
          <p className=" flex justify-between ">
            Performance Incentive
            {/* <span>{salary?.performanceIncentive}</span> */}
            <span className="flex mr-80">NPR. 5000</span>
          </p>
          <Divider className="my-4" />
          <p className=" flex justify-between ">
            Dearness Allowance
            {/* <span>{salary?.dearnessAllowance}</span> */}
            <span className="flex mr-80">NPR. 5000</span>
          </p>
          <Divider className="my-4" />
          <p className=" flex justify-between ">
            Gross Salary
            {/* <span>{salary?.grossSalary}</span> */}
            <span className="flex mr-80 font-bold">NPR. 5000</span>
          </p>
        </div>
      </div>
      {/**Payable salary of month */}
      <div className="border-2 rounded-lg mt-2">
        <div className="rounded-lg w-full bg-blue-100 ">
          <div className="p-2 flex  justify-between items-centerfont-bold">
            <p>Payable Salary of {month}</p>
            <p>
              <IoIosAddCircleOutline className="text-2xl" />
            </p>
          </div>
        </div>
        <p className="flex justify-between text-green-300 lex items-center gap-2">
          <span className="px-2 ">Gross Salary</span>
          {/* <span>{salary?.grossSalary}</span> */}
          <span className="flex mr-80">NPR. 5000</span>
        </p>

        <Divider className="my-4" />
        <p className="flex justify-between text-green-300  items-center gap-2">
          <span className=" px-2 flex  items-center gap-2">OverTime</span>
          <span className="flex mr-80">NPR. 5000</span>
        </p>
        <Divider className="my-4" />
        <p className="flex justify-between items-center gap-2 text-green-300">
          <span className="  px-2 flex    items-center gap-2">
            Other Allowance
            <FaRegEye />
          </span>
          <span className="flex mr-80">NPR. 5000</span>
        </p>
        <Divider className="my-4" />
        <p className="flex justify-between items-center gap-2 text-red-500">
          <span className="flex px-2     items-center gap-2">
            Entertainment Fee
          </span>
          {/* <span>{salary?.entertainmentFee}</span> */}
          <span className="flex mr-80">NPR. 5000</span>
        </p>
        <Divider className="my-4" />
        <p className="flex  justify-between items-center gap-2 text-red-500">
          <span className="flex  px-2   items-center gap-2">
            Advance
            <FaRegEye />
          </span>

          {/* <span>{salary?.advanceSalaryDeduction}</span> */}
          <span className="flex mr-80">NPR. 5000</span>
        </p>
        <Divider className="my-4" />
        <p className="flex justify-between items-center gap-2 text-red-500">
          <span className="flex px-2    items-center gap-2">
            Tax <FaRegEye />
          </span>
          {/* <span>{salary?.tax}</span> */}
          <span className="flex mr-80">NPR. 5000</span>
        </p>
        <Divider className="my-4" />
        <p className="flex justify-between items-center gap-2 text-red-500">
          <span className="flex  px-2   items-center gap-2">
            Leave <FaRegEye />
          </span>
          <span className="flex mr-80">NPR. 5000</span>
          {/* <span>{salary?.excessLeaveDeduction}</span> */}
        </p>
        <Divider className="my-4" />
        <p className="flex justify-between items-center gap-2">
          <span className="px-2 ">Net Salary</span>
          {/* <span>{salary?.netSalary}</span> */}
          <span className="flex mr-80 font-bold">NPR. 5000</span>
        </p>
      </div>
    </div>
  );
};

export default SalaryDetails;
