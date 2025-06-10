import { Button, Form, Input } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axios-Instance";
import Logo from "../../assets/Images/Logo.png";

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
          toast.error(response.data.message);
          navigate("/login");
          return;
        }

        const requestBody = {
          data: {
            encData: encryptedData,
          },
        };
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/validPassword`,
          requestBody
        );

        if (response.status === 200) {
          // toast.success(response.data.message);
          // toast.success("Link validated successfully. Redirecting...");
        } else {
          toast.error(response.data.message);
          // toast.error("Failed to validate the link. Please try again.");
        }
      } catch (error) {
        toast.error(error.response?.data?.messages);
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
    // if (!encryptedData) {
    //   toast.error("No reset password data found");
    //   navigate("/login");
    //   return;
    // }
    try {
      const newData = {
        data: {
          encryptedData: encryptedData,
          newPassword: password,
        },
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/setPassword`,
        newData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.responseCode === "200") {
        toast.success(response.data.message);
        const accessToken = response.data.data.accessToken;
        const refreshToken = response.data.data.refreshToken;
        const userName = response.data.data.fullName;
        const email = response.data.data.email;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("fullName", userName);
        localStorage.setItem("email", email);

        if (
          response?.data?.data?.ekyeStatus === "NOT_REQUIRED" ||
          response?.data?.data?.ekyeStatus === "COMPLETED"
        ) {
          navigate("/dashboard");
        } else {
          navigate("/EKYE");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
      navigate("/login");
    } finally {
      setIsLoading(false);
      localStorage.removeItem("resetpasswordData");
    }
  };

  // const hasaccess = false;

  // useEffect(() => {
  //   if (!hasaccess) {
  //     navigate("/login");
  //   }
  // }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="grid grid-cols-2 rounded-2xl shadow-lg overflow-hidden bg-white max-w-5xl w-full">
        {/* Left Section - Logo & Tagline */}
        <div className="bg-bgprimary flex flex-col items-center justify-center text-white px-12 py-20">
          <img src={Logo} alt="logo" className="w-72 mb-8" />
          <p className="text-2xl font-medium text-center leading-10">
            Whispers of Code, <br /> Symphonies of Solution
          </p>
        </div>

        {/* Right Section - Reset Password Form */}
        <div className="px-16 py-20 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Reset Password
          </h1>

          <Form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* New Password Input */}
            <div>
              <Input
                variant="bordered"
                id="password"
                type="password"
                name="password"
                label="New Password"
                className={`w-96 p-3 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <Input
                variant="bordered"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                className={`w-96 p-3 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
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
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className={` bg-bgprimary text-white py-3 rounded-lg transition-colors ease-in-out duration-200 ${
                errors.password || errors.confirmPassword
                  ? " cursor-not-allowed"
                  : ""
              }`}>
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Rstpwd;
