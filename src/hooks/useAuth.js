import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  applyFilters,
  autoCheckout,
  changeProfilePhoto,
  checkInAPI,
  checkOutAPI,
  createDepartment,
  createEmployees,
  createPosition,
  createRole,
  deleteDepartment,
  deleteDevice,
  deleteEmployees,
  deleteOneDecice,
  deletePosition,
  deleteRole,
  EditDepartment,
  editPosition,
  fetchApprovedLeave,
  fetchApprovedWorkFromHome,
  fetchBank,
  fetchDepartment,
  fetchDepartmentId,
  fetchEkye,
  fetchEmployeeDetails,
  fetchEmployees,
  fetchlateCheckin,
  fetchleave,
  fetchListLeave,
  fetchMFAsetting,
  fetchPosition,
  fetchPositionById,
  fetchrcl,
  fetchrole,
  fetchTeamlateCheckin,
  fetchTeamLead,
  fetchTrustedDevices,
  fetchUnPaginatedDepartment,
  fetchUnPaginatedPosition,
  fetchUnPaginatedRoles,
  fetchWeeklyAttendanceReport,
  forgetPasswordEmail,
  getAddressDetails,
  getDistrictsByProvince,
  getDocumentDetails,
  getEducationDetails,
  getPersonalDetails,
  getProvinces,
  getSiteKey,
  lateCheckInAPI,
  lateCheckInApprove,
  lateCheckInReject,
  leaveById,
  leaveRequest,
  loginUser,
  logoutUser,
  OTPVerification,
  rejectUser,
  resetPassword,
  salaryCalculation,
  saveAddressDetails,
  saveDocumentDetails,
  savePersonalDetails,
  submitEducationDetails,
  UpComingHoliday,
  updateEmployees,
  updateMFASetting,
} from "../api/auth";
import { toast } from "sonner";
import LocalStorageUtil from "../utils/LocalStorageUtil";
import { useState, useEffect } from "react";
/**Logout  */
export const useLogout = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      navigate("/login");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.message ||
        "Logout failed. Try again.";
      toast.error(errorMessage);
    },
  });
};
/**Login */
export const useLogin = ({ onOpen, setSessionToken }) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const accessToken = data?.data?.accessToken;
      const refreshToken = data?.data?.refreshToken;
      const FullName = data?.data?.fullName;
      const Email = data?.data?.email;
      const ekeyStep = data?.data?.ekeyStep;
      const Menu = data?.data?.menuActionsAndPermissions;
      const CheckinStatus = data?.data?.isCheckedInToday;
      const isCurrentlyStudying = data?.data?.isCurrentlyStudying;

      localStorage.setItem("isCurrentlyStudying", isCurrentlyStudying);
      localStorage.setItem("CheckinStatus", CheckinStatus);
      localStorage.setItem("ekeyStep", ekeyStep);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("fullName", FullName);
      localStorage.setItem("email", Email);
      LocalStorageUtil.setItem("menu", Menu);
      if (
        data?.data?.ekyeStatus === "NOT_REQUIRED" ||
        data?.data?.ekyeStatus === "COMPLETED"
      ) {
        navigate("/dashboard");
      } else {
        navigate("/EKYE");
      }
    },
    onError: (error) => {
      if (error.response?.data?.error?.errorCode === 422) {
        // Store session token from response for MFA
        const sessionToken = error.response?.data?.sessionToken || "";
        setSessionToken(sessionToken);
        onOpen(); // Open MFA modal
        return;
      }

      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.message ||
        "Login failed. Try again.";
      toast.error(errorMessage);
    },
  });
};

