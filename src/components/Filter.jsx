import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "../lib/axios-Instance";
import { Select, SelectItem } from "@heroui/select";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from "@heroui/react";
import { BsFilter } from "react-icons/bs";
import { useForm } from "react-hook-form";
import DatepickerComponent, { formatDate } from "./ui/DatepickerComponent.jsx";

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
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      FromDate: null,
      toDate: null,
      department: "",
      position: "",
    },
  });

  const [departmentsData, setDepartmentsData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const fromDate = watch("FromDate");

  /** Fetch Departments */
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
          const errorMessage =
            response?.data?.error?.errorList?.[0]?.errorMessage ||
            "Something went wrong";
          toast.error(errorMessage);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      } finally {
        setLoadingDepartments(false);
      }
    };
    fetchDepartments();
  }, []);

  /** Fetch Positions */
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
        const errorMessage =
          error.response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      } finally {
        setLoadingPositions(false);
      }
    };
    fetchPositions();
  }, []);

  const onSubmit = async (formData) => {
    setIsLoading(true);

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
        formData.department
      );
    }

    if (formData.position) {
      requestBody.filterCriteria[fieldNames?.positionField] = parseInt(
        formData.position
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
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    reset();
    onApplyFilters({});
    onClose();
  };

  const filteredDepartments = useMemo(
    () => departmentsData?.filter((d) => !d?.isDeleted),
    [departmentsData]
  );

  const filteredPositions = useMemo(
    () => positionData?.filter((p) => !p?.isDeleted),
    [positionData]
  );

  return (
    <div className="bg-white rounded-xl">
      <Button onPress={onOpen} className="text-sm font-medium">
        <BsFilter className="mr-2 text-2xl" />
        <p>Filters</p>
      </Button>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>Filter Options</DrawerHeader>
          <DrawerBody>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
              <div className="flex gap-4">
                <DatepickerComponent
                  disabled={isLoading}
                  name="FromDate"
                  label="From Date (A.D)"
                  control={control}
                />
                <DatepickerComponent
                  disabled={isLoading}
                  name="toDate"
                  label="To Date (A.D)"
                  control={control}
                  rules={{
                    validate: (value) =>
                      !fromDate ||
                      !value ||
                      value >= fromDate ||
                      "End date cannot be before start date",
                  }}
                />
              </div>

              <Select
                label={loadingDepartments ? "Loading..." : "Department"}
                variant="bordered"
                isDisabled={isLoading}
                selectedKeys={watch("department") ? [watch("department")] : []}
                onSelectionChange={(keys) =>
                  setValue("department", Array.from(keys)[0] || "")
                }
                placeholder="Select a department">
                {loadingDepartments ? (
                  <SelectItem key="loading">Loading departments...</SelectItem>
                ) : (
                  filteredDepartments.map((dept) => (
                    <SelectItem key={dept.id.toString()} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))
                )}
              </Select>

              <Select
                label={loadingPositions ? "Loading..." : "Position"}
                variant="bordered"
                isDisabled={isLoading}
                selectedKeys={watch("position") ? [watch("position")] : []}
                onSelectionChange={(keys) =>
                  setValue("position", Array.from(keys)[0] || "")
                }
                placeholder="Select a position">
                {loadingPositions ? (
                  <SelectItem key="loading">Loading positions...</SelectItem>
                ) : (
                  filteredPositions.map((pos) => (
                    <SelectItem
                      key={pos.id.toString()}
                      value={pos.positionName}>
                      {pos.positionName}
                    </SelectItem>
                  ))
                )}
              </Select>

              <div className="flex justify-between">
                <Button
                  type="submit"
                  className="bg-black text-white hover:bg-hoverbackground"
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
            </form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Filter;
