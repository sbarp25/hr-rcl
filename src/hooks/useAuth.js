import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  autoCheckout,
  checkInAPI,
  checkOutAPI,
  createEmployees,
  deleteEmployees,
  deleteRole,
  fetchDepartment,
  fetchEmployees,
  fetchlateCheckin,
  fetchPosition,
  fetchrole,
  fetchUnPaginatedDepartment,
  fetchUnPaginatedPosition,
  fetchUnPaginatedRoles,
  getSiteKey,
  lateCheckInAPI,
  lateCheckInApprove,
  lateCheckInReject,
  loginUser,
  logoutUser,
  OTPVerification,
  resetPassword,
  updateEmployees,
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
      toast.success(data?.message || "User Logout Successfully.");
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
      toast.success("MFA verification successful!");
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

      // Debug logs to check the data structure
      console.log("Response data:", responseData);
      console.log("ekyeStatus:", responseData?.ekyeStatus);

      // Check response code and ekyeStatus for navigation
      if (data?.data?.responseCode === "200") {
        const ekyeStatus = responseData?.ekyeStatus;
        if (ekyeStatus === "NOT_REQUIRED" || ekyeStatus === "COMPLETED") {
          navigate("/dashboard");
        } else {
          navigate("/EKYE");
        }
      } else {
        console.log("Response code is not 200, it is:", data?.responseCode);
        toast.error("Something went wrong");
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
      toast.success(
        data?.data?.message || "Late check-in approved successfully"
      );
      // Invalidate and refetch late check-in data
      queryClient.invalidateQueries({ queryKey: ["FetchLateChekin"] });
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
      toast.success(
        data?.data?.message || "Late check-in rejected successfully"
      );
      // Invalidate and refetch late check-in data
      queryClient.invalidateQueries({ queryKey: ["FetchLateChekin"] });
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
      console.error("Employee fetch error:", error);
    },
  });
};
/**Delete Employees */
export const useEmployeeDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployees,
    onSuccess: (data) => {
      toast.success(data.message || "Employee deleted successfully");
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
      console.error("Error fetching Department", error);
    },
  });
};

/**Fetch unpaginated department */
export const useFetchUnPaginatedDepartment = () => {
  return useQuery({
    queryKey: ["fetchUnPaginatedDepartment"],
    queryFn: () => fetchUnPaginatedDepartment(),
    onError: (error) => {
      console.error("Error fetching Department");
    },
  });
};
/**Fetch unpaginated position */
export const useFetchUnPaginatedPosition = () => {
  return useQuery({
    queryKey: ["fetchUnpaginatedPosition"],
    queryFn: () => fetchUnPaginatedPosition(),
    onError: (error) => {
      console.error("Error fetching Position");
    },
  });
};
/**Fetch unpaginated Roles */
export const useFetchUnPaginatedRoles = () => {
  return useQuery({
    queryKey: ["fetchUnpaginatedRoles"],
    queryFn: () => fetchUnPaginatedRoles(),
    onError: (error) => {
      console.error("Error fetching Roles");
    },
  });
};

/**Fetch pagination Position */
export const useFetchPosition = (currentPage, positionPerPage) => {
  return useQuery({
    queryKey: ["FetchPaginatedPosition", currentPage, positionPerPage],
    queryFn: () => fetchPosition(currentPage, positionPerPage),
    onError: (error) => {
      console.error("Error fetching Position", error);
    },
  });
};

/**Fetch Roles */
export const useFetchRoles = (currentPage, rolesPerPage) => {
  return useQuery({
    queryKey: ["FetchRoles", currentPage, rolesPerPage],
    queryFn: () => fetchrole(currentPage, rolesPerPage),
    onError: (error) => {
      console.error("Error fetching Roles", error);
    },
  });
};

/**Use Role Delete */
export const useDeleteRoles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRole,
    onSuccess: (data) => {
      toast.success(data.message || "Employee deleted successfully");
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
          console.log("reCAPTCHA configuration loaded:", {
            siteKey: response.siteKey,
            enabled: response.enabled,
          });
        } else {
          throw new Error("Site key not found in response");
        }
      } catch (err) {
        console.error("Failed to fetch reCAPTCHA site key:", err);
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