/**OTP verification */
export const useOTPVerification = ({ onOpenChange, sessionToken }) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (formData) => OTPVerification(formData, sessionToken),
    onSuccess: (data) => {
      onOpenChange(false);
      // Extract data from the nested response structure
      const responseData = data?.data?.data?.data;
      const accessToken = responseData?.accessToken;
      const refreshToken = responseData?.refreshToken;
      const fullName = responseData?.fullName;
      const email = responseData?.email;
      const ekeyStep = responseData?.ekeyStep;
      const menu = responseData?.menuActionsAndPermissions;
      const checkinStatus = responseData?.isCheckedInToday;
      const isCurrentlyStudying = responseData?.isCurrentlyStudying;

      // Store all values in localStorage (handle null/undefined values)
      localStorage.setItem("isCurrentlyStudying", isCurrentlyStudying ?? false);
      localStorage.setItem("CheckinStatus", checkinStatus ?? false);
      localStorage.setItem("ekeyStep", ekeyStep ?? "");
      localStorage.setItem("accessToken", accessToken ?? "");
      localStorage.setItem("refreshToken", refreshToken ?? "");
      localStorage.setItem("fullName", fullName ?? "");
      localStorage.setItem("email", email ?? "");
      LocalStorageUtil.setItem("menu", menu ?? []);

      // Check response code and ekyeStatus for navigation
      if (data?.data?.responseCode === "200") {
        const ekyeStatus = responseData?.ekyeStatus;
        if (ekyeStatus === "NOT_REQUIRED" || ekyeStatus === "COMPLETED") {
          navigate("/dashboard");
        } else {
          navigate("/EKYE");
        }
      } else {
        const errorMessage =
          data?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.message ||
        "MFA verification failed. Try again.";
      toast.error(errorMessage);
    },
  });
};
/**ForgetPassword */
export const useForgetPassword = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success(data.message);
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      localStorage.setItem("fullName", data.data.fullName);
      localStorage.setItem("email", data.data.email);
      LocalStorageUtil.setItem("menu", data.data.menuActionsAndPermissions);

      if (
        data.data.ekyeStatus === "NOT_REQUIRED" ||
        data.data.ekyeStatus === "COMPLETED"
      ) {
        navigate("/dashboard");
      } else {
        navigate("/EKYE");
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
      navigate("/login");
    },
    onSettled: () => {
      localStorage.removeItem("resetpasswordData");
    },
  });
};

/**CheckIn */
export const useCheckin = () => {
  return useMutation({
    mutationFn: checkInAPI,
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Check In Failed";
      toast.error(errorMessage);
    },
  });
};

/**Checkout */
export const useCheckOut = () => {
  return useMutation({
    mutationFn: checkOutAPI,
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.error?.errorList?.[0].errorMessage ||
        "Check out failed";
      toast.errror(errorMessage);
    },
  });
};

/**Latecheck in  */
export const useLateCheckin = () => {
  return useMutation({
    mutationFn: lateCheckInAPI,
    onError: () => {
      toast.error("Late Check In Failed");
    },
  });
};

/**fetch lateCheckIn */
export const useFetchLateCheckin = (currentPage, lateCheckInDataPerPage) => {
  return useQuery({
    queryKey: ["FetchLateChekin", currentPage, lateCheckInDataPerPage],
    queryFn: () => fetchlateCheckin(currentPage, lateCheckInDataPerPage),
    staleTime: 0,
    onError: (error) => {
      const errorMessage =
        error?.message || "Failed to fetch late check-in data";
      toast.error(errorMessage);
    },
  });
};
/**Fetch TeamLateCheckin */
export const useFetchTeamLateCheckin = (
  currentPage,
  lateCheckInDataPerPage
) => {
  return useQuery({
    queryKey: ["FetchTeamLeadLateChekin", currentPage, lateCheckInDataPerPage],
    queryFn: () => fetchTeamlateCheckin(currentPage, lateCheckInDataPerPage),
    staleTime: 0,
    onError: (error) => {
      const errorMessage =
        error?.message || "Failed to fetch late check-in data";
      toast.error(errorMessage);
    },
  });
};

/**Approve Late Chekin   */
export const useLateCheckInApprove = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: lateCheckInApprove,
    onSuccess: (data) => {
      if (data?.data?.responseCode === "200") {
        toast.success(
          data?.data?.message || "Late check-in approved successfully"
        );
      } else {
        const errorMessage =
          data?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";

        toast.error(errorMessage);
      }
      // Invalidate and refetch late check-in data
      queryClient.invalidateQueries({ queryKey: ["FetchTeamLeadLateChekin"] });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error ||
        "Failed to approve late check-in";
      toast.error(errorMessage);
    },
  });
};

/**Reject Late Checkin */
export const useLateCheckinReject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lateCheckInReject,
    onSuccess: (data) => {
      if (data?.data?.responseCode === "200") {
        toast.success(
          data?.data?.message || "Late check-in Rejected successfully"
        );
      } else {
        const errorMessage =
          data?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        console.log(errorMessage);
        toast.error(errorMessage);
      }
      // Invalidate and refetch late check-in data
      queryClient.invalidateQueries({ queryKey: ["FetchTeamLeadLateChekin"] });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error ||
        "Failed to reject late check-in";
      toast.error(errorMessage);
    },
  });
};

