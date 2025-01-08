import { Button, Form, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import bcrypt from "bcryptjs";
import { Navigate, useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axios-Instance";

const Rstpwd = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const password = watch("password");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let resetpasswordData = params.get("data");

    if (resetpasswordData) {
      resetpasswordData = decodeURIComponent(resetpasswordData);
      resetpasswordData = resetpasswordData.replaceAll(" ", "+");
      console.log(resetpasswordData);
      localStorage.setItem("resetpasswordData", resetpasswordData);

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const encryptedData = localStorage.getItem("resetpasswordData");

        if (!encryptedData) {
          toast.error("No reset password data found");
          navigate("/login");
          return;
        }

        const requestBody = {
          data: {
            encData: encryptedData,
          },
        };
        const response = await axios.post(
          "http://192.168.1.147:8090/auth/rstpwd",
          requestBody
        );

        if (response.status === 200) {
          // toast.success(response.data.message);
          toast.success("Link validated successfully. Redirecting...");
        } else {
          // toast.error(response.data.message);
          toast.error("Failed to validate the link. Please try again.");
          // navigate("/login");
        }
      } catch (error) {
        toast.error("Please Contact the administrator and try again later");
        console.error("An error occurred:", error);
        // navigate("/login");
      } finally {
        setIsLoading(false); // Hide loading state
      }
    };
    fetchData();
  }, [navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    let encryptedData = localStorage.getItem("resetpasswordData");

    // Sanitize the encryptedData to remove spaces
    if (encryptedData) {
      encryptedData = encryptedData.replace(/\s/g, "");
    }
    if (!encryptedData) {
      toast.error("No reset password data found");
      navigate("/login");
      return;
    }
    try {
      // Hash the password
      // const hashedPassword = await bcrypt.hash(data.password, 10);

      const newData = {
        data: {
          encryptedData: encryptedData,
          newPassword: password,
        },
      };

      const response = await axios.post(
        "http://192.168.1.147:8090/auth/set-password",
        newData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.responseCode === "200") {
        toast.success("Password reset successfully!");
        const accessToken = response.data.data.accessToken;
        if (response.data.data.eKyeStatus === "NOT_INITIATED") {
          navigate("/EKYE");
        }
        if (response.data.data.eKyeStatus === "COMPLETED") {
          navigate("/");
        }
        localStorage.setItem("accessToken", accessToken);
        navigate("/");
      } else {
        toast.error("Failed to reset password.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Error resetting password.");
      navigate("/login");
    } finally {
      setIsLoading(false);
      localStorage.removeItem("resetpasswordData");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[95vh] bg-gray-100">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-white">
        <h1 className="text-xl font-bold mb-4">Reset Password</h1>
        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-medium mb-2">
            New Password:
          </label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="New Password"
            className={`w-full p-3 rounded-lg border focus:outline-none focus:border-bgprimary ${
              errors.password ? "border-red-500" : ""
            }`}
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}

          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 text-sm font-medium mb-2">
            Confirm Password:
          </label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className={`w-full p-3 rounded-lg border focus:outline-none focus:border-bgprimary ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-bgprimary text-white py-3 rounded-lg transition-colors ease-in-out duration-200 ${
              errors.password || errors.confirmPassword
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}>
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Rstpwd;
