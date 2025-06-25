import Logo from "../../assets/Images/Logo.png";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@heroui/react";
import LocalStorageUtil from "../../utils/LocalStorageUtil";
import { loginUser } from "../../api/auth";
import ButtonComponent from "../../components/ui/ButtonComp";
import InputComponent from "../../components/ui/InputComponent";
import LocationComponent from "../../components/LocationComponent";
import { useLogin } from "../../hooks/useAuth";
const Login = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { handleSubmit, control } = useForm();

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/") {
      localStorage.clear();
    }
  }, []);
  return (
    <>
      <LocationComponent />
      {/* {isLoading && <Loader message="Logging in, please wait..." />} */}
      <div className="pt-10 bg-gray-200 dark:bg-gray-900 h-screen transition-colors duration-300">
        <div className=" container grid grid-cols-1 md:grid-cols-2  h-[90vh]">
          {/* <div className="grid grid-cols-2 shadow-2xl shadow-gray-400 h-screen"> */}
          <div className="hidden md:block bg-bgprimary dark:bg-gray-800 rounded-l-3xl transition-colors duration-300">
            {/* <div className="bg-bgprimary"> */}
            <div className="mt-64 flex flex-col gap-y-16 items-center justify-center">
              <img src={Logo} alt="logo" className="w-96" />
              <p className="text-2xl leading-10 text-white dark:text-gray-100 text-center font-normal transition-colors duration-300">
                Whispers of Code,
                <br /> Symphonies of Solution
              </p>
            </div>
          </div>
          <div className="px-16 pt-64 bg-white dark:bg-gray-800 rounded-2xl md:rounded-r-3xl md:rounded-l-none transition-colors duration-300">
            <form
              onSubmit={handleSubmit(loginMutation.mutateAsync)}
              className="flex flex-col space-y-4 gap-6 w-full">
              <p className="text-2xl sm:text-xl font-bold text-center text-gray-900 dark:text-white transition-colors duration-300">
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
                  className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-xl py-6 shadow-lg transition-all duration-300"
                  disabled={loginMutation.isPending}
                  content={
                    <>
                      <span className="text-xl font-bold">Log In</span>
                      {loginMutation?.isPending && (
                        <Spinner size="sm" color="danger" />
                      )}
                    </>
                  }
                />
              </div>
              <a
                href="/fgtPwd"
                className="text-xl text-black dark:text-gray-300 hover:text-gray-700 dark:hover:text-white font-medium text-center transition-colors duration-300">
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
