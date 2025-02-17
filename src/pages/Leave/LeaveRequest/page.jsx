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
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

const LeaveRequest = () => {
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
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

  let formatter = useDateFormatter({ dateStyle: "full" });
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

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formatDate = (date) =>
      date ? date.toDate(getLocalTimeZone()).toISOString().split("T")[0] : null;
    const applyleave = {
      data: {
        leaveType: data.leaveType,
        leaveSubject: data.description,
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
    <div className="container flex flex-col space-y-4 ">
      <BreadcrumbsComponent items={breadcrumbItems} />
      <div className="page-title -pl-2">Leave Request</div>
      <div className="bg-white p-4 rounded-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 p-4">
          {/** Leave Title */}
          <div>
            <InputComponent
              name="title"
              control={control}
              variant="bordered"
              label="Title"
              rules={{
                required: "Title is required",
                pattern: {
                  value: /^[a-zA-Z0-9_ ]{3,300}$/,
                  message: "Enter a valid title",
                },
              }}
            />
          </div>

          {/** Reason for Leave */}
          <div>
            <Textarea
              label="Description"
              {...register("description", {
                required: "Description is required",
                pattern: {
                  value: /^[a-zA-Z0-9_ ]{3,300}$/,
                  message: "Description must be 3-300 characters long",
                },
              })}
              variant="bordered"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-12">
            {/** Leave Type */}
            <div className="mb-4">
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
            </div>

            {/** Team Leader */}
            <div className="mb-4">
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
            </div>

            {/** From Date */}
            <div>
              <Controller
                name="fromDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    showMonthAndYearPickers
                    label="From Date"
                    value={field.value}
                    onChange={field.onChange}
                    variant="bordered"
                  />
                )}
              />
            </div>

            {/** To Date */}
            <div>
              <Controller
                name="ToDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    showMonthAndYearPickers
                    label="To Date"
                    value={field.value}
                    onChange={field.onChange}
                    variant="bordered"
                  />
                )}
              />
            </div>

            {/** Half Day Checkbox */}
            <div>
              <Controller
                name="isHalfDay"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    isSelected={field.value}
                    onValueChange={field.onChange}>
                    Is Half Day
                  </Checkbox>
                )}
              />
            </div>
          </div>

          {/** Submit Button */}
          <ButtonComponent
            type="submit"
            content={isLoading ? "Submitting..." : "Submit"}
            className="bg-bgprimary text-white"
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default LeaveRequest;
