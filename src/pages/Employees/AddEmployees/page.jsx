import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../lib/axios-Instance";
import Loader from "../../../components/Loader";
import { Form, Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import ValidationComponent from "../../../components/ValidationComponent";
const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    email: "",
    department: "",
    position: "",
    roles: "",
    performEKYC: false,
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

  return (
    <>
      <ValidationComponent></ValidationComponent>
      {isLoading && (
        <Loader message="Please wait while the work is being done" />
      )}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded px-8 py-6 max-h-[90vh] overflow-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Add Employee
        </h1>
        <Form onSubmit={handleAddEmployee} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Full Name */}
            <div className="mb-4">
              <label
                htmlFor="fullname"
                className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="username"
                name="fullname"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="Enter full name"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-gray-700 font-medium mb-2">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4 w-full">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Department */}
            <div className="mb-4">
              <label
                htmlFor="department"
                className="block text-gray-700 font-medium mb-2">
                Department
              </label>
              <select
                id="department"
                name="department"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                value={formData.department}
                onChange={handleChange}
                required>
                <option value="" disabled selected>
                  Select department
                </option>
                {isLoading ? (
                  <option>Loading departments...</option>
                ) : (
                  departmentsData.length > 0 &&
                  departmentsData
                    .filter((department) => !department.isDeleted) // Filter out deleted departments
                    .map((department) => (
                      <option key={department.id} value={department.name}>
                        {department.name}
                      </option>
                    ))
                )}
              </select>
            </div>

            {/* Position */}
            <div className="mb-4">
              <label
                htmlFor="position"
                className="block text-gray-700 font-medium mb-2">
                Position
              </label>
              <select
                id="position"
                name="position"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                value={formData.position}
                onChange={handleChange}
                required>
                <option value="" disabled selected>
                  Select position
                </option>
                {isLoading ? (
                  <option>Loading positions...</option>
                ) : (
                  positionData.length > 0 &&
                  positionData.map((position) => (
                    <option key={position.id} value={position.name}>
                      {position.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Roles */}
          <div className="mb-4 w-full">
            <label
              htmlFor="roles"
              className="block text-gray-700 font-medium mb-2">
              Roles
            </label>
            <select
              id="roles"
              name="roles"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={formData.roles}
              onChange={handleChange}
              required>
              <option value="" disabled selected>
                Select role
              </option>
              {isLoading ? (
                <option>Loading roles...</option>
              ) : (
                roleData &&
                roleData.length > 0 &&
                roleData.map((role) => (
                  <option key={role.roleId} value={role.roleName}>
                    {role.roleName}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Perform eKYe */}
          <div className="mb-4 flex items-center">
            <Input
              type="checkbox"
              id="perform-ekyc"
              name="performEKYC"
              className="mr-2"
              defaultChecked={formData.performEKYC}
              // checked
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
