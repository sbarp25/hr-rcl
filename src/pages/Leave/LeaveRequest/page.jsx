import {
  Checkbox,
  DatePicker,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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

const LeaveRequest = () => {
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
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
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
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

  const onSubmit = async (data) => {
    setIsLoading(true);

    const applyleave = {
      data: {
        leaveType: data?.leaveType,
        leaveSubject: data?.description,
        leaveCategory: data?.leaveStatus,
        leaveStatus: "PENDING",
        isHalfDay: data.isHalfDay,
        leaveStartDate: formatDate(data.fromDate),
        leaveEndDate: formatDate(data.ToDate),
        leaveDate: formatDate(data.fromDate),
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
        navigate("/");
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
  // useEffect(() => {
  //   fetchassociateTeamLead();
  //   fetchTeamLead();
  // }, []);
  /**Width checking resizing the rows according to the screen size*/
  /**To check The screen width */
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

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
    return 4; // default for smaller screens
  };
  const hasaccess = true;

  useEffect(() => {
    if (!hasaccess) {
      navigate("/login");
    }
  }, [hasaccess, navigate]);

  return (
    <div className="px-4 flex flex-col space-y-4">
      <BreadcrumbsComponent items={breadcrumbItems} />
      <div className="page-title -pl-2">Leave Request</div>
      {/* <GoBack /> */}
      <div className="bg-white p-4 rounded-xl max-h-[85vh] overflow-y-auto border-2 border-gray-300 ">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-4">
          {/* Leave Title */}
          <div>
            <InputComponent
              name="title"
              control={control}
              variant="bordered"
              label="Title"
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
                // pattern: {
                //   value: /^[a-zA-Z0-9 ]{3,300}$/,
                //   message: "Title must be 3-300 characters long.",
                // },
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-12">
            {/* Leave Type */}
            <div>
              <SelectComp
                name="leaveType"
                label="Leave Type"
                control={control}
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
                label="From Date"
                control={control}
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
                // rules={{ required: "Start date is required" }}
              />
            </div>

            {/* To Date */}
            <div>
              <DatepickerComponent
                name="ToDate"
                control={control}
                rules={{
                  required: "End date is required",
                  validate: (value) =>
                    !fromDate ||
                    !value ||
                    value >= fromDate ||
                    "End date cannot be before start date",
                }}
                label="To Date"
              />
            </div>
          </div>
          {/* Reason for Leave */}
          <div>
            <Textarea
              minRows={getRows()}
              maxRows={getMaxRows()}
              isInvalid={!!errors.description}
              className={` rounded-xl `}
              label="Description"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters long.",
                },
                maxLength: {
                  value: 255,
                  message: "Description must be less than 255 characters long.",
                },
              })}
              variant="bordered"
            />
            {errors.description && (
              <p className="text-danger text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
          {/* <div>
            <Controller
              name="isHalfDay"
              control={control}
              render={({ field }) => (
                <Checkbox
                  isSelected={field.value}
                  onValueChange={field.onChange}>
                  Is Half Day?
                </Checkbox>
              )}
            />
          </div>
          {halfDay && (
            <div className="flex gap-4">
              <div>
                <Controller
                  name="isfirsthalf"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      isSelected={field.value}
                      onValueChange={field.onChange}>
                      Is First Half
                    </Checkbox>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="isSecondhalf"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      isSelected={field.value}
                      onValueChange={field.onChange}>
                      Is Second Half
                    </Checkbox>
                  )}
                />
              </div>
            </div>
          )} */}
          <ButtonComponent
            type="submit"
            className="bg-black text-white"
            content={isLoading ? "Submitting..." : "Submit"}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default LeaveRequest;
