import { useForm } from "react-hook-form";
import InputComponent from "../../../components/InputComponent";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import { useEffect } from "react";
import axiosInstance from "../../../lib/axios-Instance";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SalaryEdit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [salary, setSalary] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const month = "January";
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Employees", href: "/Employees" },
    { label: "Edit Salary Details", href: "/notice" },
  ];
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
  const hasaccess = true;
  const navigate = useNavigate();
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);
  return (
    <div className="flex flex-col space-y-8">
      <BreadcrumbsComponent items={breadcrumbItems} />
      <div className="max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-300 p-2 rounded-lg">
        <div className="bg-white rounded-lg border-2 mt-2 pb-2">
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
              {/* <InputComponent
                name="BasicSalary"
                control={control}
                variant="bordered"
                label="Basic Salary"
                value={salary?.basicSalary}
                inputClassName="w-96 bg-white mr-16"
                rules={{
                  required: "Basic Salary is required",
                  pattern: {
                    value: /^[0-9 ]$/,
                    message: "Basic Salary must be in numerical format",
                  },
                }}
              /> */}
            </div>

            <div className=" flex justify-between ">
              <span className="text-blue-400 px-3 ">Performance Incentive</span>
              <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
                {salary?.performanceIncentive || "N/A"}
              </div>
              {/* <InputComponent
                name="PerformanceIncentive"
                control={control}
                variant="bordered"
                label="Performance Incentive"
                inputClassName="w-96 bg-white mr-16"
                rules={{
                  required: "Performance Incentive is required",
                  pattern: {
                    value: /^[0-9]$/,
                    message:
                      "Performance Incentive must be in numerical format",
                  },
                }}
              /> */}
            </div>

            <div className=" flex justify-between ">
              <span className="text-blue-400 px-3 ">Dearness Allowance</span>
              <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
                {salary?.dearnessAllowance || "N/A"}
              </div>
              {/* <span>{salary?.dearnessAllowance}</span> */}
              {/* <InputComponent
                name="DearnessAllowance"
                control={control}
                variant="bordered"
                label="Dearness Allowance"
                inputClassName="w-96 bg-white mr-16"
                rules={{
                  required: "Dearness Allowance is required",
                  pattern: {
                    value: /^[0-9 ]$/,
                    message: "Dearness Allowance must be in numerical format",
                  },
                }}
              /> */}
            </div>

            <div className=" flex justify-between ">
              <span className="font-bold px-3 text-lg">Gross Salary</span>
              <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
                {salary?.grossSalary || "N/A"}
              </div>
              {/* <InputComponent
                name="GrossSalary"
                control={control}
                variant="bordered"
                label="Gross Salary"
                inputClassName="w-96 bg-white mr-16"
                rules={{
                  required: "Description is required",
                  pattern: {
                    value: /^[a-zA-Z0-9 ]{3,50}$/,
                    message: "Description must be 3-50 characters long.",
                  },
                }}
              /> */}
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
            {/* <span>{salary?.grossSalary}</span> */}
            {/* <InputComponent
              name="GrossSalary"
              control={control}
              variant="bordered"
              inputClassName="w-96  my-2 bg-white mr-16"
              label="Gross Salary"
              rules={{
                required: "Gross Salary is required",
                pattern: {
                  value: /^[0-9 ]$/,
                  message: "Gross Salary must be in numerical format",
                },
              }}
            /> */}
          </div>
          <div className="flex justify-between text-teal-500  items-center gap-2">
            <span className=" px-3  font-semibold">OverTime</span>
            <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
              {salary?.OverTime || "N/A"}
            </div>
            {/* <InputComponent
              name="OverTime"
              control={control}
              variant="bordered"
              label="OverTime"
              inputClassName="w-96  my-2 bg-white mr-16"
              rules={{
                required: "OverTime is required",
                pattern: {
                  value: /^[0-9 ]$/,
                  message: "OverTime must be in numerical format",
                },
              }}
            /> */}
          </div>
          <div className="flex justify-between text-teal-500 items-center gap-2 ">
            <span className="   px-3  font-semibold text-teal-500 ">
              Other Allowance
            </span>
            <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
              {salary?.dearnessAllowance || "N/A"}
            </div>
            {/* <InputComponent
              name="OtherAllowance"
              control={control}
              variant="bordered"
              inputClassName="w-96  my-2 bg-white mr-16"
              label="Other Allowance"
              rules={{
                required: "Other Allowance is required",
                pattern: {
                  value: /^[0-9 ]$/,
                  message: "Other Allowance must be in numerical format",
                },
              }}
            /> */}
          </div>
          <div className="flex justify-between items-center gap-2 text-red-500">
            <span className=" px-3  font-semibold">Entertainment Fee</span>
            <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
              {salary?.entertainmentFee || "N/A"}
            </div>
            {/* <InputComponent
              name="EntertainmentFee"
              control={control}
              variant="bordered"
              inputClassName="w-96  my-2 bg-white mr-16"
              label="Entertainment Fee"
              rules={{
                required: "Description is required",
                pattern: {
                  value: /^[0-9]$/,
                  message: "Entairtainment fee must be in numerical format",
                },
              }}
            /> */}
          </div>

          <div className="flex  justify-between items-center gap-2 text-red-500">
            <span className=" px-3  font-semibold">Advance</span>
            <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
              {salary?.advanceSalaryDeduction || "N/A"}
            </div>
            {/* <InputComponent
              name="Advance"
              control={control}
              variant="bordered"
              label="Advance"
              inputClassName="w-96  my-2 bg-white mr-16"
              rules={{
                pattern: {
                  value: /^[0-9 ]$/,
                  message: "Advance must be in numerical format",
                },
              }}
            /> */}
          </div>

          <div className="flex justify-between items-center gap-2 text-red-500">
            <span className=" px-3  font-semibold">Tax</span>
            <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
              {salary?.tax || "N/A"}
            </div>
            {/* <InputComponent
              name="Tax"
              control={control}
              variant="bordered"
              inputClassName="w-96  my-2 bg-white mr-16"
              label="Tax"
              rules={{
                required: "Description is required",
                pattern: {
                  value: /^[0-9]$/,
                  message: "Tax must be in numerical format",
                },
              }}
            /> */}
          </div>

          <div className="flex justify-between items-center gap-2 text-red-500">
            <span className=" px-3  font-semibold">Leave</span>
            <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
              {salary?.excessLeaveDeduction || "N/A"}
            </div>
            {/* <InputComponent
              name="Leave"
              control={control}
              variant="bordered"
              inputClassName="w-96  my-2 bg-white mr-16"
              label="Leave"
              rules={{
                required: "Leave is required",
                pattern: {
                  value: /^[0-9 ]$/,
                  message: "LEave must be in numerical format",
                },
              }}
            /> */}
          </div>
          <div className="flex justify-between text-bold items-center gap-2">
            <span className=" px-3  font-bold ">Net Salary</span>
            <div className="w-96 bg-white mr-16 border border-gray-300 p-4 rounded-xl">
              {salary?.netSalary || "N/A"}
            </div>
            {/* <InputComponent
              name="NetSalary"
              control={control}
              variant="bordered"
              inputClassName="w-96  my-2 bg-white mr-16"
              label="Net Salary"
              rules={{
                required: "Net Salary is required",
                pattern: {
                  value: /^[0-9]$/,
                  message: "Net Salary must be in numerical format",
                },
              }}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryEdit;
