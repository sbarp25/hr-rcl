import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosInstance from "../../../lib/axios-Instance";
import Loader from "../../../components/Loader";
import { useNavigate } from "react-router-dom";
import ValidationComponent from "../../../components/ValidationComponent";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import { DatePicker, Input, Select, SelectItem } from "@nextui-org/react";
import { IoIosPeople } from "react-icons/io";

const AddEmployeeForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: "",
      phone: "",
      email: "",
      department: "",
      position: "",
      roles: "",
      performEKYC: true,
      salary: "",
    },
  });

  const [departmentsData, setDepartmentsData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Employees", href: "/Employees" },
    { label: "Add Employees", href: "/AddEmployees" },
  ];

  // Fetch departments, positions, and roles data (same as before)
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post(
          "/api/v1/departments/get/all",
          {}
        );
        if (response.data.responseCode === "200") {
          setDepartmentsData(response?.data?.datalist);
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

  useEffect(() => {
    const fetchPositions = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/api/v1/positions/get/all");
        if (response.data.responseCode === "200") {
          setPositionData(response?.data?.datalist);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching positions:", error);
        toast.error("Error fetching positions.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPositions();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/api/v1/role/get/all", {});
        if (response.data.responseCode === "200") {
          setRoleData(response?.data?.datalist);
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        toast.error("Error fetching roles.", error);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const sanitizeddepartmentId = data.department.replace(/[^0-9]/g, "");
    const sanitizedpositionId = data.position.replace(/[^0-9]/g, "");
    const sanitizedroleId = data.roles.replace(/[^0-9]/g, "");

    const newEmployee = {
      data: {
        fullName: data.fullname,
        phone: data.phone,
        email: data.email,
        departmentId: sanitizeddepartmentId,
        positionId: sanitizedpositionId,
        password: "Xlsnx$c$wi&3MptW$",
        roleId: sanitizedroleId,
        performEkye: data.performEKYC,
        salary: data.salary,
      },
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axiosInstance.post(
        "/api/v1/auth/register",
        newEmployee,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.responseCode === "200") {
        reset();
        navigate("/Employees");
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pl-4">
      <ValidationComponent>
        {isLoading && (
          <Loader message="Please wait while the work is being done" />
        )}{" "}
        <div className="flex flex-col space-y-4 mb-6">
          <div className="text-sm">
            <BreadcrumbsComponent items={breadcrumbItems} />
          </div>
          <h1 className=" flex items-center text-2xl font-semibold text-gray-800">
            <IoIosPeople />
            Add Employee
          </h1>
        </div>
        <div className=" mx-auto bg-white shadow-md rounded-xl px-8 py-6 max-h-[90vh] overflow-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              <div className="mb-4">
                <Input
                  {...register("fullname", {
                    required: "Full Name is required",
                    minLength: {
                      value: 3,
                      message: "Full name must be at least 3 characters",
                    },
                  })}
                  label="Full Name"
                  variant="bordered"
                  isInvalid={!!errors.fullname}
                  errorMessage={errors.fullname?.message}
                />
              </div>
              <div className="mb-4">
                <Input
                  {...register("phone", {
                    required: "Phone Number is required",
                    minLength: {
                      value: 10,
                      message: "Invalid Phone Number",
                    },
                    pattern: {
                      value: /^[0-9]{10,10}$/,
                      message: "Phone number must be 10 digits long",
                    },
                  })}
                  label="Phone"
                  variant="bordered"
                  isInvalid={!!errors.phone}
                  errorMessage={errors.phone?.message}
                />
                {/* {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )} */}
              </div>
              <div className="mb-4">
                <Input
                  {...register("email", {
                    required: "Email ID is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email",
                    },
                  })}
                  label="Email"
                  variant="bordered"
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message}
                />
                {/* {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )} */}
              </div>
              <div className="mb-4">
                <Input
                  {...register("salary", {
                    required: "Salary is required",
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message:
                        "Please enter a valid salary (e.g., 1000 or 1000.50)",
                    },
                  })}
                  label="Salary"
                  variant="bordered"
                  isInvalid={!!errors.salary}
                  errorMessage={errors.salary?.message}
                />
              </div>
              <div className="mb-4">
                {" "}
                <DatePicker label="Hire Date" variant="bordered" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {/**Select Department NextUI */}
              <div className="mb-4">
                <Select
                  variant="bordered"
                  label="Select an Department"
                  color={errors.department ? "danger" : "default"}
                  className={`border-2  rounded-xl ${
                    errors.department ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("department", {
                    required: "Department is required",
                  })}
                  errorMessage={errors.department?.message}>
                  {departmentsData?.map((dept) => (
                    <SelectItem key={dept.id} textValue={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/**Select Position */}
              <div className="mb-4">
                <Select
                  variant="bordered"
                  label="Select an Position"
                  color={errors.position ? "danger" : "default"}
                  className={`border-2  rounded-xl ${
                    errors.position ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("position", {
                    required: "Position is required",
                  })}>
                  {positionData.map((pos) => (
                    <SelectItem key={pos.id} textValue={pos.positionName}>
                      {pos.positionName}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              {/**Select Role  */}
              <div className="mb-4">
                <Select
                  variant="bordered"
                  label="Select an Role"
                  color={errors.roles ? "danger" : "default"}
                  className={`border-2  rounded-xl ${
                    errors.roles ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("roles", {
                    required: "Role is required",
                  })}>
                  {roleData.map((role) => (
                    <SelectItem key={role.roleId} textValue={role.roleName}>
                      {role.roleName}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                {...register("performEKYC")}
                className="mr-2"
              />
              <label className="text-gray-700">Perform eKYC</label>
            </div>
            <button
              type="submit"
              className="w-fit bg-bgprimary text-white py-2 px-4 rounded-lg">
              Submit
            </button>
          </form>
        </div>
      </ValidationComponent>
    </div>
  );
};

export default AddEmployeeForm;