/**Auto Checkout */
export const useAutoCheckout = (
  currentPage,
  autoCheckOutDataPerPage,
  searchFilters,
  activeFilters
) => {
  return useQuery({
    queryKey: [
      "autoCheckout",
      currentPage,
      autoCheckOutDataPerPage,
      searchFilters,
      activeFilters,
    ],
    queryFn: async () => {
      if (searchFilters) {
        return searchFilters;
      }
      if (activeFilters) {
        return activeFilters;
      }
      return autoCheckout(currentPage, autoCheckOutDataPerPage);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to fetch auto checkout data");
    },
    keepPreviousData: true,
  });
};

/**Employee fetch */
export const useEmployeefetch = (currentPage, employeeDataPerPage) => {
  return useQuery({
    queryKey: ["employees", currentPage, employeeDataPerPage],
    queryFn: () => fetchEmployees(currentPage, employeeDataPerPage),
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error;
      toast.error(errorMessage);
    },
  });
};
/**Delete Employees */
export const useEmployeeDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployees,
    onSuccess: (data) => {
      if (data?.responseCode === "204") {
        toast.success(data?.data?.message || "Employee deleted successfully");
      } else {
        const errorMessage =
          data?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        console.log(errorMessage);
        toast.error(errorMessage);
      }

      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

/**Create Employees */
export const useEmployeeCreate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createEmployees,
    onSuccess: (response) => {
      if (response.data.responseCode === "200") {
        toast.success(
          response?.data?.message || "User registration was successful."
        );
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        navigate("/Employees");
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  });
};
/**Update Employee */
export const useEditEmployee = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: updateEmployees,
    onSuccess: (response) => {
      if (response?.data?.responseCode === "200") {
        toast.success(
          response?.data?.message || "Employee has been updated successfully."
        );
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        navigate("/Employees");
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  });
};

/**Fetch Paginated Department */
export const useFetchDepartment = (currentPage, departmentPerPage) => {
  return useQuery({
    queryKey: ["fetchDepartment", currentPage, departmentPerPage],
    queryFn: () => fetchDepartment(currentPage, departmentPerPage),
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error;
      toast.error(errorMessage);
    },
  });
};
/**Delete Department */
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: (data) => {
      if (data.responseCode === "204") {
        toast.success(data.message || "Department deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["fetchDepartment"] });
      } else {
        toast.error(data.message || "Failed to delete department");
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.message ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  });
};

/**Create Department */
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createDepartment,
    onSuccess: (response) => {
      if (response?.responseCode == "201") {
        toast.success(response?.message || "Department Created Successfully");
        queryClient.invalidateQueries({ queryKey: ["fetchDepartment"] });
        navigate("/master-data/Department");
      } else {
        const errorMessage =
          response?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  });
};

/**Fetch Team Lead */
export const useFetchTeamLead = () => {
  return useQuery({
    queryKey: ["FetchTeamLead"],
    queryFn: fetchTeamLead,
  });
};

/**Fetch Indivisual Department */
export const useIndivisualDepartment = (longid) => {
  return useQuery({
    queryKey: ["FetchIndivisualDepartment", longid],
    queryFn: () => fetchDepartmentId(longid),
  });
};

/**Edit Department */
export const useEditDepartment = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ updatedDepartment, longid }) =>
      EditDepartment(updatedDepartment, longid),
    onSuccess: (response) => {
      if (response?.responseCode === "200") {
        toast.success(
          response?.message || "Department has been updated successfully."
        );
        queryClient.invalidateQueries({ queryKey: ["fetchDepartment"] });
        navigate("/master-data/Department"); // Fixed navigation path
      } else {
        const errorMessage =
          response?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  });
};

/**Fetch unpaginated department */
export const useFetchUnPaginatedDepartment = () => {
  return useQuery({
    queryKey: ["fetchUnPaginatedDepartment"],
    queryFn: () => fetchUnPaginatedDepartment(),
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error;
      toast.error(errorMessage);
    },
  });
};

