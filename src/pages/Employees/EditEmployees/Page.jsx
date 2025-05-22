import { useEffect, useState } from "react";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import GoBack from "../../../components/GoBack";
import { Controller, useForm } from "react-hook-form";
import UnderlineComponent from "../../../components/ui/UnderlineComponent.jsx";
import InputComponent from "../../../components/ui/InputComponent.jsx";
import SelectComp from "../../../components/ui/Select.jsx";
import DatepickerComponent, {
  formatDate,
} from "../../../components/ui/DatepickerComponent.jsx";
import ButtonComponent from "../../../components/ui/ButtonComp.jsx";
import { FaUser, FaPhone, FaEnvelope } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import { Switch } from "@nextui-org/react";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
const EditEmployees = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { handleSubmit, control, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [departmentsData, setDepartmentsData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Employees", href: "/Employees" },
    { label: "Edit Employees", href: "" },
  ];
  const genderOptions = [
    { key: "Male", label: "Male" },
    { key: "Female", label: "Female" },
  ];
  const bloodGroupOptions = [
    { key: "O+", label: "O+" },
    { key: "O-", label: "O-" },
    { key: "A+", label: "A+" },
    { key: "A-", label: "A-" },
    { key: "B+", label: "B+" },
    { key: "B-", label: "B-" },
    { key: "AB+", label: "AB+" },
    { key: "AB-", label: "AB-" },
  ];

  const maritalOptions = [
    { key: false, label: "Unmarried" },
    { key: true, label: "Married" },
  ];
  const relationOptions = [
    { key: "Father", label: "Father" },
    { key: "Mother", label: "Mother" },
    { key: "Brother", label: "Brother" },
    { key: "Sister", label: "Sister" },
  ];
  /**Fetch Departments */
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
  /**Fetch Employee Data */
  const fetchEmployeeData = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/admin/singleCompleteEkyeUser/rclId/${id}`
      );
      if (response.data.responseCode === "200") {
        const data = response?.data?.data;

        const departmentObj = departmentsData.find(
          (dept) => dept.name === data?.personalDetails?.departmentName
        );
        const PositionObj = positionData.find(
          (post) => post.name === data?.personalDetails?.postionName
        );
        reset({
          fullname: data?.personalDetails?.fullName,
          Age: data?.personalDetails?.age,
          gender: data?.personalDetails?.gender,
          phone: data?.personalDetails?.phone,
          email: data?.personalDetails?.email,
          DOB: data?.personalDetails?.dateOfBirthAd,
          department: departmentObj?.id || "",
          // department: data?.personalDetails?.departmentName,
          position: PositionObj?.id || "",

          maritialStatus: data?.personalDetails?.married,
          bloodGroup: data?.personalDetails?.bloodGroup,
          guardianName: data?.personalDetails?.guardianName,
          guardianPhone: data?.personalDetails?.guardianNumber,
          guardianRelation: data?.personalDetails?.guardianType,
          emergencyName: data?.personalDetails?.emergencyName,
          emergencyNumber: data?.personalDetails?.emergencyNumber,
          emergencyRelation: data?.personalDetails?.emergencyType,
        });

        console.log(data);
      } else {
        toast.error(response?.data?.Message);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
      // toast.error("Error fetching employee data.");
    }
  };
  /**Fetch Position */
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

  useEffect(() => {
    fetchEmployeeData();
    fetchDepartments();
    fetchPositions();
  }, []);

  const onSubmit = async (data) => {
    // const formattedData = {
    //   data: {
    //     email: data.email,
    //     dateOfBirthAd: data.dob,
    //     gender: data.gender,
    //     married: data.married,
    //     bloodGroup: data.bloodType,
    //     emergencyNumber: data.emergencyNumber,
    //     emergencyName: data.emergencyName,
    //     emergencyType: data.emergencyRelation,
    //     guardianName: data.guardianName,
    //     guardianType: data.guardianRelation,
    //     guardianNumber: data.guardianPhone,
    //   },
    // };
    // setIsLoading(true);
    // try {
    //   const response = await axiosInstance.post(
    //     "/api/v1/personal/save",
    //     formattedData,
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    //   if (response?.data?.responseCode === "201") {
    //     reset();
    //     toast.success(response?.data?.message);
    //   } else {
    //     toast.error(response.data.data.message);
    //   }
    // } catch (error) {
    //   console.error("Error adding Personal Data", error);
    //   toast.error("Error adding personal Data");
    // }
    console.log(data);
  };

  const onCancel = () => {
    navigate("/Employees");
  };
  const menu = LocalStorageUtil.getItem("menu");

  /**To check Employee see status */
  const hasaccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 11)
  );

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);
  return (
    <div className="px-4 flex flex-col space-y-4">
      {/* <BreadcrumbsComponent items={breadcrumbItems} /> */}
      <div className="flex justify-between">
        <GoBack />
        <div className="page-title -pl-2">Edit Employee</div>
        <div></div>
      </div>
      <div className="bg-gray-100 p-6 rounded-3xl max-h-[85vh] overflow-y-auto border-2 border-gray-300 space-y-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white p-4 rounded-2xl">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold flex mb-6">
                <span className="relative">
                  Basic Information
                  <UnderlineComponent />
                </span>
              </h1>

              <div className="flex gap-1 items-end justify-end text-right">
                <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
                <div className="flex w-2 h-2 rounded-full bg-black"></div>
                <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* All Basic Inputs */}
              <InputComponent
                control={control}
                label="Fullname"
                name="fullname"
                isReadOnly={true}
                rules={{
                  required: "Full Name is required",
                  minLength: {
                    value: 3,
                    message: "Full name must be at least 3 characters",
                  },
                }}
                variant="bordered"
              />
              <InputComponent
                control={control}
                label="Age"
                isReadOnly={true}
                name="Age"
                rules={{
                  required: "Age is required",
                }}
                variant="bordered"
              />

              <SelectComp
                name="gender"
                label="Gender"
                control={control}
                rules={{ required: "Gender is required" }}
                data={genderOptions}
                valueKey="key"
                labelKey="label"
              />
              <InputComponent
                control={control}
                label="Phone"
                isReadOnly={true}
                name="phone"
                rules={{
                  required: "Phone is required",
                  minLength: {
                    value: 10,
                    message: "Phone number must be 10 digits long",
                  },
                  pattern: {
                    value: /^9[0-9]{9}$/,
                    message: "Phone must start with 9 and be 10 digits long",
                  },
                }}
                variant="bordered"
              />

              <InputComponent
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                }}
                label="Personal Email"
                variant="bordered"
                type="email"
                inputClassName="w-full rounded-xl"
                icon={FaEnvelope}
              />

              <DatepickerComponent
                name="DOB"
                label="Date of birth(A.D)"
                control={control}
                rules={{
                  required: "Date of Birth is required",
                  validate: (value) => {
                    const birthdate = new Date(value);
                    const today = new Date();
                    const age = today.getFullYear() - birthdate.getFullYear();
                    return age > 18 || "You must be 18 or older";
                  },
                }}
              />
              <SelectComp
                name="department"
                label="Department"
                isReadOnly={true}
                control={control}
                rules={{ required: "Department is required" }}
                data={departmentsData}
                // data={maritalOptions}
                valueKey="id"
                labelKey="name"
                defaultValue={selectedDepartment}
                onSelectionChange={(selectedId) => {
                  // Find the selected department object using the ID
                  const department = departmentsData.find(
                    (dept) => dept.id === selectedId
                  );
                  setSelectedDepartment(department);
                }}
              />
              <SelectComp
                name="position"
                label="Position"
                control={control}
                isReadOnly={true}
                rules={{ required: "Position is required" }}
                // data={maritalOptions}
                data={positionData}
                valueKey="id"
                labelKey="positionName"
              />
              <SelectComp
                name="maritialStatus"
                label="Maritial Status"
                control={control}
                rules={{ required: "Maritial Status is required" }}
                data={maritalOptions}
                valueKey="key"
                labelKey="label"
              />
              <SelectComp
                name="bloodGroup"
                label="Blood Group"
                control={control}
                rules={{ required: "Blood Group is required" }}
                data={bloodGroupOptions}
                valueKey="key"
                labelKey="label"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Guardian Details */}
            <div className="bg-white p-6 rounded-xl  space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold flex mb-6">
                  <span className="relative">
                    Guardians Details
                    <UnderlineComponent />
                  </span>
                </h1>

                <div className="flex gap-1 items-end justify-end text-right">
                  <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="flex w-2 h-2 rounded-full bg-black"></div>
                  <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputComponent
                  name="guardianName"
                  control={control}
                  rules={{
                    required: "Guardian Name is required",
                    minLength: {
                      value: 3,
                      message:
                        "Guardian Name must be at least 3 characters long",
                    },
                  }}
                  label="Guardian Name"
                  variant="bordered"
                  type="text"
                  inputClassName="w-full rounded-xl"
                  icon={FaUser}
                />
                <InputComponent
                  name="guardianPhone"
                  control={control}
                  rules={{
                    required: "Guardian Phone is required",
                    pattern: {
                      value: /^9[0-9]{9}$/,
                      message: "Phone must start with 9 and be 10 digits long",
                    },
                  }}
                  label="Guardian Phone"
                  variant="bordered"
                  type="text"
                  inputClassName="w-full rounded-xl"
                  icon={FaPhone}
                />

                <SelectComp
                  name="guardianRelation"
                  label="Relation"
                  control={control}
                  rules={{ required: "Relation is required" }}
                  data={relationOptions}
                  valueKey="key"
                  labelKey="label"
                />
              </div>
            </div>

            {/* Emergency Details */}
            <div className="bg-white p-6 rounded-xl  space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold flex mb-6">
                  <span className="relative">
                    Emergency Details
                    <UnderlineComponent />
                  </span>
                </h1>

                <div className="flex gap-1 items-end justify-end text-right">
                  <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="flex w-2 h-2 rounded-full bg-black"></div>
                  <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputComponent
                  name="emergencyName"
                  control={control}
                  rules={{
                    required: "Emergency Name is required",
                    minLength: {
                      value: 3,
                      message:
                        "Emergency Name must be at least 3 characters long",
                    },
                  }}
                  label="Emergency Name"
                  variant="bordered"
                  type="text"
                  inputClassName="w-full rounded-xl"
                  icon={FaUser}
                />

                <InputComponent
                  name="emergencyNumber"
                  control={control}
                  rules={{
                    required: "Emergency Number is required",
                    pattern: {
                      value: /^9[0-9]{9}$/,
                      message: "Phone must start with 9 and be 10 digits long",
                    },
                  }}
                  label="Emergency Phone"
                  variant="bordered"
                  type="text"
                  inputClassName="w-full rounded-xl"
                  icon={FaPhone}
                />

                <InputComponent
                  name="emergencyRelation"
                  control={control}
                  rules={{ required: "Emergency Relation is required" }}
                  label="Emergency Relationship"
                  variant="bordered"
                  type="text"
                  inputClassName="w-full rounded-xl"
                  icon={FaUser}
                />
              </div>
            </div>
          </div>
          {/* <div className="flex flex-col gap-4">
            <Controller
              name="isteamLead"
              defaultValue={true}
              control={control}
              render={({ field }) => (
                <Switch isSelected={field.value} onValueChange={field.onChange}>
                  Is Employee treamLead
                </Switch>
              )}
            />
            <Controller
              name="isAssociateteamLead"
              defaultValue={true}
              control={control}
              render={({ field }) => (
                <Switch isSelected={field.value} onValueChange={field.onChange}>
                  Is Employee Associate Team Active
                </Switch>
              )}
            />
          </div> */}
          {/* Buttons */}
          <div className="flex justify-start gap-4 pt-4">
            <ButtonComponent
              type="submit"
              className="bg-amber-400 text-white"
              content={isLoading ? "Updating..." : "Update"}
            />
            <ButtonComponent
              onPress={onCancel}
              className="bg-white border-2 border-red-500 text-red-500"
              content="Cancel"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployees;
