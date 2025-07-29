import Logo from "../../assets/Images/Logo.png";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Modal, ModalContent, Spinner, useDisclosure } from "@heroui/react";
import ButtonComponent from "../../components/ui/ButtonComp";
import InputComponent from "../../components/ui/InputComponent";
import LocationComponent from "../../components/LocationComponent";
import {
  useLogin,
  useOTPVerification,
  useRecaptcha,
} from "../../hooks/useAuth";
import OTPInputComponent from "../../components/ui/OTPInputComponent";
import Recaptcha from "./Component/Recapta";

const Login = () => {
  const [sessionToken, setSessionToken] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [capta, setCapta] = useState(null);
  const loginMutation = useLogin({ onOpen, setSessionToken });
  const { handleSubmit, control } = useForm();

  const {
    siteKey,
    enabled: recaptchaEnabled,
    loading: recaptchaLoading,
    error: recaptchaError,
  } = useRecaptcha();

  const {
    handleSubmit: handleOTPSubmit,
    control: oTPcontrol,
    reset: oTPreset,
  } = useForm();

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/") {
      localStorage.clear();
    }
  }, []);

  // Set capta to "disabled" when reCAPTCHA is disabled
  useEffect(() => {
    if (!recaptchaLoading && !recaptchaEnabled) {
      setCapta("disabled");
    }
  }, [recaptchaLoading, recaptchaEnabled]);

  const closeModal = () => {
    oTPreset();
    onClose();
  };

  const verifyOTPMutation = useOTPVerification({ onOpenChange, sessionToken });
  const handleSubmitOTP = (data) => {
    verifyOTPMutation.mutate(data);
  };

  const handleRecaptchaError = () => {
    setCapta(null);
  };

  // Helper function to render reCAPTCHA section
  const renderRecaptchaSection = () => {
    if (recaptchaLoading) {
      return (
        <div className="flex justify-center py-4">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="md" color="danger" className="ml-2" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Loading reCAPTCHA...
            </span>
          </div>
        </div>
      );
    }

    if (recaptchaError) {
      return (
        <div className="flex justify-center py-4">
          <div className="text-red-500 text-center text-sm">
            <p>{recaptchaError}</p>
            <p className="text-xs mt-1">Please refresh the page to try again</p>
          </div>
        </div>
      );
    }

    if (recaptchaEnabled && siteKey) {
      return (
        <div className="flex justify-center py-4">
          <Recaptcha setCapta={setCapta} onError={handleRecaptchaError} />
        </div>
      );
    }

    // Return null if reCAPTCHA is disabled
    return null;
  };

  return (
    <>
      <LocationComponent />
      <div className="pt-10 bg-gray-200 dark:bg-gray-900 h-screen transition-colors duration-300">
        <div className=" container grid grid-cols-1 md:grid-cols-2  h-[90vh]">
          <div className="hidden md:block bg-bgprimary dark:bg-gray-800 rounded-l-3xl transition-colors duration-300">
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
              onSubmit={handleSubmit(loginMutation.mutate)}
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

              {/* reCAPTCHA Section */}
              {renderRecaptchaSection()}

              <div className="flex items-center justify-between w-full">
                <ButtonComponent
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-xl py-6 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    loginMutation.isPending ||
                    recaptchaLoading || // Disable button while loading
                    (recaptchaEnabled && !capta) // Disable if reCAPTCHA is enabled but not completed
                  }
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

      {/* OTP Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onclose) => (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-center">
                Multi-Factor Authentication
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Please Enter the OTP sent to your mail
              </p>
              <form
                onSubmit={handleOTPSubmit(handleSubmitOTP)}
                className="space-y-4">
                <OTPInputComponent
                  control={oTPcontrol}
                  name="MFAOTP"
                  label="OTP"
                  length="6"
                  type="password"
                />

                <div className="flex gap-3">
                  <ButtonComponent
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg"
                    content="Cancel"
                  />

                  <ButtonComponent
                    type="submit"
                    className="flex-1 bg-black hover:bg-gray-800 text-white py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={verifyOTPMutation.isPending}
                    content={
                      <>
                        <span>Verify</span>
                        {verifyOTPMutation?.isPending && (
                          <Spinner size="sm" color="danger" className="ml-2" />
                        )}
                      </>
                    }
                  />
                </div>
              </form>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Login;
