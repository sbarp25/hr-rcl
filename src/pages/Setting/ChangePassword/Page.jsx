import { useEffect, useState } from "react";
import InputComponent from "../../../components/ui/InputComponent.jsx";
import { useForm } from "react-hook-form";
import { Button } from "@heroui/react";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "sonner";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader/Loader.jsx";
import GoBack from "../../../components/GoBack.jsx";

const ChangePassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
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
          reset({ oldpassword: "", password: "", confirmPassword: "" });
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

  const hasaccess = true;
  const changePasswordAccess = true;

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mx-auto bg-white dark:bg-black rounded-xl shadow-lg">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
                Security
              </h1>
            </div>

            <GoBack />

            <div className="grid grid-cols-1 gap-6 p-6  rounded-xl">
              {/* Change Password Form */}
              <div className="bg-white border border-gray-200 dark:bg-gray-800 shadow-sm p-6 rounded-2xl">
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
                  Change Password
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Password Guidelines */}
                  <div className="bg-gray-100 dark:bg-slate-500 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300">
                    <h3 className="font-semibold text-base mb-2">
                      Your password must:
                    </h3>
                    <ul className="space-y-2 pl-2">
                      <li className="flex items-start gap-2">
                        <GoDotFill className="mt-1 text-gray-600 dark:text-gray-400" />
                        Be between 8 and 20 characters long
                      </li>
                      <li className="flex items-start gap-2">
                        <GoDotFill className="mt-1 text-gray-600 dark:text-gray-400" />
                        Only contain letters, numbers, and special characters:
                        <span className="font-mono bg-white dark:bg-slate-800 dark:text-white dark:p-2 px-1 rounded text-xs ml-1">
                          !@#$%^&*()_+={}[]:.;"'&lt;&gt;,.?\|
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Input Fields */}
                  <div className="space-y-6">
                    <InputComponent
                      type="password"
                      name="oldpassword"
                      control={control}
                      variant="bordered"
                      className="w-full"
                      label="Old Password"
                      rules={{
                        required: "Password is required",
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
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      isLoading ||
                      errors.password ||
                      errors.confirmPassword ||
                      !changePasswordAccess
                    }
                    className={`w-full py-3 rounded-lg text-white font-semibold transition duration-200 ${
                      isLoading ||
                      errors.password ||
                      errors.confirmPassword ||
                      !changePasswordAccess
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-gray-800"
                    }`}>
                    {isLoading ? "Loading..." : "Submit"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangePassword;
