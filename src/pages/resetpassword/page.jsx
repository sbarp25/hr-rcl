import { Button, Form, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
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
          navigate("/");
        } else {
          navigate("/EKYE");
        }
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error.response?.data?.message);
      navigate("/login");
    } finally {
      setIsLoading(false);
      localStorage.removeItem("resetpasswordData");
    }
  };

  return (
    <div className="p-6 bg-gray-200 h-[100vh]">
      <div className="grid grid-cols-2 items-center justify-center h-auto bg-red-500 rounded-2xl mt-16 ">
        <div className=" bg-bgprimary rounded-l-2xl">
          <div className="mt-64 mb-48 flex flex-col gap-y-16 items-center justify-center">
            <img src={Logo} alt="logo" className="w-96" />
            <p className="text-2xl leading-10 text-white text-center font-normal">
              Whispers of Code,
              <br /> Symphonies of Solution
            </p>
          </div>
        </div>
        <div className=" px-16 pt-[30vh] bg-white rounded-r-2xl ">
          <h1 className="flex text-xl font-bold mb-4">Reset Password</h1>

          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 mb-[16vh] "
          >
            <Input
              variant="bordered"
              id="password"
              type="password"
              name="password"
              label="New Password"
              className={`w-full p-3 rounded-lg  focus:outline-none  ${
                errors.password ? "border-red-500" : ""
              }`}
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}

            <Input
              variant="bordered"
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              className={`w-full p-3 rounded-lg  focus:outline-none ${
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
              }`}
            >
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Rstpwd;
