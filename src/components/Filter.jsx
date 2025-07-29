import { useEffect, useMemo } from "react";
import { toast } from "sonner";
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
import {
  useApplyFilters,
  useFetchUnPaginatedDepartment,
  useFetchUnPaginatedPosition,
} from "../hooks/useAuth.js";

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
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      FromDate: null,
      toDate: null,
      department: "",
      position: "",
    },
  });

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const fromDate = watch("FromDate");

  // Use React Query hooks
  const {
    data: departmentsResponse = {},
    isLoading: loadingDepartments,
    error: departmentsError,
  } = useFetchUnPaginatedDepartment();

  const departmentsData = departmentsResponse?.datalist || [];
  const {
    data: positionResponse = {},
    isLoading: loadingPositions,
    error: positionsError,
  } = useFetchUnPaginatedPosition();
  const positionData = positionResponse?.datalist || [];

  const applyFiltersMutation = useApplyFilters((data) => {
    onClose();
    onApplyFilters(data);
  });

  const onSubmit = async (formData) => {
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

    applyFiltersMutation.mutate({ url, requestBody });
  };

  const resetFilters = () => {
    reset();
    onApplyFilters({});
    onClose();
  };

  const departmentItems = departmentsData
    ?.filter((d) => !d?.isDeleted)
    ?.map((department) => ({
      key: department?.id,
      label: department?.name,
    }));

  const positionItems = positionData
    ?.filter((p) => !p?.isDeleted)
    ?.map((position) => ({
      key: position?.id,
      label: position?.positionName,
    }));
  return (
    <div className="bg-white dark:bg-black rounded-xl">
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
                  disabled={applyFiltersMutation.isLoading}
                  name="FromDate"
                  label="From Date (A.D)"
                  control={control}
                />
                <DatepickerComponent
                  disabled={applyFiltersMutation.isLoading}
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
                  isDisabled={
                    applyFiltersMutation.isLoading || loadingDepartments
                  }
                />
              </div>

              <div>
                <ReusableAutocomplete
                  name="position"
                  control={control}
                  label={loadingPositions ? "Loading..." : "Position"}
                  items={positionItems}
                  isDisabled={
                    applyFiltersMutation.isLoading || loadingPositions
                  }
                />
              </div>

              <div className="flex justify-between">
                <Button
                  type="submit"
                  className="bg-black dark:bg-slate-500 text-white dark:hover:bg-hoverbackground hover:bg-hoverbackground"
                  isLoading={applyFiltersMutation.isLoading}>
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
