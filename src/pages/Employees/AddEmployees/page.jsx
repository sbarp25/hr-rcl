import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import axiosInstance from "../../../lib/axios-Instance";
import Loader from "../../../components/Loader";
import { useNavigate } from "react-router-dom";
import ValidationComponent from "../../../components/ValidationComponent";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import { Input, Select } from "@nextui-org/react";

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
    const departmentId =
      departmentsData.find((d) => d.name === data.department)?.id || null;
    const positionId =
      positionData.find((p) => p.name === data.position)?.id || null;
    const roleId =
      roleData.find((r) => r.roleName === data.roles)?.roleId || null;

    const newEmployee = {
      data: {
        fullName: data.fullname,
        phone: data.phone,
        email: data.email,
        departmentId,
        positionId,
        password: "Xlsnx$c$wi&3MptW$",
        roleId,
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
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Error adding employee.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ValidationComponent>
      {isLoading && (
        <Loader message="Please wait while the work is being done" />
      )}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded px-8 py-6 max-h-[90vh] overflow-auto">
        <div className="flex flex-col">
          <div className="text-sm">
            <BreadcrumbsComponent items={breadcrumbItems} />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Add Employee
          </h1>
        </div>
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
                // className={errors.fullname ? "border-red-500" : ""}
                isInvalid={!!errors.fullname}
                errorMessage={errors.fullname?.message}
              />
              {/* {errors.fullname && (
              //   <p className="text-red-500 text-sm">
              //     {errors.fullname.message}
              //   </p>
              // )} */}
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
              {/* {errors.salary && (
                <p className="text-red-500 text-sm">{errors.salary.message}</p>
              )} */}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Department
              </label>
              <select
                {...register("department", {
                  required: "Department is required",
                })}
                className={`w-full px-4 py-2 border-2 rounded-lg ${
                  errors.department ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select department</option>
                {departmentsData.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-red-500 text-sm">
                  {errors.department.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Position
              </label>
              <select
                {...register("position", {
                  required: "Position is required",
                })}
                className={`w-full px-4 py-2 border-2 rounded-lg ${
                  errors.position ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select position</option>
                {positionData.map((pos) => (
                  <option key={pos.id} value={pos.name}>
                    {pos.name}
                  </option>
                ))}
              </select>
              {errors.position && (
                <p className="text-red-500 text-sm">
                  {errors.position.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Roles
              </label>
              <select
                {...register("roles", {
                  required: "Role is required",
                })}
                className={`w-full px-4 py-2 border-2 rounded-lg ${
                  errors.roles ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select role</option>
                {roleData.map((role) => (
                  <option key={role.roleId} value={role.roleName}>
                    {role.roleName}
                  </option>
                ))}
              </select>
              {errors.roles && (
                <p className="text-red-500 text-sm">{errors.roles.message}</p>
              )}
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
            className="w-full bg-bgprimary text-white py-2 px-4 rounded-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </ValidationComponent>
  );
};

export default AddEmployeeForm;