/**Create Position */
export const useCreatePosition = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createPosition,
    onSuccess: (response) => {
      if (response?.responseCode === "201") {
        toast.success(
          response?.data?.message || "Position Created Successfully"
        );
        queryClient.invalidateQueries({ queryKey: ["FetchPaginatedPosition"] });
        navigate("/master-data/Position");
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  });
};

/**Fetch Position By Id */
export const usePositionById = (id) => {
  return useQuery({
    queryKey: ["FetchPositionById", id],
    queryFn: () => fetchPositionById(id),
  });
};

/**Edit Position */
export const useEditPosition = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ updatePosition, id }) =>
      editPosition({ updatePosition, id }),
    onSuccess: (response) => {
      if (response?.responseCode === "200") {
        toast.success(
          response?.message || "Position has been updated successfully."
        );
        queryClient.invalidateQueries({ queryKey: ["FetchPaginatedPosition"] });
        navigate("/master-data/Position"); // Fixed navigation path
      } else {
        const errorMessage =
          response?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  });
};

/**Delete Position */
export const useDeletePosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePosition,
    onSuccess: (data) => {
      if (data?.responseCode === "204") {
        toast.success(data.message || "Department deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["FetchPaginatedPosition"] });
      } else {
        const errorMessage =
          data?.error?.errorList?.[0]?.errorMessage || "Something went wrong";
        toast.error(errorMessage);
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.message ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  });
};

/**Fetch unpaginated position */
export const useFetchUnPaginatedPosition = () => {
  return useQuery({
    queryKey: ["fetchUnpaginatedPosition"],
    queryFn: () => fetchUnPaginatedPosition(),
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error;
      toast.error(errorMessage);
    },
  });
};

/**Fetch pagination Position */
export const useFetchPosition = (currentPage, positionPerPage) => {
  return useQuery({
    queryKey: ["FetchPaginatedPosition", currentPage, positionPerPage],
    queryFn: () => fetchPosition(currentPage, positionPerPage),
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error;
      toast.error(errorMessage);
    },
  });
};

/**Fetch Roles */
export const useFetchRoles = (currentPage, rolesPerPage) => {
  return useQuery({
    queryKey: ["FetchRoles", currentPage, rolesPerPage],
    queryFn: () => fetchrole(currentPage, rolesPerPage),
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error;
      toast.error(errorMessage);
    },
  });
};

/**Create Roles */
export const useCreateRoles = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createRole,
    onSuccess: (response) => {
      if (response?.responseCode === "201") {
        toast.success(response?.message || "Roles Created Successfully");
        queryClient.invalidateQueries({ queryKey: ["FetchRoles"] });
        navigate("/master-data/Roles");
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  });
};

/**Fetch unpaginated Roles */
export const useFetchUnPaginatedRoles = () => {
  return useQuery({
    queryKey: ["fetchUnpaginatedRoles"],
    queryFn: () => fetchUnPaginatedRoles(),
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error;
      toast.error(errorMessage);
    },
  });
};
/**Use Role Delete */
export const useDeleteRoles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRole,
    onSuccess: (data) => {
      if (data?.responseCode === "204") {
        toast.success(data.message || "Employee deleted successfully");
      } else {
        const errorMessage =
          data?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        console.log(errorMessage);
        toast.error(errorMessage);
      }
      queryClient.invalidateQueries({ queryKey: ["FetchRoles"] });
    },
  });
};

export const useRecaptcha = () => {
  const [siteKey, setSiteKey] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSiteKey = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getSiteKey();

        // getSiteKey should return the full response data, not just the site key
        if (response && response.siteKey) {
          setSiteKey(response.siteKey);
          setEnabled(response.enabled);
        } else {
          throw new Error("Site key not found in response");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error?.errorList?.[0]?.errorMessage ||
          error.response?.data?.error;
        toast.error(errorMessage);
        setError("Failed to load reCAPTCHA configuration");
        setSiteKey("");
        setEnabled(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteKey();
  }, []);

  return { siteKey, enabled, loading, error };
};

/*Fetch Trusted Devices*/
export const useFetchTrustedDevices = () => {
  return useQuery({
    queryKey: ["FetchTrustedDevices"],
    queryFn: () => fetchTrustedDevices(),
    onError: (error) => {
      toast.error("Error Fetching Trusted Devices", error);
    },
  });
};

