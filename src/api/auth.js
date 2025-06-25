import axios from "axios";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "sonner";
import LocalStorageUtil from "../utils/LocalStorageUtil";
import { getIpAddress } from "../utils/getIpAddress";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate;
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
  if (response.data?.responseCode === "200") {
    return response.data;
  } else {
    const errorMessage = response?.data?.error?.errorList?.[0]?.errorMessage;
    throw new Error(errorMessage || "Log In Failed");
  }
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
    "/api/v1/attendance/late-check-in/role-based-reviews",
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

export const deleteRole = async (roleId) => {
  const response = await axiosInstance.delete(`/api/v1/role/delete/${roleId}`);
  if (response.data.responseCode === "204") {
    return response?.data;
  } else {
    toast.error(response?.data?.message);
    throw new Error(response?.data?.message || "Failed to delete Role");
  }
};

// // API function to fetch menus and actions
// export const fetchMenusAndActions = async () => {
//   const response = await axiosInstance.post(
//     "/api/v1/master/menus/and/actions/",
//     {}
//   );

//   if (response.data.responseCode !== "201") {
//     throw new Error(
//       response.data.message || "Failed to fetch menus and actions"
//     );
//   }

//   // Process the data to remove duplicates and add selected property
//   const processedData = response.data.data.map((menu) => {
//     // Remove duplicate actions based on actionId
//     const uniqueActions = menu.actions.filter(
//       (action, index, self) =>
//         index === self.findIndex((a) => a.actionId === action.actionId)
//     );

//     return {
//       ...menu,
//       actions: uniqueActions.map((action) => ({
//         ...action,
//         selected: action.selected || false,
//       })),
//     };
//   });

//   return processedData;
// };

// // API function to create a new role
// export const createRole = async (roleData) => {
//   const response = await axiosInstance.post("/api/v1/role/save", roleData, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (response.data.responseCode !== "201") {
//     throw new Error(response.data.message || "Failed to create role");
//   }

//   return response.data;
// };
