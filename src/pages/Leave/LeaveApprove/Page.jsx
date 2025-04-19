import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../lib/axios-Instance";
import {
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import ButtonComponent from "../../../components/ButtonComp";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import GoBack from "../../../components/GoBack";

const LeaveApprove = ({ leaveId }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [leaveByIdData, setLeaveByIdData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      leaveStatus: "PENDING",
      remarks: "",
    },
  });

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Leave", href: "" },
    { label: "Leave Status", href: "/Leave/apprej" },
  ];

  /**To approve or Reject the leave  */
  const onUpdate = async (data) => {
    setIsLoading(true);

    const updateLeave = {
      data: {
        leaveId: leaveByIdData?.leaveId,
        leaveStatus: data.leaveStatus,
        remark: data.remarks,
      },
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Authentication is missing.");
        return;
      }

      const response = await axiosInstance.put(
        "/api/leave/status",
        updateLeave,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response?.data?.responseCode === "200") {
        toast.success(response?.data?.message);
        navigate("/Leave/Status");
        reset();
      } else {
        toast.error(response?.data?.error || "Something went wrong");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**To get the leave data and to get the  */
  useEffect(() => {
    const fetchLeaveById = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/api/leave/leaveId", {
          data: {
            rclId: id,
          },
        });
        if (response.data.responseCode === "200") {
          setLeaveByIdData(response.data.datalist[0]);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching Leave:", error);
        toast.error("Error fetching Leave.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveById();
  }, []);

  const leaveStatus = [
    { key: "PENDING", label: "Pending" },
    { key: "APPROVED", label: "Approved" },
    { key: "REJECTED", label: "Rejected" },
  ];
  /**TO delete the active Leave */
  const onDelete = async (data) => {
    setIsLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Authentication is missing");
        return;
      }
      const response = await axiosInstance.delete("/api/leave/delete/leaveId", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.responseCode === "200") {
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.error || "Something Went Wrong");
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
    <div className="space-y-4">
      <BreadcrumbsComponent items={breadcrumbItems} />
      <div className="bg-white rounded-xl p-4 space-y-4">
        <div className="">
          {/* <GoBack /> */}
          <h1 className="page-title">Leave Approve</h1>
        </div>
        <div className="">
          <Table aria-label="Details of Leave">
            <TableHeader>
              <TableColumn>LeaveId</TableColumn>
              {/* <TableColumn>Employee Name</TableColumn> */}
              <TableColumn>Leave Type</TableColumn>
              <TableColumn>Leave Start Date</TableColumn>
              <TableColumn>Leave End Date</TableColumn>
              <TableColumn>Leave Duration</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow key="1">
                <TableCell>{leaveByIdData?.leaveId || "N/A"}</TableCell>
                {/* <TableCell>{leaveByIdData?.employeeName || "N/A"}</TableCell> */}
                <TableCell>{leaveByIdData?.leaveType || "N/A"}</TableCell>
                <TableCell>{leaveByIdData?.startDate || "N/A"}</TableCell>
                <TableCell>{leaveByIdData?.endDate || "N/A"}</TableCell>
                <TableCell>{leaveByIdData?.leaveDuration || "N/A"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
          {/* Leave Status Selection */}
          <div>
            <Controller
              name="leaveStatus"
              control={control}
              rules={{ required: "Status of the leave is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  variant="bordered"
                  label="Leave Status"
                  className={`rounded-xl ${
                    errors.leaveStatus ? "border-2 border-red-500" : ""
                  }`}
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) =>
                    field.onChange(Array.from(keys)[0])
                  }>
                  {leaveStatus.map((leave) => (
                    <SelectItem key={leave.key} textValue={leave.label}>
                      {leave.label}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
            {errors.leaveStatus && (
              <p className="text-red-500 text-sm">
                {errors.leaveStatus.message}
              </p>
            )}
          </div>

          {/* Remarks Field */}

          <div>
            <Textarea
              placeholder="Comment:"
              minRows={5}
              maxRows={10}
              isInvalid={!!errors.remarks}
              className={`rounded-xl`}
              variant="bordered"
              {...register("remarks", {
                required: "Reject reason is required",
                maxLength: {
                  value: 1000,
                  message: "Reason cannot exceed 1000 characters",
                },
              })}
            />
            {errors.remarks && (
              <p className="text-red-500 text-sm">{errors.remarks.message}</p>
            )}
          </div>
          {/* Submit Button */}
          <div className="flex justify-between">
            <ButtonComponent
              type="submit"
              content={
                <div className="flex items-center justify-center gap-2">
                  {isLoading ? "Updating..." : "Update"}
                </div>
              }
              isLoading={isLoading}
            />
            <ButtonComponent
              //   type="submit"
              onPress={onDelete}
              className={"bg-red-600 text-white"}
              //   color="danger"
              content={
                <div className="flex items-center justify-center gap-2">
                  {isLoading ? "Deleting..." : "Delete"}
                </div>
              }
              isLoading={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveApprove;