/**Delete All Trusted Devices */
export const useDeleteAllDevices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDevice,
    onSuccess: (data) => {
      toast.success(data?.message || "Devices deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["FetchTrustedDevices"] });
    },
  });
};

/**Delete One Trusted Devices */
export const useDeleteOneDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOneDecice,
    onSuccess: (data) => {
      toast.success(data?.message || "Device deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["FetchTrustedDevices"] });
    },
  });
};

/**Fetch Banks */
export const useFetchBank = () => {
  return useQuery({
    queryKey: ["FetchBank"],
    queryFn: () => fetchBank(),
    onError: (error) => {
      toast.error("Error fetching Banks", error);
    },
  });
};
/**Fetch Weekely Report */
export const useWeeklyAttendanceReport = () => {
  return useQuery({
    queryKey: ["FetchWeekelyAttendacneReport"],
    queryFn: () => fetchWeeklyAttendanceReport(),
    onError: (error) => {
      toast.error("Error fetching Weekely Attendance Report", error);
    },
  });
};

/**Fetch Approved Work From Home */
export const useApprovedWorkFromHome = () => {
  return useQuery({
    queryKey: ["FetchApprovedWorkFromHome"],
    queryFn: () => fetchApprovedWorkFromHome(),
    onError: (error) => {
      toast.error("Error fetching approved work from home", error);
    },
  });
};
/**Fetch Approved Leave */
export const useApprovedLeave = () => {
  return useQuery({
    queryKey: ["FetchApprovedLeave"],
    queryFn: () => fetchApprovedLeave(),
    onError: (error) => {
      toast.error("Error fetching approved leave", error);
    },
  });
};

/**Fetch EKYE */
export const useFetchEKYE = (currentPage, ekyeDashboardDataPerPage) => {
  return useQuery({
    queryKey: ["fetchEKYE", currentPage, ekyeDashboardDataPerPage],
    queryFn: () => fetchEkye(currentPage, ekyeDashboardDataPerPage),
    enabled: !!(currentPage && ekyeDashboardDataPerPage),
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error;
      toast.error(errorMessage);
    },
  });
};

/**Fetch Employee details  */
export const useEmployeeDetails = (rclId) => {
  return useQuery({
    queryKey: ["fetchEmployeeDetails", rclId],
    queryFn: () => fetchEmployeeDetails(rclId),
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error;
      toast.error(errorMessage);
    },
  });
};

/**Fetch Employee RCL ID */
export const useEmployeeRCL = () => {
  return useQuery({
    queryKey: ["fetchRCL"],
    queryFn: () => fetchrcl(),
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error;
      toast.error(errorMessage);
    },
  });
};

/**Forget Password email send */
export const useForgetPasswordEmail = () => {
  return useMutation({
    mutationFn: forgetPasswordEmail,
    onSuccess: (response) => {
      if (response?.data?.responseCode === "200") {
        toast.success(
          response?.data?.message || "Reset Link has been sent successfully"
        );
        // navigate("/");
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  });
};

/**Fetch Leave by role */
export const useLeaveByRole = (currentPage, leaveDataPerPage) => {
  return useQuery({
    queryKey: ["FetchLeaveByRole", currentPage, leaveDataPerPage],
    queryFn: () => fetchleave(currentPage, leaveDataPerPage),
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error;
      toast.error(errorMessage);
    },
  });
};

export const useLeaveByList = (currentPage, leaveDataPerPage) => {
  return useQuery({
    queryKey: ["leaveList", currentPage, leaveDataPerPage],
    queryFn: () => fetchListLeave(currentPage, leaveDataPerPage),
    enabled: !!(currentPage && leaveDataPerPage),
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error;
      toast.error(errorMessage);
    },
  });
};

/**Apply Leave */
export const useLeaveRequest = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: leaveRequest,
    onSuccess: (response) => {
      if (response?.data?.responseCode === "200") {
        toast.success(
          response?.data?.message || "Leave Requested Successfully"
        );
        navigate("/Leave/Request");
        // queryClient.invalidateQueries({ queryKey: ["employees"] });
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.response?.data?.error ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  });
};

/**Leave By Id */
export const useLeaveById = (id) => {
  return useQuery({
    queryKey: ["LeaveUser", id],
    queryFn: () => leaveById(id),
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong. Try again.";
      toast.error(errorMessage);
    },
  });
};

