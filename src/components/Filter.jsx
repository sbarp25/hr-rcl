import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Spinner,
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
      <Button
        onPress={onOpen}
        className="bg-black text-white dark:bg-white dark:text-black  hover:bg-hoverbackground dark:hover:bg-hoverbackground dark:hover:text-white text-sm font-medium">
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
                    applyFiltersMutation.isPending || loadingDepartments
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
                    applyFiltersMutation.isPending || loadingPositions
                  }
                />
              </div>

              <div className="flex justify-between">
                <Button
                  type="submit"
                  className="bg-black text-white dark:bg-white dark:text-black hover:bg-hoverbackground dark:hover:bg-active dark:hover:text-white   "
                  isLoading={applyFiltersMutation.isLoading}>
                  {applyFiltersMutation.isPending ? (
                    <span className="flex items-center">
                      <Spinner
                        color="danger"
                        size="sm"
                        classNames={
                          {
                            // circle1: "bg-active",
                            // circle2: "bg-white",
                          }
                        }
                      />
                      <BsFilter className="mr-2" />
                      <span>Applying filters</span>
                    </span>
                  ) : (
                    <>
                      <BsFilter className="mr-2" />
                      <span>Apply Filters</span>
                    </>
                  )}
                </Button>
                <Button
                  className="bg-slate-300 dark:bg-slate-500 hover:bg-hoverbackground dark:hover:bg-active text-black dark:hover:text-white"
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
