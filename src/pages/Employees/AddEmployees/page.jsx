import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input, Checkbox } from "@heroui/react";
import { IoIosPeople } from "react-icons/io";

import { getLocalTimeZone } from "@internationalized/date";
import GoBack from "../../../components/GoBack";
import DatepickerComponent from "../../../components/ui/DatepickerComponent.jsx";
import ReusableAutocomplete from "../../../components/ui/SearableDropdown";
import Loader from "../../../components/Loader/Loader.jsx";
import { hasCreateAccess, MENU_NAMES } from "../../../utils/permissionUtils.js";
import {
  useEmployeeCreate,
  useFetchUnPaginatedDepartment,
  useFetchUnPaginatedPosition,
  useFetchUnPaginatedRoles,
} from "../../../hooks/useAuth.js";
import ButtonComponent from "../../../components/ui/ButtonComp.jsx";

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
    mode: "onChange",
  });

  const navigate = useNavigate();
  const { mutate: createEmployee, isPending } = useEmployeeCreate();

  //Fetch Department
  const { data: department, isLoading: departmentIsLaoding } =
    useFetchUnPaginatedDepartment();
  const departmentsData = department?.datalist;

  //Fetch Position
  const { data: position, isLoading: positionIsLoading } =
    useFetchUnPaginatedPosition();
  const positionData = position?.datalist;

  //Fetch Role
  const { data: roles, isLoading: rolesIsLoading } = useFetchUnPaginatedRoles();
  const roleData = roles?.datalist;

  const onSubmit = async (data) => {
    if (hasaccess) {
      // setIsLoading(true);
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
      createEmployee(newEmployee, {
        onSuccess: () => {
          reset();
        },
      });
    }
  };

  const hasaccess = hasCreateAccess(MENU_NAMES.EMPLOYEES);
  // const hasaccess = true;

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
      {positionIsLoading ? (
        <Loader />
      ) : (
        <div className="container space-y-4">
          <div className="flex justify-between">
            <div className="flex flex-col space-y-8 ">
              <div className="text-sm">
                <GoBack />
              </div>
            </div>
            <div className="page-title dark:text-white flex items-center -pl-2">
              <IoIosPeople />
              Add Employee
            </div>
            <div></div>
          </div>
          <div className=" mx-auto bg-white dark:bg-black shadow-md rounded-xl px-8 py-6 max-h-[90vh] overflow-auto ">
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
                      onBlur={(e) => {
                        const trimmedValue = e.target.value.trim();
                        e.target.value = trimmedValue;
                        // Trigger validation
                        register("email").onChange({
                          target: { name: "email", value: trimmedValue },
                        });
                      }}
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
              <ButtonComponent
                className="flex gap-2 items-center w-fit bg-bgprimary dark:bg-white dark:text-black text-white py-2 px-4 rounded-2xl"
                type="Submit"
                content={"Add Employee"}
              />
              {/* <button
                type="submit"
                className="flex gap-2 items-center w-fit bg-bgprimary text-white py-2 px-4 rounded-2xl">
                <img src={Submit} alt="Submit" className="h-4 w-4" />
                Add Employee
              </button> */}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddEmployeeForm;