/**Salary Details */
export const useSalary = () => {
  return useQuery({
    querKey: ["SalaryDetails"],
    queryFn: () => salaryCalculation,
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong. Try again.";
      toast.error(errorMessage);
    },
  });
};

/**Get Personal Details */
export const usePersonalDetails = () => {
  return useQuery({
    queryKey: ["PersonalDetails"],
    queryFn: () => getPersonalDetails(),
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.message ||
        "Something went wrong. Try again.";
      toast.error(errorMessage);
    },
    // Add these options for debugging
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**Save Personal Details */
export const useSavePersonalDetails = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => savePersonalDetails(formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["PersonalDetails"],
      });
      toast.success(data?.message || "Personal details saved successfully");
      onSuccess?.();
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong. Try again.";
      toast.error(errorMessage);
    },
  });
};

/**Fetch Province*/
export const useProvinces = () => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: getProvinces,
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.message ||
        "Something went wrong. Try again.";
      toast.error(errorMessage);
    },
    retry: 1,
  });
};

/**Fetch District*/
export const useDistrictsByProvince = (provinceId) => {
  return useQuery({
    queryKey: ["districts", provinceId],
    queryFn: () => getDistrictsByProvince(provinceId),
    enabled: !!provinceId, // Only run query when provinceId is available
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.message ||
        "Something went wrong. Try again.";
      toast.error(errorMessage);
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**Get Address Details */
export const useAddressDetails = () => {
  return useQuery({
    queryKey: ["addressDetails"],
    queryFn: getAddressDetails,
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.message ||
        "Something went wrong. Try again.";
      toast.error(errorMessage);
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**Save Address Details */
export const useSaveAddressDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveAddressDetails,
    onSuccess: (data) => {
      toast.success(data.message || "Address details saved successfully");
      // Invalidate and refetch address details
      queryClient.invalidateQueries({ queryKey: ["addressDetails"] });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.message ||
        "Something went wrong. Try again.";
      toast.error(errorMessage);
    },
  });
};

/**Get Documents Details */
export const useDocumentDetails = () => {
  return useQuery({
    queryKey: ["documentDetails"],
    queryFn: getDocumentDetails,
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.message ||
        "Something went wrong. Try again.";
      toast.error(errorMessage);
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**Save Document Details */
export const useSaveDocumentDetails = () => {
  return useMutation({
    mutationFn: saveDocumentDetails,
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  });
};

/**Get Education Details */
export const useEducationDetails = () => {
  return useQuery({
    queryKey: ["educationDetails"],
    queryFn: getEducationDetails,
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.message ||
        "Something went wrong. Try again.";
      toast.error(errorMessage);
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**Save education details */
export const useSubmitEducationDetails = (onSuccess) => {
  return useMutation({
    mutationFn: submitEducationDetails,
    onSuccess: (data) => {
      toast.success(data.message);
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useApplyFilters = (onSuccess) => {
  return useMutation({
    mutationFn: applyFilters,
    onSuccess: (data) => {
      toast.success("Filters applied successfully");
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useRejectUser = (onSuccess) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectUser,
    onSuccess: (data) => {
      if (data?.responseCode === "201") {
        toast.success(data?.message);

        // Invalidate relevant queries to refetch data
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        queryClient.invalidateQueries({ queryKey: ["adminEkye"] });

        // Navigate to admin page
        navigate("/AdminEkye");

        if (onSuccess) {
          onSuccess(data);
        }
      } else {
        const errorMessage =
          data?.error?.errorList?.[0]?.errorMessage || "Something went wrong";
        toast.error(errorMessage);
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  });
};

export const useFetchUpComingHoliday = () => {
  return useQuery({
    queryKey: ["fetchUpComingHoliday"],
    queryFn: () => UpComingHoliday,
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  });
};

export const useFetchingMFASetting = () => {
  return useQuery({
    queryKey: ["fetchMFASetting"],
    queryFn: fetchMFAsetting,
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  });
};

export const useSaveMFAsetting = () => {
  return useMutation({
    mutationFn: updateMFASetting,
    onSuccess: (data) => {
      toast.success(data.message || "MFA settings updated successfully");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  });
};

export const useChangeProfilePhoto = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: changeProfilePhoto,
    onSuccess: (data) => {
      toast.success(data.data.message || "MFA settings updated successfully");
      navigate(0);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  });
};
