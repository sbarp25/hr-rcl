import React, { useState } from "react";
import InputComponent from "../../../components/InputComponent";
import { useForm } from "react-hook-form";
import { Button } from "@nextui-org/react";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import { GoDotFill } from "react-icons/go";
const ChangePassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const password = watch("password");
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const resetData = {
        data: {
          currentPassword: data.oldpassword,
          newPassword: data.password,
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/change-password`,
        resetData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data?.responseCode === "200") {
        toast.success(response?.data?.message);
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 ">
        Change Password
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-gray-300 rounded-2xl p-4">
          <p>
            <h1 className="font-bold">Your Password must </h1>
            <ul>
              <div className="flex items-center">
                <GoDotFill /> <li>Be between 8 and 20 characters long</li>
              </div>
              <li>
                <div className="flex items-center">
                  <GoDotFill />
                  Only contain letters (a-z, A-Z), numbers (0-9), and these
                  special characters:
                  <span className="font-mono bg-gray-100 px-1 mx-1 rounded">
                    !@#$%^&amp;*()_+={}[]:.;&quot;&#39;&lt;&gt;,.?\|
                  </span>
                </div>
              </li>
              <div className="flex items-center">
                <GoDotFill />
                <li>Not consist solely of spaces</li>
              </div>

              <div className="flex items-center">
                <GoDotFill />
                <li>Not contain 2 or more consecutive spaces</li>
              </div>
            </ul>
          </p>
        </div>
        {/* Old Password */}
        <InputComponent
          type="password"
          name="oldpassword"
          control={control}
          variant="bordered"
          className="w-full"
          label="Old Password"
          rules={{
            required: "Password is required",
            pattern: {
              value:
                /^(?!\s$)(?!.*\s{2,})[A-Za-z0-9!@#$%^&*()_+={}[\]:;"'<>,.?\\|-]{8,20}$/,
              message: "Password must be 8 characters long.",
            },
          }}
        />

        {/* New Password */}
        <InputComponent
          type="password"
          name="password"
          control={control}
          variant="bordered"
          className="w-full"
          label="New Password"
          rules={{
            required: "Password is required",
            pattern: {
              value:
                /^(?!\s$)(?!.*\s{2,})[A-Za-z0-9!@#$%^&*()_+={}[\]:;"'<>,.?\\|-]{8,20}$/,
              message: "Password must be 8 characters long.",
            },
          }}
        />

        {/* Confirm Password */}
        <InputComponent
          type="password"
          name="confirmPassword"
          control={control}
          variant="bordered"
          className="w-full"
          label="Confirm Password"
          rules={{
            required: "Password is required",
            validate: (value) => value === password || "Passwords do not match",
            pattern: {
              value:
                /^(?!\s$)(?!.*\s{2,})[A-Za-z0-9!@#$%^&*()_+={}[\]:;"'<>,.?\\|-]{8,20}$/,
              message:
                "Password must be 8 characters long and include special characters.",
            },
          }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className={`py-3 rounded-lg text-white font-medium transition duration-200 ${
            isLoading || errors.password || errors.confirmPassword
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-bgprimary hover:bg-bgprimary/90"
          }`}>
          {isLoading ? "Loading..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;
