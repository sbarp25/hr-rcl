import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../lib/axios-Instance";
import Loader from "../../../components/Loader";
import { Button, Form, Input } from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Checkbox, Form } from "@nextui-org/react";

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

  // Fetch departments data
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/api/departments/get/all");
        if (response.data.responseCode === "200") {
          setDepartmentsData(response.data.datalist);
        } else {
          toast.error("Failed to fetch departments.");
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Error fetching departments.");
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
        const response = await axiosInstance.post("/api/positions/get/all");
        if (response.data.responseCode === "200") {
          setPositionData(response.data.datalist);
        } else {
          toast.error("Failed to fetch positions.");
        }
      } catch (error) {
        console.error("Error fetching positions:", error);
        toast.error("Error fetching positions.");
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
        const response = await axiosInstance.post("/api/roles/get/all", {});
        if (response.data.responseCode === "200") {
          setRoleData(response.data.datalist);
        } else {
          toast.error("Failed to fetch roles.");
        }
      } catch (error) {
        toast.error("Error fetching roles.");
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
  const filteredDepartments = departmentsData.filter(
    (department) => !department.isDeleted
  );
  const filteredposition = positionData.filter(
    (position) => !position.isDeleted
  );

  const filteredroles = roleData.filter((roles) => !roles.isDeleted);
  /**Id extraction */
  const departmentId = departmentsData.find(
    (department) => department.name === formData.department
  )?.id;

  const positionId = positionData.find(
    (position) => position.name === formData.position
  )?.id;

  const roleId = roleData.find(
    (role) => role.roleName === formData.roles
  )?.roleId;

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
      const response = await axiosInstance.post("auth/register", newEmployee, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
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
        toast.success("Employee added successfully!");
      } else {
        toast.error("Failed to add employee.");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Error adding employee.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <Loader message="Please wait while the work is being done" />
      )}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Add Employee
        </h1>
        <Form onSubmit={handleAddEmployee} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Full Name */}
            <div className="mb-4">
              <label
                htmlFor="fullname"
                className="block text-gray-700 font-medium mb-2"
              >
                Full Name
              </label>
              <Input
                type="text"
                id="fullname"
                name="fullname"
                className="rounded-xl shadow-md"
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
                className="block text-gray-700 font-medium mb-2"
              >
                Phone
              </label>
              <Input
                type="text"
                id="phone"
                name="phone"
                className="rounded-xl shadow-md"
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
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              className="rounded-xl shadow-md"
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
                className="block text-gray-700 font-medium mb-2"
              >
                Department
              </label>
              <Dropdown>
                <DropdownTrigger className="justify-between rounded-xl shadow-md">
                  <Button
                    variant="bordered"
                    className=" text-gray-500 rounded-lg w-full "
                  >
                    {formData.department || "Select Department"}
                    <RiArrowDropDownLine
                      className=" text-4xl 
                    "
                    />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Departments"
                  onAction={(key) => {
                    const selectedDepartment = filteredDepartments.find(
                      (dept) => dept.name === key
                    );
                    handleChange({
                      target: {
                        name: "department",
                        value: selectedDepartment?.name,
                      },
                    });
                  }}
                >
                  {isLoading ? (
                    <DropdownItem key="loading" disabled>
                      Loading departments...
                    </DropdownItem>
                  ) : filteredDepartments.length > 0 ? (
                    filteredDepartments.map((department) => (
                      <DropdownItem key={department.name}>
                        {department.name}
                      </DropdownItem>
                    ))
                  ) : (
                    <DropdownItem key="no-departments" disabled>
                      No departments available
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
            {/* Position */}
            <div className="mb-4">
              <label
                htmlFor="position"
                className="block text-gray-700 font-medium mb-2"
              >
                position
              </label>
              <Dropdown>
                <DropdownTrigger className="justify-between rounded-xl shadow-md">
                  <Button
                    variant="bordered"
                    className=" text-gray-500 rounded-lg w-full "
                  >
                    {formData.position || "Select position"}
                    <RiArrowDropDownLine
                      className=" text-4xl 
                    "
                    />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="positions"
                  onAction={(key) => {
                    const selectedPosition = filteredposition.find(
                      (post) => post.name === key
                    );
                    handleChange({
                      target: {
                        name: "position",
                        value: selectedPosition?.name,
                      },
                    });
                  }}
                >
                  {isLoading ? (
                    <DropdownItem key="loading" disabled>
                      Loading positions...
                    </DropdownItem>
                  ) : filteredposition.length > 0 ? (
                    filteredposition.map((position) => (
                      <DropdownItem key={position.name}>
                        {position.name}
                      </DropdownItem>
                    ))
                  ) : (
                    <DropdownItem key="no-position" disabled>
                      No position available
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          {/* Roles */}
          <div className="mb-4 w-full ">
            <label
              htmlFor="Roles"
              className="block text-gray-700 font-medium mb-2"
            >
              Roles
            </label>
            <Dropdown>
              <DropdownTrigger className="justify-between">
                <Button
                  variant="bordered"
                  className=" text-gray-500 rounded-lg w-full "
                >
                  {formData.roles || "Select Roles"}
                  <RiArrowDropDownLine
                    className=" text-4xl 
                    "
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Roless"
                onAction={(key) => {
                  const selectedRoles = filteredroles.find(
                    (dept) => dept.name === key
                  );
                  handleChange({
                    target: {
                      name: "Roles",
                      value: selectedRoles?.name,
                    },
                  });
                }}
              >
                {isLoading ? (
                  <DropdownItem key="loading" disabled>
                    Loading Roles...
                  </DropdownItem>
                ) : filteredroles.length > 0 ? (
                  filteredroles.map((Roles) => (
                    <DropdownItem key={Roles.name}>{Roles.name}</DropdownItem>
                  ))
                ) : (
                  <DropdownItem key="no-roles" disabled>
                    No roless available
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Perform eKYe */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="perform-ekyc"
              name="performEKYC"
              className="mr-2"
              defaultChecked
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
              className="w-full bg-bgprimary text-white py-2 px-4 rounded-lg"
            >
              Submit
            </button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddEmployeeForm;
