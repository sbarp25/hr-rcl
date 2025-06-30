import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "sonner";
import ButtonComponent from "../../../components/ui/ButtonComp";
import DatepickerComponent, {
  formatDate,
} from "../../../components/ui/DatepickerComponent";
import { useForm } from "react-hook-form";
import InputComponent from "../../../components/ui/InputComponent";
import ReusableAutocomplete from "../../../components/ui/SearableDropdown";
import { useNavigate, useParams } from "react-router-dom";
import {
  useEditEmployee,
  useFetchUnPaginatedDepartment,
  useFetchUnPaginatedPosition,
  useFetchUnPaginatedRoles,
} from "../../../hooks/useAuth";
import Loader from "../../../components/Loader/Loader";
import GoBack from "../../../components/GoBack";
import { IoIosPeople } from "react-icons/io";
import { hasUpdateAccess, MENU_NAMES } from "../../../utils/permissionUtils";

const EditEmployees = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, control, reset } = useForm();
  const { id } = useParams();

  const navigate = useNavigate();
  const fetchEmployeeData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `api/v1/auth/get-by-rcl-id/${id}`
      );
      if (response.data.responseCode === "200") {
        const data = response?.data?.data;
        if (data) {
          reset({
            fullname: data.fullName || "",
            phone: data.phone || "",
            email: data.email || "",
            department: data.departmentId || "",
            position: data.positionId || "",
            roles: data.roleId || "",
            salary: data.grossSalary || "",
            fromDate: data.hiringDate || "",
          });
        }
      } else {
        toast.error(response?.data?.Message);
      }
    } catch (error) {
      toast.error("Failed to fetch employee data");
    } finally {
      setIsLoading(false);
    }
  };
  const { mutate: editEmployee, isPending } = useEditEmployee();

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
  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

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
  const hasaccess = hasUpdateAccess(MENU_NAMES.EMPLOYEES);
  const onSubmit = async (data) => {
    if (hasaccess) {
      const sanitizeddepartmentId = data?.department;
      const sanitizedpositionId = data?.position;
      const sanitizedroleId = data?.roles;
      const updateEmployee = {
        data: {
          rclId: id,
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
      editEmployee(updateEmployee, {
        onSuccess: () => {
          reset();
        },
      });
    }
  };
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, []);
  if (isLoading || isPending) {
    return <Loader />;
  }
  return (
    <div className="container space-y-4">
      <div className="flex justify-between">
        <div className="flex flex-col space-y-8 ">
          <div className="text-sm">
            <GoBack />
          </div>
        </div>
        <div className="page-title dark:text-white flex items-center -pl-2">
          <IoIosPeople />
          Edit Employee
        </div>
        <div></div>
      </div>
      <div className=" mx-auto bg-white dark:bg-black shadow-md rounded-xl px-8 py-6 max-h-[90vh] overflow-auto ">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
          <div className="flex flex-col space-y-8 gap-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              <div className="mb-4">
                <InputComponent
                  control={control}
                  name="fullname"
                  label="Full Name"
                  variant="bordered"
                  rules={{
                    required: "Full Name is required",
                    minLength: {
                      value: 3,
                      message: "Full name must be at least 3 characters",
                    },
                  }}
                />
              </div>
              <div className="mb-4">
                <InputComponent
                  control={control}
                  name="phone"
                  label="Phone"
                  variant="bordered"
                  rules={{
                    required: "Phone Number is required",
                    minLength: {
                      value: 10,
                      message: "Invalid Phone Number",
                    },
                    pattern: {
                      value: /^9[0-9]{9}$/,
                      message: "Phone must start with 9 and be 10 digits long",
                    },
                  }}
                />
              </div>
              <div className="mb-4">
                <InputComponent
                  control={control}
                  name="email"
                  label="Email"
                  variant="bordered"
                  rules={{
                    required: "Email ID is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email",
                    },
                  }}
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
                <InputComponent
                  control={control}
                  name="salary"
                  label="Salary"
                  variant="bordered"
                  rules={{
                    required: "Salary is required",
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message:
                        "Please enter a valid salary (e.g., 1000 or 1000.50)",
                    },
                  }}
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
          </div>
          <ButtonComponent
            className="flex gap-2 items-center w-fit bg-bgprimary dark:bg-white dark:text-black text-white py-2 px-4 rounded-2xl"
            type="Submit"
            content={"Update Employee"}
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
  );
};

export default EditEmployees;
