import Logo from "../../assets/Images/Logo.png";
import { useForm } from "react-hook-form";
import { CiMail } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
const Login = () => {
  const [showPassword, setShowPassword] = useState(true);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };
  return (
    <div className="pl-16 pt-10 pb-32 pr-8 bg-[#eeeeee]  h-screen">
      {/* <div className="grid grid-cols-2 shadow-2xl shadow-[#791E1E3D] h-[90vh]"> */}
      <div className="grid grid-cols-2 shadow-2xl shadow-gray-400 h-[90vh]">
        <div className="bg-bgprimary  rounded-l-2xl ">
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
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-8 justify-center items-center ">
            <p>Log in</p>
            <div className="w-full relative">
              <label>Email Address:</label>
              <div className="relative flex items-center ">
                <input
                  type="text"
                  className="w-full bg-[#EEEEEE] rounded-lg h-11 shadow-lg shadow-gray-300"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
                <CiMail className="absolute right-3 text-gray-500 text-xl" />
              </div>
              {errors.email && (
                <p className=" absolute top-[6] text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label>Password:</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "password" : "text"}
                  className="w-full bg-[#EEEEEE] rounded-lg h-11 shadow-lg shadow-gray-300"
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

            <a href="/forgotpassword" className="">
              Forgot Password?
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
