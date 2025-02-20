import Logo from "../../assets/Images/Logo.png";
import { useForm } from "react-hook-form";
import { CiMail } from "react-icons/ci";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Input, Spinner } from "@nextui-org/react";
import ButtonComponent from "../../components/ButtonComp";
import InputComponent from "../../components/InputComponent";
import LocationComponent from "../../components/LocationComponent";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const navigate = useNavigate();
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const handleLogin = async (formState) => {
    setIsLoading(true);

    const LoginData = {
      data: {
        email: formState.email,
        password: formState.password,
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`,
        LoginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data?.responseCode === "200") {
        const accessToken = response?.data?.data?.accessToken;
        const refreshToken = response?.data?.data?.refreshToken;
        const FullName = response?.data?.data?.fullName;
        const Email = response?.data?.data?.email;
        const ekeyStep = response?.data?.data?.ekeyStep;
        localStorage.setItem("ekeyStep", ekeyStep);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("fullName", FullName);
        localStorage.setItem("email", Email);
        toast.success(response.data.message);

        if (
          response?.data?.data?.ekyeStatus === "NOT_REQUIRED" ||
          response?.data?.data?.ekyeStatus === "COMPLETED"
        ) {
          navigate("/");
        } else {
          navigate("/EKYE");
        }
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage;
        toast.error(errorMessage || "Log In Failed");
      }
    } catch (error) {
      toast.error("Login failed. Try again.");
      console.error("Error logging in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LocationComponent />
      {/* {isLoading && <Loader message="Logging in, please wait..." />} */}
      <div className="pt-10  bg-gray-200 h-screen">
        <div className=" container grid grid-cols-2  h-[90vh]">
          {/* <div className="grid grid-cols-2 shadow-2xl shadow-gray-400 h-screen"> */}
          <div className="bg-bgprimary rounded-l-2xl">
            {/* <div className="bg-bgprimary"> */}
            <div className="mt-64 flex flex-col gap-y-16 items-center justify-center">
              <img src={Logo} alt="logo" className="w-96" />
              <p className="text-2xl leading-10 text-white text-center font-normal">
                Whispers of Code,
                <br /> Symphonies of Solution
              </p>
            </div>
          </div>
          <div className="px-16 pt-64 bg-white rounded-r-2xl">
            <form
              onSubmit={handleSubmit(handleLogin)}
              className="flex flex-col gap-6 w-full">
              <p className="text-lg sm:text-xl font-semibold text-center">
                Log in
              </p>
              <InputComponent
                name="email"
                control={control}
                variant="bordered"
                label="Email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Enter a valid email address",
                  },
                }}
              />
              <InputComponent
                name="password"
                control={control}
                label="Password"
                variant="bordered"
                type="password"
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
              />
              <div className="flex items-center justify-between w-full">
                <ButtonComponent
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white rounded-md py-2 shadow-lg transition duration-300"
                  disabled={isLoading}
                  content={
                    <>
                      <span>Log In</span>
                      {isLoading && <Spinner size="sm" color="danger" />}
                    </>
                  }
                />
              </div>
              <a href="/" className="text-sm text-blue-500 text-center">
                Forgot Password?
              </a>
            </form>
            {/* <Form
              onSubmit={handleSubmit(handleLogin)}
              className="flex flex-col gap-y-8 justify-center items-center">
              <p className="text-xl font-semibold">Log in</p>
              <div className="w-full relative">
                <div className="relative flex items-center">
                  <Input
                    id="email"
                    type="text"
                    variant="bordered"
                    label="Email"
                    className={`w-full  rounded-xl shadow-lg shadow-gray-300 ${
                      errors.email ? "border-2 border-red-500" : ""
                    }`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Enter a valid email address",
                      },
                    })}
                  />
                  <CiMail className="absolute right-3 text-gray-500 text-xl" />
                </div>
                {errors.email && (
                  <p className="absolute top-[6] text-red-500 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <div className="relative flex items-center">
                  <Input
                    id="password"
                    label="Password"
                    type={showPassword ? "password" : "text"}
                    className={`w-full bg-gray-200 rounded-xl h-11 shadow-lg shadow-gray-300 ${
                      errors.password ? "border-2 border-red-500" : ""
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label="Toggle Password Visibility"
                    className="absolute right-3 text-gray-500 text-xl">
                    {showPassword ? <FaEye /> : <FaRegEyeSlash />}
                  </button>
                </div>
                {errors.password && (
                  <p className="absolute top-[6] text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                isDisabled={isLoading}
                type="submit"
                className="w-full bg-bgprimary text-white px-5 py-2 rounded-md h-11 shadow-lg shadow-gray-300">
                <span>Log In</span>
                {isLoading && <Spinner size="sm" color="danger" />}
              </Button>

              <a href="/forgotpassword" className="text-sm text-blue-500">
                Forgot Password?
              </a>
            </Form> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
