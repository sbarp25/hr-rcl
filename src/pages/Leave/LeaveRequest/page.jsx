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
  const [teamLead, setTeamLead] = useState([]);
  const [associateTeamLead, setAssociateTeamLead] = useState([]);
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

  {
    /**To fetch Team lead */
  }
  const fetchTeamLead = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/v1/departments/team-leads"
      );
      if (response.data.responseCode === "200") {
        setTeamLead(response.data.datalist);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  /**To fetch Accociate Team lead */
  const fetchassociateTeamLead = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/v1/departments/associate-team-leads"
      );
      if (response.data.responseCode === "200") {
        setAssociateTeamLead(response.data.datalist);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fromDate = watch("fromDate");

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
        leaveStatus: "PENDING",
        isHalfDay: data.isHalfDay,
        leaveStartDate: formatDate(data.fromDate),
        leaveEndDate: formatDate(data.ToDate),
        leaveDate: formatDate(data.fromDate),
        teamLeaderName: data?.teamlead,
        associateTeamLeadName: data?.associateteamlead,

        // teamLeaderName: parseFloat(data?.teamlead),
        // associateTeamLeadName: parseFloat(data?.associateteamlead),
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
  useEffect(() => {
    fetchassociateTeamLead();
    fetchTeamLead();
  }, []);
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
  const teamLeadid = teamLead.map((item) => ({
    key: item.id, // Using id as the key
    label: item.fullName, // Using fullName as the display label
  }));
  const associateteamLeadid = associateTeamLead.map((item) => ({
    key: item.id, // Using id as the key
    label: item.fullName, // Using fullName as the display label
  }));
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
              })}
              variant="bordered"
            />
            {errors.description && (
              <p className="text-danger text-sm">
                {errors.description.message}
              </p>
            )}
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

            {/* Team Leader */}
            <div>
              <SelectComp
                name="teamlead"
                label="Team Lead"
                control={control}
                rules={{ required: "Team Lead is required" }}
                data={teamLeadid}
                valueKey="label"
                labelKey="label"
              />
            </div>
            {/**Assiciate Team Lead */}
            {/* <div>
              <SelectComp
                name="associateteamlead"
                label="Associate Team Lead"
                control={control}
                // rules={{ required: "Team Lead is required" }}
                data={associateteamLeadid}
                valueKey="label"
                labelKey="label"
              />
            </div> */}

            {/* From Date */}
            <div>
              <Controller
                name="fromDate"
                control={control}
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    isInvalid={!!errors.fromDate}
                    className={`rounded-xl `}
                    label="From Date"
                    variant="bordered"
                  />
                )}
              />
              {errors.fromDate && (
                <p className="text-danger text-sm">{errors.fromDate.message}</p>
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
                  <DatePicker
                    {...field}
                    isInvalid={!!errors.ToDate}
                    className={`rounded-xl `}
                    label="To Date"
                    variant="bordered"
                  />
                )}
              />
              {errors.ToDate && (
                <p className="text-red-500 text-sm">{errors.ToDate.message}</p>
              )}
            </div>
          </div>
          <div>
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
