import Logo from "../../assets/Images/Logo.png";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner } from "@heroui/react";
import ButtonComponent from "../../components/ui/ButtonComp.jsx";
import InputComponent from "../../components/ui/InputComponent.jsx";
import LocationComponent from "../../components/LocationComponent";
import LocalStorageUtil from "../../utils/LocalStorageUtil";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { handleSubmit, control } = useForm();

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
        const Menu = response?.data?.data?.menuActionsAndPermissions;
        const isCurrentlyStudying = response?.data?.data?.isCurrentlyStudying;
        localStorage.setItem("isCurrentlyStudying", isCurrentlyStudying);
        localStorage.setItem("ekeyStep", ekeyStep);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("fullName", FullName);
        localStorage.setItem("email", Email);
        LocalStorageUtil.setItem("menu", Menu);

        if (
          response?.data?.data?.ekyeStatus === "NOT_REQUIRED" ||
          response?.data?.data?.ekyeStatus === "COMPLETED"
        ) {
          navigate("/dashboard");
        } else {
          navigate("/EKYE");
        }
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage;
        toast.error(errorMessage || "Log In Failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Login failed. Try again.";
      toast.error(errorMessage);
      // toast.error("Login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/") {
      LocalStorageUtil.removeItem("accessToken");
    }
  }, []);
  return (
    <>
      <LocationComponent />
      {/* {isLoading && <Loader message="Logging in, please wait..." />} */}
      <div className="pt-10  bg-gray-200 h-screen">
        <div className=" container grid grid-cols-1 md:grid-cols-2  h-[90vh]">
          {/* <div className="grid grid-cols-2 shadow-2xl shadow-gray-400 h-screen"> */}
          <div className="hidden md:block bg-bgprimary rounded-l-3xl">
            {/* <div className="bg-bgprimary"> */}
            <div className="mt-64 flex flex-col gap-y-16 items-center justify-center">
              <img src={Logo} alt="logo" className="w-96" />
              <p className="text-2xl leading-10 text-white text-center font-normal ">
                Whispers of Code,
                <br /> Symphonies of Solution
              </p>
            </div>
          </div>
          <div className="px-16 pt-64 bg-white rounded-2xl md:rounded-r-3xl md:rounded-l-none">
            <form
              onSubmit={handleSubmit(handleLogin)}
              className="flex flex-col space-y-4 gap-6 w-full">
              <p className="text-2xl sm:text-xl font-bold text-center">
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
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                }}
              />
              <div className="flex items-center justify-between w-full">
                <ButtonComponent
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white rounded-xl  py-6 shadow-lg transition duration-300 "
                  disabled={isLoading}
                  content={
                    <>
                      <span className="text-xl font-bold">Log In</span>
                      {isLoading && <Spinner size="sm" color="danger" />}
                    </>
                  }
                />
              </div>
              <a
                href="/fgtPwd"
                className="text-xl text-black font-medium text-center">
                Forgot Password?
              </a>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
