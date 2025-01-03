import Logo from "../../assets/Images/Logo.png";
import { useForm } from "react-hook-form";
import { CiMail } from "react-icons/ci";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const navigate = useNavigate();
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
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
        "http://192.168.1.147:8091/auth/login",
        LoginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const accessToken = response?.data?.data?.accessToken;
      const refreshToken = response?.data?.data?.refreshToken;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Try again.");
      console.error("Error logging in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader message="Logging in, please wait..." />}
      <div className="pl-16 pt-10 pb-32 pr-8 bg-gray-200 h-screen">
        <div className="grid grid-cols-2 shadow-2xl shadow-gray-400 h-[90vh]">
          <div className="bg-bgprimary rounded-l-2xl">
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
              className="flex flex-col gap-y-8 justify-center items-center">
              <p className="text-xl font-semibold">Log in</p>
              <div className="w-full relative">
                <label htmlFor="email">Email Address:</label>
                <div className="relative flex items-center">
                  <input
                    id="email"
                    type="text"
                    className="w-full bg-gray-200 rounded-lg h-11 shadow-lg shadow-gray-300"
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
                <label htmlFor="password">Password:</label>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    type={showPassword ? "password" : "text"}
                    className="w-full bg-gray-200 rounded-lg h-11 shadow-lg shadow-gray-300"
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

              <button
                type="submit"
                className="w-full bg-bgprimary text-white px-5 py-2 rounded-md h-11 shadow-lg shadow-gray-300">
                Log In
              </button>

              <a href="/forgotpassword" className="text-sm text-blue-500">
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
