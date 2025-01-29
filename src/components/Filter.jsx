import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios-Instance";
import { Select, SelectItem } from "@nextui-org/select";
import {
  Button,
  DatePicker,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from "@nextui-org/react";
import { BsFilter } from "react-icons/bs";

const Filter = () => {
  const [formData, setFormData] = useState({
    department: "",
    position: "",
    roles: "",
  });

  // Data states
  const [departmentsData, setDepartmentsData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [roleData, setRoleData] = useState([]);

  // Individual loading states
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fetch departments data
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const response = await axiosInstance.post(
          "/api/v1/departments/get/all"
        );
        if (response.data.responseCode === "200") {
          setDepartmentsData(response.data.datalist);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Error fetching departments.");
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch positions data
  useEffect(() => {
    const fetchPositions = async () => {
      setLoadingPositions(true);
      try {
        const response = await axiosInstance.post("/api/v1/positions/get/all");
        if (response.data.responseCode === "200") {
          setPositionData(response.data.datalist);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching positions:", error);
        toast.error("Error fetching positions.");
      } finally {
        setLoadingPositions(false);
      }
    };

    fetchPositions();
  }, []);

  // Fetch roles data
  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const response = await axiosInstance.post("/api/v1/role/get/all");
        if (response.data.responseCode === "200") {
          setRoleData(response.data.datalist);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Error fetching roles.");
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  const resetFilters = () => {
    setFormData({ department: "", position: "", roles: "" });
  };

  const filteredDepartments = useMemo(
    () => departmentsData.filter((department) => !department?.isDeleted),
    [departmentsData]
  );

  const filteredPositions = useMemo(
    () => positionData.filter((position) => !position?.isDeleted),
    [positionData]
  );

  const filteredRoles = useMemo(
    () => roleData.filter((role) => !role?.isDeleted),
    [roleData]
  );

  return (
    <div className="bg-gray-200">
      <Button onPress={onOpen} className="">
        <BsFilter className="mr-2" />
        Filters
      </Button>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>Filter Options</DrawerHeader>
          <DrawerBody>
            <div className="p-4 space-y-6">
              {/* Date Pickers */}
              <div className="flex gap-4">
                <DatePicker
                  isRequired
                  className="w-full"
                  label="From Date"
                  placeholder="Select from date"
                />
                <DatePicker
                  isRequired
                  className="w-full"
                  label="To Date"
                  placeholder="Select to date"
                />
              </div>

              {/* Department Dropdown */}
              <Select
                label={loadingDepartments ? "Loading..." : "Department"}
                value={formData.department}
                onChange={(value) => handleChange("department", value)}
                placeholder="Select a department"
              >
                {loadingDepartments ? (
                  <SelectItem key="loading">Loading departments...</SelectItem>
                ) : (
                  filteredDepartments.map((department) => (
                    <SelectItem key={department.id} value={department.name}>
                      {department.name}
                    </SelectItem>
                  ))
                )}
              </Select>

              {/* Position Dropdown */}
              <Select
                label={loadingPositions ? "Loading..." : "Position"}
                value={formData.position}
                onChange={(value) => handleChange("position", value)}
                placeholder="Select a position"
              >
                {loadingPositions ? (
                  <SelectItem key="loading">Loading positions...</SelectItem>
                ) : (
                  filteredPositions.map((position) => (
                    <SelectItem key={position.id} value={position.name}>
                      {position.name}
                    </SelectItem>
                  ))
                )}
              </Select>

              {/* Role Dropdown */}
              {/* <Select
                label={loadingRoles ? "Loading..." : "Role"}
                value={formData.roles}
                onChange={(value) => handleChange("roles", value)}
                placeholder="Select a role"
              >
                {loadingRoles ? (
                  <SelectItem key="loading">Loading roles...</SelectItem>
                ) : (
                  filteredRoles.map((role) => (
                    <SelectItem key={role.roleId} value={role.roleName}>
                      {role.roleName}
                    </SelectItem>
                  ))
                )}
              </Select> */}

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button
                  className="bg-blue-500 text-white"
                  onPress={() => toast.success("Filters applied!")}
                >
                  <BsFilter className="mr-2" />
                  Apply Filters
                </Button>
                <Button
                  className="bg-gray-300 hover:bg-gray-400 text-black"
                  onPress={resetFilters}
                >
                  Reset
                </Button>
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Filter;
