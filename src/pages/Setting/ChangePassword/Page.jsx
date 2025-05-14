import React, { useEffect, useState } from "react";
import InputComponent from "../../../components/InputComponent";
import { useForm } from "react-hook-form";
import { Button } from "@nextui-org/react";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import { GoDotFill } from "react-icons/go";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (data) => {
    if (changePasswordAccess) {
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
    } else {
      toast.error("You currently dont have access to this setting ");
    }
  };
  const menu = LocalStorageUtil.getItem("menu");

  /**To check Employee see status */
  const hasaccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 72)
  );

  const changePasswordAccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 71)
  );
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  return (
    <div className="mx-auto bg-white   rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800 ">
        Security
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl">
        {/* Change Password Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white border border-gray-200 shadow-sm p-6 rounded-2xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Change Password
          </h2>

          {/* Password Guidelines */}
          <div className="bg-gray-100 rounded-xl p-4 text-sm text-gray-700">
            <h3 className="font-semibold text-base mb-2">
              Your password must:
            </h3>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <GoDotFill className="mt-1 text-gray-600" />
                Be between 8 and 20 characters long
              </li>
              <li className="flex items-start gap-2">
                <GoDotFill className="mt-1 text-gray-600" />
                Only contain letters, numbers, and special characters:
                <span className="font-mono bg-white px-1 rounded text-xs">
                  !@#$%^&amp;*()_+={}[]:.;&quot;&#39;&lt;&gt;,.?\|
                </span>
              </li>
              <li className="flex items-start gap-2">
                <GoDotFill className="mt-1 text-gray-600" />
                Not consist solely of spaces
              </li>
              <li className="flex items-start gap-2">
                <GoDotFill className="mt-1 text-gray-600" />
                Not contain 2 or more consecutive spaces
              </li>
            </ul>
          </div>

          {/* Inputs */}
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
                message:
                  "Password must be 8 characters long. And can include letters, numbers, and special characters.",
              },
            }}
          />

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
                message:
                  "Password must be 8 characters long. And can include letters, numbers, and special characters.",
              },
            }}
          />

          <InputComponent
            type="password"
            name="confirmPassword"
            control={control}
            variant="bordered"
            className="w-full"
            label="Confirm Password"
            rules={{
              required: "Password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
              pattern: {
                value:
                  /^(?!\s$)(?!.*\s{2,})[A-Za-z0-9!@#$%^&*()_+={}[\]:;"'<>,.?\\|-]{8,20}$/,
                message:
                  "Password must be 8 characters long. And can include letters, numbers, and special characters.",
              },
            }}
          />

          <Button
            type="submit"
            disabled={
              isLoading ||
              errors.password ||
              errors.confirmPassword ||
              !changePasswordAccess
            }
            className={`w-full py-3 rounded-lg text-white font-semibold transition duration-200 ${
              isLoading || errors.password || errors.confirmPassword
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black"
            }`}>
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </form>

        {/* Two Factor Auth Section */}
        <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Two-Factor Authentication
          </h2>
          <p className="text-lg text-gray-600">Currently Unavailable</p>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
