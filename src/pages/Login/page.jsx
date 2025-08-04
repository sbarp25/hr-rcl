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
import RecaptchaV3 from "./Component/Recapta";

const Login = () => {
  const [captchaVerified, setCaptchaVerified] = useState(false);
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

  // Initialize captcha state based on reCAPTCHA configuration
  useEffect(() => {
    if (!recaptchaLoading) {
      if (!recaptchaEnabled) {
        // If reCAPTCHA is disabled, allow form submission
        setCapta("disabled");
        setCaptchaVerified(true);
      } else {
        // If reCAPTCHA is enabled, require verification
        setCapta(null);
        setCaptchaVerified(false);
      }
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
    setCaptchaVerified(false);
  };

  // Enhanced form submission to include reCAPTCHA token
  const onSubmit = (data) => {
    const submitData = {
      ...data,
      recaptchaToken: capta !== "disabled" ? capta : null,
    };
    loginMutation.mutate(submitData);
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
        <div className="flex flex-col justify-center py-4">
          <div className="text-red-500 text-center text-sm">
            <p>{recaptchaError}</p>
            <p className="text-xs mt-1">Please refresh the page to try again</p>
          </div>
        </div>
      );
    }

    // Always render RecaptchaV3 component - it handles enabled/disabled state internally
    return (
      <div className="flex justify-center py-4">
        <RecaptchaV3
          setCapta={(token) => {
            setCapta(token);

            if (token && token !== "disabled") {
              setCaptchaVerified(true);
            } else if (token === "disabled") {
              setCaptchaVerified(true);
            } else {
              setCaptchaVerified(false);
            }
          }}
          onError={() => {
            console.log("Captcha error occurred"); // Debug log
            handleRecaptchaError();
          }}
          action="login"
        />
      </div>
    );
  };

  const isFormDisabled = () => {
    const disabled =
      loginMutation.isPending ||
      recaptchaLoading ||
      (recaptchaEnabled && !captchaVerified);

    return disabled;
  };

  return (
    <>
      <LocationComponent />
      <div className="min-h-screen bg-gray-200 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden">
          <div className="hidden md:flex bg-bgprimary dark:bg-black transition-colors duration-300">
            <div className="flex flex-col gap-y-8 items-center justify-center w-full p-8">
              <img src={Logo} alt="logo" className="w-80 max-w-full" />
              <p className="text-xl lg:text-2xl leading-relaxed text-white dark:text-gray-100 text-center font-normal transition-colors duration-300">
                Whispers of Code,
                <br /> Symphonies of Solution
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-black transition-colors duration-300 flex items-center justify-center p-8">
            <form
              onSubmit={handleSubmit(onSubmit)}
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

              {/* reCAPTCHA v3 Section */}
              {renderRecaptchaSection()}

              <div className="flex items-center justify-between w-full">
                <ButtonComponent
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 dark:bg-active dark:hover:bg-gray-600 text-white dark:text-white rounded-xl py-6 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isFormDisabled()}
                  content={
                    <>
                      <span className="text-xl font-bold ">Login</span>
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
