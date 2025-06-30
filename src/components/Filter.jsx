import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "../lib/axios-Instance";
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
import ReusableAutocomplete from "./ui/SearableDropdown.jsx";

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

  // Transform departments data for ReusableAutocomplete
  const departmentItems = departmentsData
    ?.filter((d) => !d?.isDeleted)
    ?.map((department) => ({
      key: department?.id,
      label: department?.name,
    }));

  // Transform positions data for ReusableAutocomplete
  const positionItems = positionData
    ?.filter((p) => !p?.isDeleted)
    ?.map((position) => ({
      key: position?.id,
      label: position?.positionName,
    }));

  return (
    <div className="bg-white rounded-xl">
      <Button onPress={onOpen} className="text-sm font-medium">
        <BsFilter className="mr-2 text-2xl" />
        <p>Filters</p>
      </Button>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
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

              <div>
                <ReusableAutocomplete
                  name="department"
                  control={control}
                  label={loadingDepartments ? "Loading..." : "Department"}
                  items={departmentItems}
                  isDisabled={isLoading || loadingDepartments}
                />
              </div>

              <div>
                <ReusableAutocomplete
                  name="position"
                  control={control}
                  label={loadingPositions ? "Loading..." : "Position"}
                  items={positionItems}
                  isDisabled={isLoading || loadingPositions}
                />
              </div>

              <div className="flex justify-between">
                <Button
                  type="submit"
                  className="bg-black dark:bg-slate-500 text-white dark:hover:bg-hoverbackground hover:bg-hoverbackground"
                  isLoading={isLoading}>
                  <BsFilter className="mr-2" />
                  Apply Filters
                </Button>
                <Button
                  className="bg-gray-300 dark:bg-slate-300 dark:hover:bg-gray-500 hover:bg-gray-400 text-black"
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
