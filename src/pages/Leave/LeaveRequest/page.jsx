import {
  Checkbox,
  DatePicker,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import InputComponent from "../../../components/InputComponent";
import ButtonComponent from "../../../components/ButtonComp";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getLocalTimeZone } from "@internationalized/date";
import GoBack from "../../../components/GoBack";
import SelectComp from "../../../components/Select";
import DatepickerComponent, {
  formatDate,
} from "../../../components/DatepickerComponent";
import TextAreaComp from "../../../components/TextAreaComp";

const LeaveRequest = () => {
  const { control, reset, setValue, handleSubmit, watch } = useForm({
    defaultValues: {
      title: "",
      description: "",
      leaveType: "",
      teamlead: "",
      fromDate: null,
      ToDate: null,
      isHalfDay: false,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isToDateDisabled, setIsToDateDisabled] = useState(false);
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: "Leave", href: "" },
    { label: "Leave Request", href: "/Leave/Request" },
  ];

  const LeaveType = [
    { key: "CASUAL", label: "Casual Leave" },
    { key: "VACATION", label: "Vacation" },
    { key: "SICK", label: "Sick Leave" },
    { key: "EXAM", label: "Exam Leave" },
    { key: "UNPAID", label: "Unpaid Leave" },
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

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Authentication token is missing.");
        setIsLoading(false);
        return;
      }

      const response = await axiosInstance.post(
        "/api/leave/apply_leave",
        applyleave,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response?.data?.responseCode === "200") {
        reset();
        navigate("/dashboard");
        toast.success(response?.data?.message);
      } else {
        const errorMessage = response?.data?.error || "Something went wrong";
        console.log(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      console.log(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic rows for textarea based on screen size
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getMaxRows = () => {
    if (screenWidth >= 1536) return 12; // 2xl
    if (screenWidth >= 1280) return 10; // xl
    if (screenWidth >= 1024) return 8; // lg
    if (screenWidth >= 768) return 6; // md
    return 4; // default for smaller screens
  };

  const getRows = () => {
    if (screenWidth >= 1536) return 10; // 2xl
    if (screenWidth >= 1280) return 8; // xl
    if (screenWidth >= 1024) return 6; // lg
    if (screenWidth >= 768) return 4; // md
    return 3; // default for smaller screens
  };

  const hasaccess = true;

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="px-2 sm:px-4 flex flex-col space-y-2 sm:space-y-4">
      <div className="hidden md:block">
        <BreadcrumbsComponent items={breadcrumbItems} />
      </div>
      <div>
        <h1 className="text-xl sm:text-md font-semibold">Leave Request</h1>
      </div>
      {/* <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold">Leave Request</h1>
        <div className="md:hidden">
          <GoBack />
        </div>
      </div> */}

      <div className="bg-white p-2 sm:p-4 rounded-xl max-h-[90vh] overflow-y-auto border border-gray-300 shadow-sm">
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
              }}
            />
          </div>

          <div className="grid grid-cols-1 gap-y-4 sm:gap-y-6 md:grid-cols-2 md:gap-x-4 md:gap-y-8">
            {/* Leave Type */}
            <div>
              <SelectComp
                name="leaveType"
                label="Leave Type"
                control={control}
                size="sm"
                className="w-full"
                rules={{ required: "Type of leave is required" }}
                data={LeaveType}
                valueKey="key"
                labelKey="label"
              />
            </div>
            <div>
              <SelectComp
                name="leaveStatus"
                label="Leave Category"
                control={control}
                size="sm"
                className="w-full"
                rules={{ required: "Category of leave is required" }}
                data={leaveStatus}
                valueKey="key"
                labelKey="label"
              />
            </div>

            {/* From Date */}
            <div>
              <DatepickerComponent
                name="fromDate"
                label="From Date in AD"
                control={control}
                size="sm"
                className="w-full"
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
                label="To Date in AD"
                size="sm"
                className="w-full"
                disabled={isToDateDisabled}
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
              }}
            />
          </div>

          <div className="flex justify-center sm:justify-start pt-2">
            <ButtonComponent
              type="submit"
              className="bg-black text-white w-full sm:w-auto"
              content={isLoading ? "Submitting..." : "Submit"}
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
