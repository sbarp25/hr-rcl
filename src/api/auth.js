import axios from "axios";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "sonner";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { getIpAddress } from "../utils/getIpAddress";
import platform from "platform";
import { useNavigate } from "react-router-dom";

let globalVisitorId = null;

const initializeFingerprint = async () => {
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    globalVisitorId = result.visitorId;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error?.errorList?.[0]?.errorMessage ||
      error.response?.data?.error;
    toast.error(errorMessage);
    
};

// Initialize immediately
initializeFingerprint();

const getHeadersWithVisitorId = (additionalHeaders = {}) => {
  return {
    "Content-Type": "application/json",
    "X-Device-Name": `${platform.os.family}`,
    ...(globalVisitorId && { "X-Browser-Fingerprint": globalVisitorId }),
    ...additionalHeaders,
  };
};
/**Login screen */
export const loginUser = async (formData) => {
  const ipAddress = await getIpAddress();
  const LoginData = {
    data: {
      email: formData.email,
      password: formData.password,
      recaptchaToken: formData.recaptchaToken, // reCAPTCHA token from formData
      action: "login",
      deviceInfo: {
        ipAddress: ipAddress,
        browserFingerprint: globalVisitorId,
        userAgent: `${platform.ua}`,
        deviceName: `${platform.os.family}`,
      },
    },
  };

  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`,
    LoginData,
    {
      headers: getHeadersWithVisitorId(),
    }
  );

  // React Query expects you to throw errors for failed requests
  if (response.data?.responseCode === "200") {
    return response.data;
  } else {
    const errorMessage = response?.data?.error?.errorList?.[0]?.errorMessage;
    throw new Error(errorMessage || "Log In Failed");
  }
};

/**OTP verification */
export const OTPVerification = async (formData, sessionToken) => {
  const OTPData = {
    data: {
      sessionToken: sessionToken,
      otpCode: formData.MFAOTP,
    },
  };
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/mfa/verify`,
    OTPData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

/**Logout screen */
export const logoutUser = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    toast.error("Access Token not found");
  }
  const LogoutData = {
    data: {
      jwtToken: accessToken,
    },
  };
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/logout`,
    LogoutData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.data?.responseCode === "200") {
    localStorage.clear();
  } else {
    const errorMessage = response?.data?.error?.errorList?.[0]?.errorMessage;
    throw new Error(errorMessage || "Log In Failed");
  }
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

// Check-IN Late API
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

// fetch Late checkin's
export const fetchlateCheckin = async (currentPage, lateCheckInDataPerPage) => {
  const response = await axiosInstance.post(
    // "/api/v1/attendance/late-check-in/late-attendance/by-role",
    "/api/v1/attendance/late-check-in/late-attendance/list",
    { pageIndex: currentPage, pageSize: lateCheckInDataPerPage }
  );
  if (response?.data?.responseCode === "200") {
    return response.data;
  } else {
    toast.error(response?.data?.message);
  }
};
export const fetchTeamlateCheckin = async (
  currentPage,
  lateCheckInDataPerPage
) => {
  const response = await axiosInstance.post(
    "/api/v1/attendance/late-check-in/late-attendance/by-role",
    // "/api/v1/attendance/late-check-in/late-attendance/list",
    { pageIndex: currentPage, pageSize: lateCheckInDataPerPage }
  );
  if (response?.data?.responseCode === "200") {
    return response.data;
  } else {
    toast.error(response?.data?.message);
  }
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

/**Create Employees */
export const createEmployees = async (newEmployee) => {
  const response = await axiosInstance.post(
    "/api/v1/auth/register",
    newEmployee,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

/**Update Employees */
export const updateEmployees = async (updateEmployee) => {
  const response = await axiosInstance.post(
    "/api/v1/auth/update-user",
    updateEmployee,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};
/**Fetch Employees */
export const fetchEmployees = async (currentPage, employeeDataPerPage) => {
  const response = await axiosInstance.post("/api/v1/users/list", {
    pageIndex: currentPage,
    pageSize: employeeDataPerPage,
  });
  if (response?.data?.responseCode === "200") {
    return response.data;
  } else {
    toast.error(response?.data?.message);
    throw new Error(response?.data?.message || "Failed to fetch employees");
  }
};

/**Delete Employees */
export const deleteEmployees = async (deletingId) => {
  const response = await axiosInstance.delete(
    `/api/v1/auth/toggle/${deletingId}`
  );
  if (response?.data?.responseCode === "204") {
    return response.data;
  } else {
    toast.error(response?.data?.message);
  }
};

/**Fetch Department */
export const fetchDepartment = async (currentPage, departmentPerPage) => {
  const response = await axiosInstance.post("/api/v1/departments/list", {
    pageIndex: currentPage,
    pageSize: departmentPerPage,
  });
  if (response?.data?.responseCode === "200") {
    return response.data;
  } else {
    toast.error(response?.data?.message);
    throw new Error(response?.data?.message || "Failed to fetch Departments");
  }
};
/**Fetch unpaginated Department */
export const fetchUnPaginatedDepartment = async () => {
  const response = await axiosInstance.post("/api/v1/departments/get/all", {});
  if (response?.data?.responseCode === "200") {
    return response.data;
  } else {
    toast.error(response?.data?.message);
    throw new Error(response?.data?.message || "Failed to fetch Departments");
  }
};
/**Delete Department */
export const deleteDepartment = async (departmentId) => {
  const response = await axiosInstance.delete(
    `/api/v1/departments/delete/${departmentId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

/**Create Department */
export const createDepartment = async (AddDepartment) => {
  const response = await axiosInstance.post(
    "/api/v1/departments/register",
    AddDepartment,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

/**Fetch Team Lead */
export const fetchTeamLead = async () => {
  const response = await axiosInstance.get(
    "/api/v1/departments/get_all_users_name_id"
  );
  return response.data;
};

/**Fetch Indivisual Department Data */
export const fetchDepartmentId = async (longid) => {
  const response = await axiosInstance.post(
    `/api/v1/departments/get/${longid}`,
    {
      id: parseFloat(longid),
    }
  );
  return response?.data?.data;
};

/**EdIt Department */
export const EditDepartment = async (updatedDepartment, longid) => {
  const id = parseInt(longid);
  const response = await axiosInstance.put(
    `/api/v1/departments/update/${id}`,
    updatedDepartment,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response?.data;
};

/**Fetch unpaginated Position */
export const fetchUnPaginatedPosition = async () => {
  const response = await axiosInstance.post("/api/v1/positions/get/all", {});
  if (response?.data?.responseCode === "200") {
    return response.data;
  } else {
    toast.error(response?.data?.message);
    throw new Error(response?.data?.message || "Failed to fetch Position");
  }
};
/**Create Position*/
export const createPosition = async (newPosition) => {
  const response = await axiosInstance.post(
    "/api/v1/positions/save",
    newPosition,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response?.data;
};

/**Edit Position */
export const editPosition = async ({ updatePosition, id }) => {
  const response = await axiosInstance.put(
    `/api/v1/positions/update/${id}`,
    updatePosition,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response?.data;
};
/**Fetch Position */
export const fetchPosition = async (currentPage, positionPerPage) => {
  const response = await axiosInstance.post("/api/v1/positions/list", {
    pageIndex: currentPage,
    pageSize: positionPerPage,
  });
  if (response?.data?.responseCode === "200") {
    return response?.data;
  } else {
    toast.error(response?.data?.message);
    throw new Error(response?.data?.message || "Failed to fetch Position");
  }
};

/**Delete Position */
export const deletePosition = async (positionId) => {
  const response = await axiosInstance.delete(
    `api/v1/positions/delete/${positionId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response?.data;
};

/**Fetch Position By Id */
export const fetchPositionById = async (id) => {
  const response = await axiosInstance.get(`/api/v1/positions/get/${id}`);
  return response?.data;
};

/**Fetch Roles */
export const fetchrole = async (currentPage, rolesPerPage) => {
  const response = await axiosInstance.post("/api/v1/role/get/all", {
    pageIndex: currentPage,
    pageSize: rolesPerPage,
  });
  if (response?.data?.responseCode === "200") {
    return response?.data;
  } else {
    toast.error(response?.data?.message);
    throw new Error(response?.data?.message || "Failed to fetch Roles");
  }
};
/**Fetch unpaginated Roles */
export const fetchUnPaginatedRoles = async () => {
  const response = await axiosInstance.post("/api/v1/role/get/all", {});
  if (response?.data?.responseCode === "200") {
    return response.data;
  } else {
    toast.error(response?.data?.message);
    throw new Error(response?.data?.message || "Failed to fetch Roles");
  }
};
/**Delete Role */
export const deleteRole = async (roleId) => {
  const response = await axiosInstance.delete(`/api/v1/role/delete/${roleId}`);
  if (response.data.responseCode === "204") {
    return response?.data;
  } else {
    toast.error(response?.data?.message);
    throw new Error(response?.data?.message || "Failed to delete Role");
  }
};

/**Create Role */
export const createRole = async (newRole) => {
  const response = await axiosInstance.post("/api/v1/role/save", newRole, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response?.data;
};

/**Get Site Key */
export const getSiteKey = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/site-key`
    );

    if (response?.data?.responseCode === "200") {
      // Return the entire data object including both siteKey and enabled
      return {
        siteKey: response.data.data.siteKey,
        enabled: response.data.data.enabled,
      };
    } else {
      throw new Error(
        `Invalid response: ${response?.data?.responseCode || "Unknown error"}`
      );
    }
  } catch (error) {
       const errorMessage =
      error.response?.data?.error?.errorList?.[0]?.errorMessage ||
      error.response?.data?.error;
    toast.error(errorMessage);
    throw error;
  }
};

/**Verify Recapta */
export const verifyRecaptcha = async (request) => {
  const ipAddress = await getIpAddress();
  const params = new URLSearchParams(request);
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/verify-recaptcha`,
    params,
    {
      headers: {
        "X-Forwarded-For": ipAddress,
        "X-Real-IP": ipAddress,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data;
};

/**Fetch Trusted Devices */
export const fetchTrustedDevices = async () => {
  const response = await axiosInstance.get(`/api/v1/auth/trusted-devices`);
  if (response?.data?.responseCode === "200") {
    return response?.data;
  } else {
    toast.error(response?.data?.message);
    throw new Error(response?.data?.message || "Failed to fetch Roles");
  }
};

/**Delete All trusted Devices */
export const deleteDevice = async () => {
  const response = await axiosInstance.delete(
    `/api/v1/auth/trusted-devices/all`
  );
  return response.data;
};

/**Device One Trusted Device */
export const deleteOneDecice = async (deviceId) => {
  const response = await axiosInstance.delete(
    `/api/v1/auth/trusted-devices/${deviceId}`
  );
  return response.data;
};

/**Get Bank */
export const fetchBank = async () => {
  const response = await axiosInstance.get(`/api/v1/banking/getById`);
  if (response?.data?.responseCode === "200") {
    return response?.data;
  } else {
    throw new Error(response?.data?.message || "Failed to fetch Banks");
  }
};
/**Fetch Weekely Attendance Report */
export const fetchWeeklyAttendanceReport = async () => {
  const response = await axiosInstance.get(
    "/api/attendance/weekly_attendances"
  );
  if (response?.data?.responseCode === "200") {
    return response?.data;
  } else {
    throw new Error(
      response?.data?.message || "Failed to fetch Weekely attendance"
    );
  }
};

/**Fetch Approved Work from home */
export const fetchApprovedWorkFromHome = async () => {
  const response = await axiosInstance.get(
    `/api/work_from_home/approved_today_and_upcoming`
  );
  if (response?.data?.responseCode === "200") {
    return response?.data;
  } else {
    throw new Error(
      response?.data?.message || "Failed to fetch approved work from home"
    );
  }
};

/**Fetch Approved Leave */
export const fetchApprovedLeave = async () => {
  const response = await axiosInstance.get(
    `api/leave/approved_today_and_upcoming`
  );
  if (response?.data?.responseCode === "200") {
    return response?.data;
  } else {
    throw new Error(
      response?.data?.message || "Failed to fetch approved work from home"
    );
  }
};

/**Fetch EKYE */
export const fetchEkye = async (currentPage, ekyeDashboardDataPerPage) => {
  try {
    const response = await axiosInstance.post(
      "/api/v1/admin/completed_ekye_users",
      {
        pageIndex: currentPage,
        pageSize: ekyeDashboardDataPerPage,
      }
    );

    if (response?.data?.responseCode === "200") {
      return response.data;
    } else {
      toast.error(response?.data?.message || "Failed to fetch EKYE data");
      throw new Error(response?.data?.message || "Failed to fetch EKYE");
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error?.errorList?.[0]?.errorMessage ||
      "Something went wrong while fetching EKYE data";
    toast.error(errorMessage);
    throw error;
  }
};

/**fetch Employee Data */
export const fetchEmployeeDetails = async (rclId) => {
  const response = await axiosInstance.get(
    `/api/v1/admin/singleCompleteEkyeUser/rclId/${rclId}`
  );
  if (response?.data?.responseCode === "200") {
    return response?.data;
  } else {
    throw new Error(
      response?.data?.message || "Failed to fetch fetch employee details"
    );
  }
};

/**Fetch RCL-ID */
export const fetchrcl = async () => {
  const response = await axiosInstance.get("/api/v1/auth/ekye/details");
  if (response?.data?.responseCode === "200") {
    return response?.data;
  } else {
    throw new Error(response?.data?.message || "Failed to fetch RCL Id");
  }
};

export const forgetPasswordEmail = async (resetData) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/forget-password`,
    resetData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

/**Fetch Leave by role */
export const fetchleave = async (currentPage, leaveDataPerPage) => {
  const response = await axiosInstance.post(
    `/api/v1/leave_management/by-role`,
    {
      pageIndex: currentPage,
      pageSize: leaveDataPerPage,
    }
  );
  if (response?.data?.responseCode === "200") {
    return response;
  } else {
    toast.error(response?.data?.message);
    throw new Error(response?.data?.message || "Failed to fetch Roles");
  }
};

/**Fetch Leave list */
export const fetchListLeave = async (currentPage, leaveDataPerPage) => {
  const response = await axiosInstance.post(`/api/v1/leave_management/list`, {
    pageIndex: currentPage,
    pageSize: leaveDataPerPage,
  });
  if (response?.data?.responseCode === "200") {
    return response.data;
  } else {
    throw new Error(response?.data?.message || "Failed to fetch Roles");
  }
};

/**Apply Leave */
export const leaveRequest = async (applyleave) => {
  const response = await axiosInstance.post(
    "/api/leave/apply_leave",
    applyleave,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

/**Update Leave */
export const updateLeaveStatus = async (leaveData) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Authentication is missing.");
  }

  const response = await axiosInstance.put("/api/leave/status", leaveData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response?.data?.responseCode !== "200") {
    throw new Error(
      response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong"
    );
  }

  return response.data;
};

/**Leave by Id */
export const leaveById = async (id) => {
  const response = await axiosInstance.post("/api/leave/leaveId", {
    data: { rclId: id },
  });
  if (response?.data?.responseCode === "200") {
    return response.data;
  } else {
    throw new Error(response?.data?.message || "Failed to fetch Leave");
  }
};

/**Salary Calculation */
export const salaryCalculation = async () => {
  const response = await axiosInstance.get("/api/salary/calculate");
  if (response?.data?.responseCode === "200") {
    return response?.data?.data;
  }
};

/**fetch Personal Details */
export const getPersonalDetails = async () => {
  const authToken = localStorage.getItem("accessToken");

  if (!authToken) {
    throw new Error("Authentication is missing.");
  }

  try {
    const response = await axiosInstance.get("/api/v1/personal/getById");

    if (response?.data?.responseCode === "200") {
      return response.data;
    } else {
      throw new Error(
        response?.data?.message || "Failed to fetch personal details"
      );
    }
  } catch (error) {
        const errorMessage =
      error.response?.data?.error?.errorList?.[0]?.errorMessage ||
      error.response?.data?.error;
      throw new Error(errorMessage)

  }
};

/**Save Personal Details */
export const savePersonalDetails = async (formData) => {
  const response = await axiosInstance.post("/api/v1/personal/save", formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response?.data?.responseCode !== "201") {
    throw new Error(
      response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong"
    );
  }

  return response.data;
};

/**Get all provinces */
export const getProvinces = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/province/get/all");

    if (response.data.responseCode === "200") {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch provinces");
    }
  } catch (error) {
       const errorMessage =
      error.response?.data?.error?.errorList?.[0]?.errorMessage ||
      error.response?.data?.error;
      throw new Error(errorMessage)
  }
};

/**District on basis of province Id */
export const getDistrictsByProvince = async (provinceId) => {
  if (!provinceId) {
    throw new Error("Province ID is required");
  }

  try {
    const sanitizedProvinceId = String(provinceId).replace(/[^0-9]/g, "");
    const response = await axiosInstance.get(
      `/api/v1/district/districts/${sanitizedProvinceId}`
    );

    if (response.data.responseCode === "200") {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch districts");
    }
  } catch (error) {
      const errorMessage =
      error.response?.data?.error?.errorList?.[0]?.errorMessage ||
      error.response?.data?.error;
      throw new Error(errorMessage)
  }
};

/**Get Address Details */
export const getAddressDetails = async () => {
  const authToken = localStorage.getItem("accessToken");

  if (!authToken) {
    throw new Error("Authentication is missing.");
  }

  try {
    const response = await axiosInstance.get("/api/v1/address/getById", {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.data.responseCode === "200") {
      return response.data;
    } else {
      throw new Error(
        response.data.message || "Failed to fetch address details"
      );
    }
  } catch (error) {
      const errorMessage =
      error.response?.data?.error?.errorList?.[0]?.errorMessage ||
      error.response?.data?.error;
      throw new Error(errorMessage)
  }
};

/**Save Address Details */
export const saveAddressDetails = async (addressData) => {
  try {
    const response = await axiosInstance.post(
      "/api/v1/address/save",
      addressData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response?.data?.responseCode === "201") {
      return response.data;
    } else {
      throw new Error(
        response?.data?.error?.errorList?.[0]?.errorMessage ||
          response?.data?.message ||
          "Failed to save address details"
      );
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error?.errorList?.[0]?.errorMessage ||
      error.message ||
      "Something went wrong";
    throw new Error(errorMessage);
  }
};

/**Get Document Details */
export const getDocumentDetails = async () => {
  const authToken = localStorage.getItem("accessToken");

  if (!authToken) {
    throw new Error("Authentication is missing.");
  }

  try {
    const response = await axiosInstance.get("/api/v1/document/getById", {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.data.responseCode === "200") {
      return response.data;
    } else {
      throw new Error(
        response.data.message || "Failed to fetch document details"
      );
    }
  } catch (error) {
      const errorMessage =
      error.response?.data?.error?.errorList?.[0]?.errorMessage ||
      error.response?.data?.error;
      throw new Error(errorMessage)
  }
};

/**Save Document Details */
export const saveDocumentDetails = async (formDataToSubmit) => {
  const response = await axiosInstance.post(
    "/api/v1/document/save",
    formDataToSubmit,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (response.data.responseCode === "200") {
    return response.data;
  } else {
    const errorMessage =
      response?.data?.error?.errorList?.[0]?.errorMessage ||
      "Something went wrong";
    throw new Error(errorMessage);
  }
};

/**Get Education Details */
export const getEducationDetails = async () => {
  const authToken = localStorage.getItem("accessToken");

  if (!authToken) {
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await axiosInstance.get("/api/v1/education/getById", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.data.responseCode === "200") {
      return response.data;
    } else {
      throw new Error(
        response.data.message || "Failed to fetch education details"
      );
    }
  } catch (error) {
      const errorMessage =
      error.response?.data?.error?.errorList?.[0]?.errorMessage ||
      error.response?.data?.error;
      throw new Error(errorMessage)
  }
};

/**Save Education Details */
export const submitEducationDetails = async (formDataToSend) => {
  try {
    const response = await axiosInstance.post(
      "/api/v1/education/save",
      formDataToSend,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (response.data.responseCode === "201") {
      return response.data;
    } else {
      const errorMessage =
        response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong";
      throw new Error(errorMessage);
    }
  } catch (error) {;
    const errorMessage =
      error.response?.data?.error?.errorList?.[0]?.errorMessage ||
      "Something went wrong";
    throw new Error(errorMessage);
  }
};

/**Apply Filter */
export const applyFilters = async ({ url, requestBody }) => {
  const authToken = localStorage.getItem("accessToken");

  if (!authToken) {
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await axiosInstance.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.data.responseCode === "200") {
      return {
        data: response.data.datalist,
        totalPages: response.data.totalPages,
        totalRecords: response.data.totalRecords,
      };
    } else {
      throw new Error(
        response.data.error?.errorList?.[0]?.errorMessage ||
          "Failed to apply filters"
      );
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error?.errorList?.[0]?.errorMessage ||
      "Something went wrong";
    throw new Error(errorMessage);
  }
};

/** Reject Users */
export const rejectUser = async (rejectData) => {
  const accessToken = localStorage.getItem("accessToken");
  const response = await axiosInstance.post(
    "/api/v1/rejected/users",
    rejectData,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

/**UpComing Holiday */
export const UpComingHoliday = async () => {
  const response = await axiosInstance.get("api/v1/holiday/upComingHoliday");
  if (response?.data?.responseCode === "200") {
    return response?.data;
  } else {
    const errorMessage =
      response?.data?.error?.errorList?.[0]?.errorMessage ||
      "Something went Wrong";
    toast.error(errorMessage);
  }
};

/**Fetching MFA setting */
export const fetchMFAsetting = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/auth/mfa/settings");

    if (response?.data?.responseCode === "200") {
      return response?.data?.data;
    } else {
      throw new Error(
        response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Failed to fetch MFA settings"
      );
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error?.errorList?.[0]?.errorMessage ||
      "Something went wrong";
    throw new Error(errorMessage);
  }
};

/**Update the MFA setting */
export const updateMFASetting = async (payload) => {
  const response = await axiosInstance.put(
    "/api/v1/auth/mfa/settings/update",
    payload
  );

  if (response?.data?.responseCode !== "200") {
    throw new Error(response?.data?.message || "Failed to update MFA settings");
  }

  return response.data;
};

export const changeProfilePhoto = async (formData) => {
  const response = await axiosInstance.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/profilePicture/save`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response;
};
