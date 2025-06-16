import axios from "axios";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "sonner";
import LocalStorageUtil from "../utils/LocalStorageUtil";
import { getIpAddress } from "../utils/getIpAddress";

/**Login screen */
export const loginUser = async (formData) => {
  const LoginData = {
    data: {
      email: formData.email,
      password: formData.password,
    },
  };

  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`,
    LoginData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // React Query expects you to throw errors for failed requests
  if (response.data?.responseCode !== "200") {
    const errorMessage = response?.data?.error?.errorList?.[0]?.errorMessage;
    throw new Error(errorMessage || "Log In Failed");
  }

  return response.data;
};

//Forget Password
export const resetPassword = async ({ newPassword }) => {
  let encryptedData = localStorage.getItem("resetpasswordData");

  if (encryptedData) {
    encryptedData = encryptedData.replace(/\s/g, "");
  }
  if (!encryptedData) {
    throw new Error("No reset password data found");
  }

  const newData = {
    data: {
      encryptedData,
      newPassword,
    },
  };
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/forget-password-set-new`,
    newData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

//Checkin API
export const checkInAPI = async (requestData) => {
  const response = await axiosInstance.post(
    "/api/attendance/check_in",
    requestData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

//CbeckOut API
export const checkOutAPI = async (requestData) => {
  const response = await axiosInstance.post(
    "/api/attendance/check_out",
    requestData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

//Late Check-IN API
export const lateCheckInAPI = async (requestData) => {
  const response = await axiosInstance.post(
    "/api/attendance/late_check_in",
    requestData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

//Late Check-In Approve
export const lateCheckInApprove = async (updateLeave) => {
  const response = await axiosInstance.post(
    "/api/attendance/review_late_check_in",
    updateLeave,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};
/**Late Check-in Reject  */
export const lateCheckInReject = async (RejectLeave) => {
  const response = await axiosInstance.post(
    "/api/attendance/review_late_check_in",
    RejectLeave,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

/**Auto Check-Out */
export const autoCheckout = async (currentPage, autoCheckOutDataPerPage) => {
  const response = await axiosInstance.post("/api/auto-checkout/records", {
    pageIndex: currentPage,
    pageSize: autoCheckOutDataPerPage,
  });
  if (response?.data?.responseCode === "200") {
    return response.data;
  } else {
    toast.error(response?.data?.message);
  }
};

/** */
