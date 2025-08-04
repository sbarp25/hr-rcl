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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden h-[80vh]">
          {/* Left Side - Logo and Tagline */}
          <div className="hidden md:flex bg-black transition-colors duration-300 flex-col items-center justify-center gap-y-8 p-8">
            <img src={Logo} alt="logo" className="w-80 max-w-full" />
            <p className="text-xl lg:text-2xl leading-relaxed text-white dark:text-gray-100 text-center font-normal transition-colors duration-300">
              Whispers of Code,
              <br /> Symphonies of Solution
            </p>
          </div>
          {/* Right Side - Form */}
          <div className="bg-white dark:bg-black transition-colors duration-300 flex flex-col items-center justify-center p-8">
            <h2 className="text-2xl font-semibold text-center mb-4">
              Reset Your Password
            </h2>
            <p className="text-sm text-gray-600  dark:text-white text-center mb-8">
              Enter your email address below and we&apos;ll send you a password
              reset link.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 w-full">
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
      </div>
    </>
  );
};

export default ForgetPassword;
