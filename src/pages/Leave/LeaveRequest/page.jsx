import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputComponent from "../../../components/ui/InputComponent.jsx";
import ButtonComponent from "../../../components/ui/ButtonComp.jsx";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { now } from "@internationalized/date";
import DatepickerComponent, {
  formatDate,
} from "../../../components/ui/DatepickerComponent.jsx";
import TextAreaComp from "../../../components/ui/TextAreaComp.jsx";
import GoBack from "../../../components/GoBack";
import ReusableAutocomplete from "../../../components/ui/SearableDropdown";
import {
  hasCreateAccess,
  hasReadAccess,
  MENU_NAMES,
} from "../../../utils/permissionUtils.js";
import { useLeaveRequest } from "../../../hooks/useAuth.js";
import { Spinner } from "@heroui/react";
const LeaveRequest = () => {
  const { control, setValue, handleSubmit, watch } = useForm({
    defaultValues: {
      title: "",
      description: "",
      leaveType: "",
      teamlead: "",
      fromDate: null,
      ToDate: null,
      isHalfDay: false,
    },
    mode: "onChange",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isToDateDisabled, setIsToDateDisabled] = useState(false);
  const navigate = useNavigate();
  const { mutate: leaveRequestData } = useLeaveRequest();

  const LeaveType = [
    { key: "CASUAL", label: "Casual Leave" },
    { key: "VACATION", label: "Vacation" },
    { key: "SICK", label: "Sick Leave" },
    { key: "EXAM", label: "Exam Leave" },
    { key: "UNPAID", label: "Unpaid Leave" },
    { key: "PATERNITY", label: "Paternity Leave" },
    { key: "MATERNITY", label: "Maternity Leave" },
    { key: "PAID", label: "Paid Leave" },
  ];
  const leaveStatus = [
    { key: "FULL_DAY", label: "Full day" },
    { key: "FIRST_HALF", label: "First half" },
    { key: "SECOND_HALF", label: "Second half" },
  ];

  const fromDate = watch("fromDate");
  const leaveCategory = watch("leaveStatus");

  useEffect(() => {
    if (leaveCategory === "FIRST_HALF" || leaveCategory === "SECOND_HALF") {
      // Copy fromDate to ToDate and disable ToDate field
      if (fromDate) {
        setValue("ToDate", fromDate);
      }
      setIsToDateDisabled(true);
    } else {
      // Enable ToDate field when FULL_DAY is selected
      setIsToDateDisabled(false);
    }
  }, [leaveCategory, fromDate, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    const today = new Date();

    const applyleave = {
      data: {
        title: data?.title,
        leaveType: data?.leaveType,
        leaveSubject: data?.description,
        leaveCategory: data?.leaveStatus,
        leaveStatus: "PENDING",
        isHalfDay: data.isHalfDay,
        leaveStartDate: formatDate(data.fromDate),
        leaveEndDate: formatDate(data.ToDate),
        requestDate: formatDate(today),
      },
    };

    if (hasLeaveRequestaccess) {
      leaveRequestData(applyleave);
    } else {
      toast.error("Currently You dont have access to this setting.");
    }
  };

  // const hasaccess = true;
  // const hasLeaveRequestaccess = true;
  const hasaccess = hasReadAccess(MENU_NAMES.LEAVEREQUEST);

  const hasLeaveRequestaccess = hasCreateAccess(MENU_NAMES.LEAVEREQUEST);
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  return (
    <div className="px-2 sm:px-4 flex flex-col space-y-2 sm:space-y-4">
      <div className="flex items-center justify-between px-4 py-2">
        <GoBack />
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-center flex-1 mx-4">
          <span className="">Leave Request</span>
        </h1>
        <div className="w-8"></div>
      </div>

      <div className="bg-white dark:bg-black p-2 sm:p-4 rounded-xl max-h-[90vh] overflow-y-auto border border-gray-300 dark:border-slate-500 shadow-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-8 p-2 sm:p-4">
          {/* Leave Title */}
          <div>
            <InputComponent
              name="title"
              control={control}
              variant="bordered"
              label="Title"
              size="sm"
              className="w-full"
              rules={{
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters long.",
                },
                maxLength: {
                  value: 255,
                  message: "Title must be less than 255 characters long.",
                },
                pattern: {
                  value: /^[^\s]/,
                  message: "Title cannot start with a space",
                },
              }}
            />
          </div>

          <div className="grid grid-cols-1 gap-y-4 sm:gap-y-6 md:grid-cols-2 md:gap-x-4 md:gap-y-8">
            {/* Leave Type */}
            <div>
              <ReusableAutocomplete
                name="leaveType"
                control={control}
                label="Leave Type"
                items={LeaveType}
                rules={{ required: "Type of leave is required" }}
              />
            </div>
            <div>
              <ReusableAutocomplete
                name="leaveStatus"
                control={control}
                label="Leave Category"
                items={leaveStatus}
                rules={{ required: "Category of leave is required" }}
              />
            </div>

            {/* From Date */}
            <div>
              <DatepickerComponent
                name="fromDate"
                label="From Date(A.D)"
                control={control}
                size="sm"
                className="w-full"
                minValue={now("Etc/UTC")}
                rules={{
                  required: "Start date is required",
                  validate: (value) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const selectedDate = new Date(value);
                    selectedDate.setHours(0, 0, 0, 0);
                    return (
                      selectedDate >= today || "Date cannot be in the past"
                    );
                  },
                }}
              />
            </div>

            {/* To Date */}
            <div>
              <DatepickerComponent
                name="ToDate"
                control={control}
                label="To Date(A.D)"
                size="sm"
                className="w-full"
                disabled={isToDateDisabled}
                minValue={now("Etc/UTC")}
                rules={{
                  required: "End date is required",
                  validate: (value) =>
                    !fromDate ||
                    !value ||
                    value >= fromDate ||
                    "End date cannot be before start date",
                }}
              />
            </div>
          </div>

          {/* Reason for Leave */}
          <div>
            <TextAreaComp
              control={control}
              name="description"
              label="Description"
              rules={{
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters long.",
                },
                maxLength: {
                  value: 255,
                  message: "Description must be less than 255 characters long.",
                },
                pattern: {
                  value: /^[^\s]/,
                  message: "Description cannot start with a space",
                },
              }}
            />
          </div>

          <div className="flex justify-center sm:justify-start pt-2">
            <ButtonComponent
              type="submit"
              className="text-white bg-black dark:bg-white dark:text-black dark:hover:text-white hover:bg-active dark:hover:dark:bg-active w-full sm:w-auto"
              content={
                isLoading ? (
                  <span className="flex items-center gap-4">
                    <Spinner color="danger" size="sm" />
                    Submitting
                  </span>
                ) : (
                  "Submit"
                )
              }
              disabled={isLoading}
              size="sm"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequest;
