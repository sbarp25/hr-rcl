import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../lib/axios-Instance";
import { Form, Input, Select, SelectItem } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import ValidationComponent from "../../../components/ValidationComponent";
import Inputcomp from "../../../components/Inputcomp";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
// import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    email: "",
    department: "",
    position: "",
    roles: "",
    hiredate: "",
    performEKYC: true,
  });
  const [departmentsData, setDepartmentsData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // Fetch departments data
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post(
          "/api/v1/departments/get/all"
          // "/api/departments/get/all"
        );
        if (response.data.responseCode === "200") {
          setDepartmentsData(response.data.datalist);
        } else {
          toast.error(response.data.data.message);
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

  // Fetch positions data
  useEffect(() => {
    const fetchPositions = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/api/v1/positions/get/all");
        // const response = await axiosInstance.post("/api/positions/get/all");
        if (response.data.responseCode === "200") {
          setPositionData(response.data.datalist);
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

  // Fetch roles data
  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/api/v1/role/get/all", {});
        // const response = await axiosInstance.post("/api/roles/get/all", {});
        if (response.data.responseCode === "200") {
          setRoleData(response.data.datalist);
        } else {
          toast.error(response.data.message);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  /**Id extraction */
  const departmentId = departmentsData.find(
    (department) => department.name === formData.department
  )?.id;

  const roleId = roleData.find(
    (role) => role.roleName === formData.roles
  )?.roleId;

  const positionId = positionData.find(
    (position) => position.name === formData.position
  )?.id;

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newEmployee = {
      data: {
        fullName: formData.fullname,
        phone: formData.phone,
        email: formData.email,
        departmentId: departmentId,
        positionId: positionId,
        password: "Xlsnx$c$wi&3MptW$",
        roleId: roleId,
        performEkye: formData.performEKYC,
      },
    };
    console.log(newEmployee);
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axiosInstance.post(
        "/api/v1/auth/register",
        // "/auth/register",
        newEmployee,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.responseCode === "200") {
        // Reset the form
        setFormData({
          fullname: "",
          phone: "",
          email: "",
          department: "",
          position: "",
          roles: "",
          performEKYC: false,
        });
        navigate("/Employees");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Error adding employee.", error);
    } finally {
      setIsLoading(false);
    }
  };
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Employees", href: "/Employees" },
    { label: "Add Employees", href: "/AddEmployees" },
  ];
  return (
    <>
      <ValidationComponent></ValidationComponent>
      {/* {isLoading && (
        <Loader message="Please wait while the work is being done" />
      )} */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded px-8 py-6 max-h-[90vh] overflow-auto">
        <BreadcrumbsComponent items={breadcrumbItems} />
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Add Employee
        </h1>
        <Form onSubmit={handleAddEmployee} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {/* Full Name */}
            <div className="mb-4">
              <Input
                variant="bordered"
                type="text"
                id="phone"
                name="fullname"
                label="Enter FullName"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <Input
                variant="bordered"
                type="text"
                id="phone"
                name="phone"
                label="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4 ">
              <Input
                variant="bordered"
                type="email"
                id="email"
                name="email"
                label="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {/* Department */}
            <div className="mb-4">
              <Select
                scrollShadowProps={{
                  isEnabled: true, // Enable the scroll shadow if needed
                }}
                variant="bordered"
                label={isLoading ? "Loading..." : "Select A Department"}
                selectedKeys={formData.department}
                onSelectionChange={handleChange}
                defaultValue={"Select Department"}>
                {isLoading ? (
                  <SelectItem key="loading">Loading departments...</SelectItem>
                ) : (
                  departmentsData?.length > 0 &&
                  departmentsData
                    .filter((department) => !department?.isDeleted) // Filter out deleted departments
                    .map((department) => (
                      <SelectItem key={department?.id} value={department?.name}>
                        {department?.name}
                      </SelectItem>
                    ))
                )}
              </Select>
            </div>

            {/* Position */}
            <div className="mb-4">
              <Select
                scrollShadowProps={{
                  isEnabled: true, // Enable the scroll shadow if needed
                }}
                variant="bordered"
                label={isLoading ? "Loading..." : "Select A Position"}
                selectedKeys={formData.position}
                onSelectionChange={handleChange}
                defaultValue={"Select Position"}>
                {isLoading ? (
                  <SelectItem key="loading">Loading Position...</SelectItem>
                ) : (
                  positionData?.length > 0 &&
                  positionData
                    .filter((position) => !position?.isDeleted) // Filter out deleted departments
                    .map((position) => (
                      <SelectItem key={position?.id} value={position?.name}>
                        {position?.name}
                      </SelectItem>
                    ))
                )}
              </Select>
            </div>

            {/* Roles */}
            <div className="mb-4 ">
              <Select
                scrollShadowProps={{
                  isEnabled: true, // Enable the scroll shadow if needed
                }}
                variant="bordered"
                label={isLoading ? "Loading..." : "Select A Role"}
                selectedKeys={formData.roles}
                onSelectionChange={handleChange}
                defaultValue={"Select Role"}>
                {isLoading ? (
                  <SelectItem key="loading">Loading Roles...</SelectItem>
                ) : (
                  roleData &&
                  roleData.length > 0 &&
                  roleData.map((role) => (
                    <SelectItem key={role.roleId} value={role.roleName}>
                      {role.roleName}
                    </SelectItem>
                  ))
                )}
              </Select>
            </div>
          </div>

          {/* Perform eKYe */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <div>
              <Input
                classNames={{
                  inputWrapper: "shadow-lg",
                }}
                label="Hiring Date"
                variant="bordered"
                type="date"
                value={formData.hiredate || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="perform-ekyc"
              name="performEKYC"
              className="mr-2"
              checked={formData.performEKYC}
              onChange={handleChange}
            />
            <label htmlFor="perform-ekyc" className="text-gray-700 font-medium">
              Perform eKYE
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-bgprimary text-white py-2 px-4 rounded-lg">
              Submit
            </button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddEmployeeForm;
