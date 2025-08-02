import { useState } from "react";
import Logo from "../../assets/Images/Logo.png";
import { useForm } from "react-hook-form";
import InputComponent from "../../components/ui/InputComponent.jsx";
import ButtonComponent from "../../components/ui/ButtonComp.jsx";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useForgetPasswordEmail } from "../../hooks/useAuth.js";

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit } = useForm();
  const { mutate: SubmitEmail } = useForgetPasswordEmail();

  const onSubmit = async (data) => {
    setIsLoading(true);
    const resetData = {
      data: {
        email: data.email,
      },
    };
    SubmitEmail(resetData);
  };

  return (
    <>
      <div className=" grid grid-cols-1 md:grid-cols-2 h-full pt-10">
        {/* Left Side - Logo and Tagline */}
        <div className="hidden md:flex flex-col items-center justify-center bg-bgprimary dark:bg-gray-800   rounded-l-3xl">
          <img src={Logo} alt="Logo" className="w-72 mb-10" />
          <p className="text-2xl text-white text-center font-light leading-relaxed">
            Whispers of Code, <br />
            Symphonies of Solution
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col justify-center p-8 sm:p-12 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Reset Your Password
          </h2>
          <p className="text-sm text-gray-600  dark:text-white text-center mb-8">
            Enter your email address below and we&apos;ll send you a password
            reset link.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <div className=" flex justify-between items-center gap-4">
              <ButtonComponent
                type="submit"
                content="Send Reset Link"
                className="bg-black text-white "
              />
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-600 hover:text-slate-800 dark:text-white transition-colors duration-200 flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Return to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
