import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosInstance from "../../../lib/axios-Instance";
import Loader from "../../../components/Loader";
import { useNavigate } from "react-router-dom";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import {
  DatePicker,
  Input,
  Select,
  SelectItem,
  Checkbox,
  Switch,
} from "@nextui-org/react";
import { IoIosPeople } from "react-icons/io";
import Submit from "../../../assets/svgs/Submit.svg";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import { getLocalTimeZone } from "@internationalized/date";
import GoBack from "../../../components/GoBack";
import DatepickerComponent from "../../../components/DatepickerComponent";
import ReusableAutocomplete from "../../../components/ui/SearableDropdown";
const AddEmployeeForm = () => {
  const {
    register,
    handleSubmit,
    control,
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

  const menu = LocalStorageUtil.getItem("menu");
  const breadcrumbItems = [
    { label: "Employees", href: "/Employees" },
    { label: "Add Employees", href: "/AddEmployees" },
  ];
  const hasemployeecreateaccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 1)
  );

  // useEffect(() => {
  //   if (!hasemployeecreateaccess) {
  //     navigate("/Employees");
  //   }
  // }, []);

  //FetchDepartment
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
  //Fetch Position
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
  //Fetch Role
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
    if (hasaccess) {
      setIsLoading(true);
      const sanitizeddepartmentId = data.department.replace(/[^0-9]/g, "");
      const sanitizedpositionId = data.position.replace(/[^0-9]/g, "");
      const sanitizedroleId = data.roles.replace(/[^0-9]/g, "");
      const formatDate = (date) =>
        date
          ? date?.toDate(getLocalTimeZone()).toISOString().split("T")[0]
          : null;
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
          grossSalary: data.salary,
          hiringDate: formatDate(data.fromDate),
          isTeamLead: data.isteamLead,
          isAssociateTeamLead: data.isAssociateteamLead,
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
          const errorMessage =
            response?.data?.error?.errorList?.[0]?.errorMessage ||
            "Something went wrong";
          toast.error(errorMessage);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Something went wrong";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Currently You dont have access to this setting.");
    }
  };

  // const hasaccess = true;
  const hasaccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 9)
  );

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, []);

  const departmentItems = departmentsData?.map((department) => ({
    key: department?.id,
    label: department?.name,
  }));
  const positionItems = positionData?.map((position) => ({
    key: position?.id,
    label: position?.positionName,
  }));
  const roleItems = roleData?.map((role) => ({
    key: role?.roleId,
    label: role?.roleName,
  }));
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="container space-y-4">
          <div className="flex justify-between">
            <div className="flex flex-col space-y-8 ">
              <div className="text-sm">
                <GoBack />
                {/* <BreadcrumbsComponent items={breadcrumbItems} /> */}
              </div>
            </div>
            <div className="page-title flex items-center -pl-2">
              <IoIosPeople />
              Add Employee
            </div>
            <div></div>
          </div>
          <div className=" mx-auto bg-white shadow-md rounded-xl px-8 py-6 max-h-[90vh] overflow-auto ">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full space-y-8">
              <div className="flex flex-col space-y-8 gap-4 w-full">
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
                          value: /^9[0-9]{9}$/,
                          message:
                            "Phone must start with 9 and be 10 digits long",
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
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {/**Select Department */}
                  <div>
                    <ReusableAutocomplete
                      name="department"
                      control={control}
                      label="Department"
                      items={departmentItems}
                      rules={{ required: "This field is required" }}
                    />
                  </div>
                  {/* <div>
                    <Controller
                      name="department"
                      control={control}
                      rules={{ required: "Department is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          variant="bordered"
                          label="Department"
                          isInvalid={!!errors.department}
                          className={`rounded-xl `}
                          selectedKeys={field.value ? [field.value] : []}
                          onSelectionChange={(keys) =>
                            field.onChange(Array.from(keys)[0])
                          }>
                          {departmentsData?.map((dept) => (
                            <SelectItem key={dept.id} textValue={dept.name}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.department && (
                      <p className="text-danger text-sm">
                        {errors.department.message}
                      </p>
                    )}
                  </div> */}
                  {/**Select Position */}
                  <div>
                    <ReusableAutocomplete
                      name="position"
                      control={control}
                      label="Position"
                      items={positionItems}
                      rules={{ required: "This field is required" }}
                    />
                  </div>
                  {/* <div>
                    <Controller
                      name="position"
                      control={control}
                      rules={{ required: "Position is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          variant="bordered"
                          label="Position"
                          isInvalid={!!errors.position}
                          className={`rounded-xl `}
                          selectedKeys={field.value ? [field.value] : []}
                          onSelectionChange={(keys) =>
                            field.onChange(Array.from(keys)[0])
                          }>
                          {positionData.map((pos) => (
                            <SelectItem
                              key={pos.id}
                              textValue={pos.positionName}>
                              {pos.positionName}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.position && (
                      <p className="text-danger text-sm">
                        {errors.position.message}
                      </p>
                    )}
                  </div> */}

                  {/**Select Role  */}
                  <div>
                    <ReusableAutocomplete
                      name="roles"
                      control={control}
                      label="Roles"
                      items={roleItems}
                      rules={{ required: "This field is required" }}
                    />
                  </div>
                  {/* <div>
                    <Controller
                      name="roles"
                      control={control}
                      rules={{ required: "Role is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          variant="bordered"
                          label="roles"
                          isInvalid={!!errors.roles}
                          className={`rounded-xl`}
                          selectedKeys={field.value ? [field.value] : []}
                          onSelectionChange={(keys) =>
                            field.onChange(Array.from(keys)[0])
                          }>
                          {roleData.map((role) => (
                            <SelectItem
                              key={role.roleId}
                              textValue={role.roleName}>
                              {role.roleName}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.roles && (
                      <p className="text-danger text-sm">
                        {errors.roles.message}
                      </p>
                    )}
                  </div> */}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
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
                    {/* <DatePicker {...register("HireDate",{required:"Hire Date is required"})}  isInvalid={!!errors.HireDate} errorMessage={errors.HireDate?.message} label="Hire Date" variant="bordered" /> */}
                    <div>
                      <DatepickerComponent
                        name="fromDate"
                        control={control}
                        label="Hire Date(A.D)"
                        size="sm"
                        className="w-full"
                        rules={{
                          required: "Start date is required",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Controller
                    name="performEKYC"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        color="primary"
                        isSelected={field.value}
                        onValueChange={field.onChange}>
                        Perform eKYE
                      </Checkbox>
                    )}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="flex gap-2 items-center w-fit bg-bgprimary text-white py-2 px-4 rounded-2xl">
                <img src={Submit} alt="Submit" className="h-4 w-4" />
                Add Employee
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddEmployeeForm;
