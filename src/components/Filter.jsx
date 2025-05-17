import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios-Instance";
import { Select, SelectItem } from "@nextui-org/select";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from "@nextui-org/react";
import { BsFilter } from "react-icons/bs";

import { useForm } from "react-hook-form";
import DatepickerComponent, { formatDate } from "./DatepickerComponent";

const Filter = ({
  onApplyFilters,
  url,
  fieldNames = {
    departmentField: "departmentId",
    positionField: "positionId",
    fromDateField: "created_at",
    toDateField: "toDate",
  },
}) => {
  const { watch, control } = useForm();

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "FromDate" || name === "toDate") {
        setFormData((prev) => ({ ...prev, [name]: value[name] }));
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);
  const [formData, setFormData] = useState({
    FromDate: null,
    toDate: null,
    department: "",
    position: "",
    roles: "",
  });

  const [departmentsData, setDepartmentsData] = useState([]);
  const [positionData, setPositionData] = useState([]);

  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingPositions, setLoadingPositions] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  /**Department Fetch */
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const response = await axiosInstance.post(
          "/api/v1/departments/get/all",
          {}
        );
        if (response.data.responseCode === "200") {
          setDepartmentsData(response?.data?.datalist);
        } else {
          toast.error(response?.data?.message);
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

  /**Position Fetch */
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
        toast.error("Error fetching positions.", error);
      } finally {
        setLoadingPositions(false);
      }
    };
    fetchPositions();
  }, []);

  const resetFilters = () => {
    setFormData({
      FromDate: null,
      toDate: null,
      department: "",
      position: "",
    });

    onApplyFilters({});
    onClose();
  };

  const onSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    setIsLoading(true);
    const filterCriteria = {};

    // Initialize the structure properly
    const requestBody = {
      pageIndex: 1,
      pageSize: 10,
      filterCriteria: {},
    };

    if (formData.FromDate || formData.toDate) {
      requestBody.filterCriteria.createdAt = {};

      if (formData.FromDate) {
        requestBody.filterCriteria.createdAt.from = formatDate(
          formData.FromDate
        );
      }

      if (formData.toDate) {
        requestBody.filterCriteria.createdAt.to = formatDate(formData.toDate);
      }
    }

    if (formData.department) {
      requestBody.filterCriteria[fieldNames?.departmentField] = parseInt(
        formData?.department || ""
      );
    }

    if (formData.position) {
      requestBody.filterCriteria[fieldNames?.positionField] = parseInt(
        formData?.position || ""
      );
    }

    try {
      const response = await axiosInstance.post(`${url}`, requestBody, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.responseCode === "200") {
        onClose();
        onApplyFilters({
          data: response.data.datalist,
          totalPages: response.data.totalPages,
          totalRecords: response.data.totalRecords,
        });
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error fetching data", error);
      toast.error("Error fetching data.");
    } finally {
      setIsLoading(false);
    }
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
      <Button onPress={onOpen} className="text-sm font-medium">
        <BsFilter className="mr-2 text-2xl" />
        <p className="">Filters</p>
      </Button>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>Filter Options</DrawerHeader>
          <DrawerBody>
            <div className="p-4 space-y-6">
              <div className="flex gap-4">
                <DatepickerComponent
                  name="FromDate"
                  label="From Date(A.D)"
                  control={control}
                  onChange={(date) => handleChange("FromDate", date)}
                />
                <DatepickerComponent
                  name="toDate"
                  label="To Date(A.D)"
                  control={control}
                  onChange={(date) => handleChange("toDate", date)}
                />
              </div>

              <Select
                label={loadingDepartments ? "Loading..." : "Department"}
                variant="bordered"
                selectedKeys={formData.department ? [formData.department] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  handleChange("department", selected);
                }}
                placeholder="Select a department">
                {loadingDepartments ? (
                  <SelectItem key="loading">Loading departments...</SelectItem>
                ) : (
                  filteredDepartments?.map((department) => (
                    <SelectItem
                      key={department.id.toString()}
                      value={department.name}>
                      {department.name}
                    </SelectItem>
                  ))
                )}
              </Select>

              <Select
                label={loadingPositions ? "Loading..." : "Position"}
                variant="bordered"
                selectedKeys={formData.position ? [formData.position] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  handleChange("position", selected);
                }}
                placeholder="Select a position">
                {loadingPositions ? (
                  <SelectItem key="loading">Loading positions...</SelectItem>
                ) : (
                  filteredPositions?.map((position) => (
                    <SelectItem
                      key={position.id.toString()}
                      value={position.positionName}>
                      {position.positionName}
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
