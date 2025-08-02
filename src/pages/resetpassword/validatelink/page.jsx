import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader/Loader.jsx";
import Logo from "../../../assets/Images/Logo.png";
import { Button } from "@heroui/button";
import InputComponent from "../../../components/ui/InputComponent.jsx";
import LocalStorageUtil from "../../../utils/LocalStorageUtil.js";
const ValidateLink = () => {
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(true);

  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const password = watch("password");

  {
    /**To extract the encripted data from the url and keep it in localStorage */
  }
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

  const onSubmit = async (data) => {
    setIsLoading(true);
    let encryptedData = localStorage.getItem("resetpasswordData");

    if (encryptedData) {
      encryptedData = encryptedData.replace(/\s/g, "");
    }
    if (!encryptedData) {
      toast.error("No reset password data found");
      navigate("/login");
      return;
    }
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
        // toast.success(response.data.message);
        const accessToken = response.data.data.accessToken;
        const refreshToken = response.data.data.refreshToken;
        const userName = response.data.data.fullName;
        const email = response.data.data.email;
        const menu = response.data.data.menuActionsAndPermissions;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("fullName", userName);
        localStorage.setItem("email", email);
        LocalStorageUtil.setItem("menu", menu);

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

  {
    /**TO Check if the data is valid or not if it is not valid it will redirect to the login page else it will show the reset password form*/
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const encryptedData = localStorage.getItem("resetpasswordData");

        if (!encryptedData) {
          setError("No reset password data found");
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
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/validPassword`,
          requestBody
        );

        if (response?.data?.responseCode === "200") {
          setShowPassword(true);
        } else {
          const errorMessage = response?.error?.errorList?.errorMessage;
          setError("API request failed. Please try again.");
          toast.error(errorMessage);
          navigate("/login");
        }
      } catch (error) {
        setError("An error occurred. Please try again later.");
        toast.error(error.response?.data?.messages);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <>
      {isLoading && (
        <Loader message="Please wait while the work is being done" />
      )}
      {showPassword ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl shadow-lg overflow-hidden bg-white max-w-5xl w-full">
            {/* Left Section */}
            <div className="hidden md:flex bg-bgprimary dark:bg-gray-800  flex-col items-center justify-center text-white px-12 py-20">
              <img src={Logo} alt="logo" className="w-72 mb-8" />
              <p className="text-2xl font-medium text-center leading-10">
                Whispers of Code, <br /> Symphonies of Solution
              </p>
            </div>

            {/*  Reset Password Form */}
            <div className="dark:bg-gray-800 px-16 py-20 flex flex-col justify-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Reset Password
              </h1>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* New Password Input */}
                <div>
                  <InputComponent
                    type="password"
                    name="password"
                    control={control}
                    variant="bordered"
                    className={`w-[45vh] p-3 `}
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
                </div>

                {/* Confirm Password Input */}
                <div>
                  <InputComponent
                    type="password"
                    name="confirmPassword"
                    control={control}
                    variant="bordered"
                    className={`w-[45vh] p-3 `}
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
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-sm w-full">
            <h1 className="text-xl font-semibold text-gray-800 text-center mb-4">
              Validating the reset Link Please Wait
            </h1>
          </div>
        </div>
      )}
    </>
  );
};

export default ValidateLink;
