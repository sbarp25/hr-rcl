import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import axiosInstance from "../../lib/axios-Instance";
import { toast } from "react-toastify";
import { FaRegEye } from "react-icons/fa";
import { Divider } from "@nextui-org/react";
import BreadcrumbsComponent from "../../components/BreadCrumbsComp";
import { useNavigate } from "react-router-dom";
const SalaryDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [salary, setSalary] = useState([]);

  const month = "January";
  const date = "Jan 2025";

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/salary/calculate", {});
        if (response.data.responseCode === "200") {
          setSalary(response?.data?.data);
        } else {
          toast.error(response?.data?.message);
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
  const SalaryD = [
    {
      key: "Gross Salary",
      value: (
        <span className="flex justify-center gap-2">
          <span>NRs</span>
          {salary?.grossSalary || "N/A"}
        </span>
      ),
      color: "bg-blue-200",
    },
    {
      key: "Total Deduction",
      value: (
        <span className="flex justify-center gap-2">
          <span>NRs</span>
          {salary?.totalDeductions || "N/A"}
        </span>
      ),
      color: "bg-orange-200",
    },
    { key: "Salary Period", value: date, color: "bg-red-200" },
    {
      key: "Additional Allowance",
      value: (
        <span className="flex justify-center gap-2">
          <span>NRs</span>
          {salary?.dearnessAllowance || "N/A"}
        </span>
      ),
      color: "bg-purple-200",
    },
    {
      key: "Net Salary",
      value: (
        <span className="flex justify-center gap-2">
          <span>NRs</span>
          {salary?.netSalary || "N/A"}
        </span>
      ),
      color: "bg-green-200",
    },
  ];

  const breadcrumbItems = [
    { label: "Profile", href: "/" },
    { label: "Salary Details", href: "/salary" },
  ];
  const handleClick = () => {};
  const navigate = useNavigate();
  const hasaccess = false;

  useEffect(() => {
    if (!hasaccess) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex flex-col space-y-10">
      {isLoading && ""}
      <BreadcrumbsComponent items={breadcrumbItems} />
      <div className=" flex flex-col justify-between max-h-[90vh] overflow-y-auto p-2">
        <h1 className="flex justify-center font-bold text-2xl">
          Salary Details
        </h1>
        {/**Top Section With Salary Details  */}
        <div className="rounded-lg border-2 bg-white  border-gray-300 gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 p-4">
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
        <div className="rounded-lg border-2 mt-2 pb-2 bg-white border-gray-300 ">
          {/**Heading Section */}
          <div className="rounded-lg w-full  border-b-2">
            <div className="p-2 flex  justify-center items-centerfont-bold">
              <p className="text-2xl font-semibold">Salary BreakDown</p>
              {/* <p>
                <Link To="/SalaryDetails">
                  <IoIosAddCircleOutline className="text-2xl" />
                </Link>
              </p> */}
            </div>
          </div>

          <div className=" p-2 flex flex-col justify-between font-medium">
            <p className=" flex justify-between text-blue-300">
              Basic Salary
              <span className="flex mr-80 gap-4">
                <span>NRs</span>
                {salary?.basicSalary || "N/A"}
              </span>
            </p>

            <Divider className="my-4" />
            <p className=" flex justify-between text-blue-300">
              Performance Incentive
              <span className="flex mr-80 gap-4">
                <span>NRs</span>
                {salary?.performanceIncentive || "N/A"}
              </span>
            </p>
            <Divider className="my-4" />
            <p className=" flex justify-between text-blue-300">
              Dearness Allowance
              <span className="flex mr-80 gap-4">
                <span>NRs</span>
                {salary?.dearnessAllowance || "N/A"}
              </span>
            </p>
            <Divider className="my-4" />
            <p className=" flex justify-between font-bold">
              Gross Salary
              <span className="flex mr-80 gap-4">
                <span>NRs</span>
                {salary?.grossSalary || "N/A"}
              </span>
            </p>
          </div>
        </div>
        {/**Payable salary of month */}
        <div className="border-2 rounded-lg mt-2 bg-white border-gray-300">
          <div className="rounded-lg w-full  border-b border-gray-300">
            <div className="p-2 flex  justify-center items-centerfont-bold">
              <p className="text-2xl font-semibold">
                Payable Salary of {month}
              </p>
            </div>
          </div>
          <div className="flex p-2 flex-col justify-between font-medium">
            <p className="flex justify-between text-teal-500 items-center gap-2">
              <span className="px-2 ">Gross Salary</span>
              <span className="flex mr-80 gap-4">
                <span>NRs</span>
                {salary?.grossSalary || "N/A"}
              </span>
            </p>

            <Divider className="my-4" />
            <p className="flex justify-between text-teal-500  items-center gap-2">
              <span className=" px-2 flex  items-center gap-2">
                OverTime
                <FaRegEye />
              </span>
              <span className="flex mr-80 gap-4">
                <span>NRs</span>
                {salary?.OverTime || "N/A"}
              </span>
            </p>
            <Divider className="my-4" />
            <p className="flex justify-between items-center gap-2 text-teal-500">
              <span className="  px-2 flex    items-center gap-2">
                Other Allowance
                <FaRegEye />
              </span>
              <span className="flex mr-80 gap-4">
                <span>NRs</span>
                {salary?.OverTime || "N/A"}
              </span>
            </p>
            <Divider className="my-4" />
            <p className="flex justify-between items-center gap-2 text-red-500">
              <span className="flex px-2     items-center gap-2">
                Entertainment Fee
              </span>
              <span className="flex mr-80 gap-4">
                <span>NRs</span>
                {salary?.entertainmentFee || "N/A"}
              </span>
            </p>
            <Divider className="my-4" />
            <p className="flex  justify-between items-center gap-2 text-red-500">
              <span className="flex  px-2   items-center gap-2">
                Advance
                <FaRegEye />
                {/* <CiCirclePlus className="text-black" onClick={handleClick} /> */}
              </span>
              <span className="flex mr-80 gap-4">
                <span>NRs</span>
                {salary?.advanceSalaryDeduction || "N/A"}
              </span>
            </p>
            <Divider className="my-4" />
            <p className="flex justify-between items-center gap-2 text-red-500">
              <span className="flex px-2    items-center gap-2">
                Tax <FaRegEye />
              </span>
              <span className="flex mr-80 gap-4">
                <span>NRs</span>
                {salary?.tax || "N/A"}
              </span>
            </p>
            <Divider className="my-4" />
            <p className="flex justify-between items-center gap-2 text-red-500">
              <span className="flex  px-2   items-center gap-2">
                Leave <FaRegEye />
              </span>
              <span className="flex mr-80 gap-4">
                <span>NRs</span>
                {salary?.excessLeaveDeduction || "N/A"}
              </span>
            </p>
            <Divider className="my-4" />
            <p className="flex justify-between items-center gap-2 font-bold">
              <span className="px-2 ">Net Salary</span>
              <span className="flex mr-80 gap-4">
                <span>NRs</span>
                {salary?.netSalary || "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryDetails;
