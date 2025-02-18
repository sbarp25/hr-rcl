import {
  Checkbox,
  DatePicker,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import InputComponent from "../../../components/InputComponent";
import ButtonComponent from "../../../components/ButtonComp";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getLocalTimeZone } from "@internationalized/date";

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

  const TeamLeader = [
    { key: "john", label: "John Doe" },
    { key: "jane", label: "Jane Smith" },
    { key: "alex", label: "Alex Johnson" },
  ];

  const fromDate = watch("fromDate");
  const toDate = watch("ToDate");

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formatDate = (date) =>
      date
        ? date?.toDate(getLocalTimeZone()).toISOString().split("T")[0]
        : null;

    const applyleave = {
      data: {
        leaveType: data?.leaveType,
        leaveSubject: data?.description,
        leaveStatus: "APPROVED",
        isHalfDay: data.isHalfDay,
        leaveStartDate: formatDate(data.fromDate),
        leaveEndDate: formatDate(data.ToDate),
        leaveDate: formatDate(data.fromDate),
        teamLeaderName: data?.teamlead,
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

      if (response.data.responseCode === "200") {
        reset();
        navigate("/");
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex flex-col space-y-4">
      <BreadcrumbsComponent items={breadcrumbItems} />
      <div className="page-title -pl-2">Leave Request</div>
      <div className="bg-white p-4 rounded-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 p-4">
          {/* Leave Title */}
          <div>
            <InputComponent
              name="title"
              control={control}
              variant="bordered"
              label="Title"
              rules={{
                required: "Title is required",
                pattern: {
                  value: /^[a-zA-Z0-9 ]{3,300}$/,
                  message: "Title must be 3-300 characters long.",
                },
              }}
            />
          </div>

          {/* Reason for Leave */}
          <div>
            <Textarea
              label="Description"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters long.",
                },
              })}
              variant="bordered"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-12">
            {/* Leave Type */}
            <div>
              <Controller
                name="leaveType"
                control={control}
                rules={{ required: "Type of leave is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    variant="bordered"
                    label="Leave Type"
                    selectedKeys={field.value ? [field.value] : []}
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys)[0])
                    }>
                    {LeaveType.map((leave) => (
                      <SelectItem key={leave.key} value={leave.key}>
                        {leave.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
              {errors.leaveType && (
                <p className="text-red-500 text-sm">
                  {errors.leaveType.message}
                </p>
              )}
            </div>

            {/* Team Leader */}
            <div>
              <Controller
                name="teamlead"
                control={control}
                rules={{ required: "Team Lead is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    variant="bordered"
                    label="Team Leader"
                    selectedKeys={field.value ? [field.value] : []}
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys)[0])
                    }>
                    {TeamLeader.map((team) => (
                      <SelectItem key={team.key} value={team.key}>
                        {team.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
              {errors.teamlead && (
                <p className="text-red-500 text-sm">
                  {errors.teamlead.message}
                </p>
              )}
            </div>

            {/* From Date */}
            <div>
              <Controller
                name="fromDate"
                control={control}
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <DatePicker {...field} label="From Date" variant="bordered" />
                )}
              />
              {errors.fromDate && (
                <p className="text-red-500 text-sm">
                  {errors.fromDate.message}
                </p>
              )}
            </div>

            {/* To Date */}
            <div>
              <Controller
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
                render={({ field }) => (
                  <DatePicker {...field} label="To Date" variant="bordered" />
                )}
              />
              {errors.ToDate && (
                <p className="text-red-500 text-sm">{errors.ToDate.message}</p>
              )}
            </div>
          </div>

          <ButtonComponent
            type="submit"
            content={isLoading ? "Submitting..." : "Submit"}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default LeaveRequest;
