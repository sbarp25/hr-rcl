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

const Filter = ({ onApplyFilters }) => {
  const [formData, setFormData] = useState({
    department: "",
    position: "",
    roles: "",
  });

  const [departmentsData, setDepartmentsData] = useState([]);
  const [positionData, setPositionData] = useState([]);

  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingPositions, setLoadingPositions] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const response = await axiosInstance.post(
          "/api/v1/departments/get/all"
        );
        if (response.data.responseCode === "200") {
          setDepartmentsData(response?.data?.datalist);
        } else {
          toast.error(response.data?.data?.message);
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

  useEffect(() => {
    const fetchPositions = async () => {
      setLoadingPositions(true);
      try {
        const response = await axiosInstance.post("/api/v1/positions/get/all");
        if (response.data.responseCode === "200") {
          setPositionData(response?.data?.datalist);
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

  const resetFilters = () => {
    setFormData({ department: "", position: "" });
  };

  const onSubmit = async () => {
    setIsLoading(true);

    const requestBody = {
      pageIndex: 0,
      pageSize: 10, // Set the page size as needed
      filterCriteria: {
        // fromDate: "2025-01-16",
        // toDate: "2025-01-25",
        departmentName: formData.department || "",
        positionName: formData.position || "",
      },
    };

    try {
      const response = await axiosInstance.post(
        "/api/v1/admin/completedEkyeUsers",
        requestBody,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.responseCode === "201") {
        resetFilters();
        toast.success(response.data.data.message);
      } else {
        toast.error(response.data.data.message);
      }
    } catch (error) {
      console.error("Error fetching data", error);
      toast.error("Error fetching data.");
    } finally {
      setIsLoading(false);
    }
    onApplyFilters(formData);
  };

  const filteredDepartments = useMemo(
    () => departmentsData?.filter((department) => !department?.isDeleted),
    [departmentsData]
  );

  const filteredPositions = useMemo(
    () => positionData?.filter((position) => !position?.isDeleted),
    [positionData]
  );

  return (
    <div className="bg-white rounded-xl">
      <Button onPress={onOpen} variant="light">
        <BsFilter className="mr-2 text-2xl" />
        <p className="">Filters</p>
      </Button>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>Filter Options</DrawerHeader>
          <DrawerBody>
            <div className="p-4 space-y-6">
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

              <Select
                label={loadingDepartments ? "Loading..." : "Department"}
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                placeholder="Select a department">
                {loadingDepartments ? (
                  <SelectItem key="loading">Loading departments...</SelectItem>
                ) : (
                  filteredDepartments?.map((department) => (
                    <SelectItem key={department.name} value={department.name}>
                      {department.name}
                    </SelectItem>
                  ))
                )}
              </Select>

              <Select
                label={loadingPositions ? "Loading..." : "Position"}
                value={formData.position}
                onChange={(e) => handleChange("position", e.target.value)}
                placeholder="Select a position">
                {loadingPositions ? (
                  <SelectItem key="loading">Loading positions...</SelectItem>
                ) : (
                  filteredPositions?.map((position) => (
                    <SelectItem key={position.name} value={position.name}>
                      {position.name}
                    </SelectItem>
                  ))
                )}
              </Select>

              <div className="flex justify-between">
                <Button
                  className="bg-black text-white hover:bg-hoverbackground"
                  onPress={onSubmit}
                  isLoading={isLoading}>
                  <BsFilter className="mr-2" />
                  Apply Filters
                </Button>
                <Button
                  className="bg-gray-300 hover:bg-gray-400 text-black"
                  onPress={resetFilters}>
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
