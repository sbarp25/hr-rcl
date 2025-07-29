import { useForm } from "react-hook-form";

import InputComponent from "../../../components/ui/InputComponent.jsx";
import DatepickerComponent, {
  formatDate,
} from "../../../components/ui/DatepickerComponent.jsx";
import { useEffect, useState } from "react";
import TextAreaComp from "../../../components/ui/TextAreaComp.jsx";
import ButtonComponent from "../../../components/ui/ButtonComp.jsx";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getIpAddress } from "../../../utils/getIpAddress";
import GoBack from "../../../components/GoBack";
import LocalStorageUtil from "../../../utils/LocalStorageUtil.js";
import { hasCreateAccess, MENU_NAMES } from "../../../utils/permissionUtils.js";

const RequestWorkFromHome = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, watch, reset } = useForm();

  const fromDate = watch("fromDate");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const ipAddress = await getIpAddress();
    setIsLoading(true);

    const today = new Date();
    const applyWorkFromHome = {
      data: {
        title: data?.title,
        reason: data?.description,
        approvalStatus: "PENDING",
        workFromHomeStartDate: formatDate(data.fromDate),
        workFromHomeEndDate: formatDate(data.ToDate),
        requestDate: formatDate(today),
        requestIp: ipAddress,
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
        "/api/work_from_home/apply_work_from_home",
        applyWorkFromHome,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response?.data?.responseCode === "200") {
        reset();
        navigate("/WFH/Status");
        toast.success(response?.data?.message);
      } else {
        const errorMessage = response?.data?.error || "Something went wrong";
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const hasaccess = hasCreateAccess(MENU_NAMES.WFHREQUEST);

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
          <span className="hidden sm:inline">Work From Home Request</span>
          <span className="sm:hidden">WFH Request</span>
        </h1>
        <div className="w-8"></div>
      </div>

      <div className="bg-white dark:bg-black p-2 sm:p-4 rounded-xl max-h-[90vh] overflow-y-auto border border-gray-300 shadow-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-8 p-2 sm:p-4 ">
          {/* Work from Home Title */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From Date */}
            <div>
              <DatepickerComponent
                name="fromDate"
                label="From Date(A.D)"
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
                label="To Date(A.D)"
                size="sm"
                className="w-full"
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

          {/* Reason for WFH */}
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
              className="bg-black text-white w-full sm:w-auto"
              content={isLoading ? "Submitting..." : "Submit"}
              //   disabled={isLoading}
              size="sm"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestWorkFromHome;
