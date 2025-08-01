import { useEffect, useState, useCallback } from "react";
import { verifyRecaptcha } from "../../../api/auth";
import { useRecaptcha } from "../../../hooks/useAuth";
import { getIpAddress } from "../../../utils/getIpAddress";
import { toast } from "sonner";
import { Spinner } from "@heroui/react";
import { BiUser } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
import Logo from "../../../assets/Images/Logo.png";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
const RecaptchaV3 = ({ setCapta, onError, action = "submit" }) => {
  const { siteKey, loading, error, enabled } = useRecaptcha();

  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedToken, setVerifiedToken] = useState(null);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  // Load reCAPTCHA v3 script
  useEffect(() => {
    if (!siteKey || !enabled) return;

    const loadRecaptchaScript = () => {
      // Check if script already exists
      if (document.querySelector('script[src*="recaptcha/api.js"]')) {
        if (window.grecaptcha && window.grecaptcha.ready) {
          setRecaptchaLoaded(true);
        }
        return;
      }

      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => {
            setRecaptchaLoaded(true);
          });
        }
      };

      script.onerror = () => {
        setRecaptchaLoaded(false);
        toast.error("Failed to load reCAPTCHA");
        onError?.();
      };

      document.head.appendChild(script);
    };

    loadRecaptchaScript();
  }, [siteKey, enabled, onError]);

  useEffect(() => {
    if (recaptchaLoaded) {
      const badge = document.querySelector(".grecaptcha-badge");
      if (badge) {
        badge.style.visibility = "hidden";
      }
    }
  }, [recaptchaLoaded]);

  const executeRecaptcha = useCallback(async () => {
    if (!recaptchaLoaded || !window.grecaptcha || !siteKey || !enabled) {
      return null;
    }

    try {
      setIsVerifying(true);

      // Execute reCAPTCHA v3
      const token = await window.grecaptcha.execute(siteKey, { action });

      if (!token) {
        throw new Error("Failed to get reCAPTCHA token");
      }

      // Verify token with backend
      const ipAddress = await getIpAddress();
      const response = await verifyRecaptcha({
        recaptchaResponse: token,
        action: action,
        userIp: ipAddress,
      });

      const isSuccess =
        response.responseCode === "200" && response.data?.success;

      if (isSuccess) {
        setCapta(token);
        setVerifiedToken(token);
        setIsVerified(true);
        return token;
      } else {
        setCapta(null);
        setIsVerified(false);
        setVerifiedToken(null);
        toast.error(response.message || "reCAPTCHA verification failed");
        onError?.();
        return null;
      }
    } catch (error) {
      setCapta(null);
      setIsVerified(false);
      setVerifiedToken(null);
      toast.error("reCAPTCHA verification error. Please try again.");
      onError?.();
      return null;
    } finally {
      setIsVerifying(false);
    }
  }, [recaptchaLoaded, siteKey, enabled, action, setCapta, onError]);

  // Auto-execute on component mount if enabled
  // useEffect(() => {
  //   if (recaptchaLoaded && enabled && !isVerified) {
  //     executeRecaptcha();
  //   }
  // }, [recaptchaLoaded, enabled, isVerified, executeRecaptcha]);

  const handleRecaptchaClick = useCallback(() => {
    if (!isVerifying && !isVerified && recaptchaLoaded) {
      executeRecaptcha();
    }
  }, [isVerifying, isVerified, recaptchaLoaded, executeRecaptcha]);
  // Handle disabled state
  useEffect(() => {
    if (!enabled) {
      setCapta("disabled");
    }
  }, [enabled, setCapta]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-full p-6  border   border-gray-400 rounded-xl hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 group">
          <div className="flex items-center justify-center space-x-3">
            <Spinner size="sm" color="danger" />
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              Loading reCAPTCHA...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error || (!enabled && !siteKey)) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400 text-sm text-center">
        {error || "reCAPTCHA configuration error"}
      </div>
    );
  }

  if (!enabled) {
    return null;
  }

  return (
    <div className="recaptcha-v3-container w-full">
      {/* Status indicator */}
      <div className="flex items-center justify-center w-full text-sm">
        {isVerifying ? (
          <div className="w-full max-w-md mx-auto px-3 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-xl hover:border-gray-600 transition-all duration-300 group bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <Spinner size="sm" color="danger" className="shrink-0" />
                <span className="text-sm sm:text-base lg:text-lg font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 truncate">
                  Verifying security...
                </span>
              </div>
              <div className="h-6 w-6 sm:h-8 sm:w-8 shrink-0">
                <img
                  src={Logo}
                  alt="RCL Logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        ) : isVerified ? (
          <div className="w-full max-w-md mx-auto px-3 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-xl hover:border-gray-600 transition-all duration-300 group bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <FaCheck className="text-lg sm:text-xl lg:text-2xl text-green-500 dark:text-green-400 shrink-0" />
                <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 truncate">
                  I&apos;m not a robot
                </span>
              </div>
              <div className="h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16 shrink-0">
                <img
                  src={Logo}
                  alt="RCL Logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={handleRecaptchaClick}
            className="w-full max-w-md mx-auto px-3 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-xl hover:border-gray-600 transition-all duration-300 group bg-gray-50 dark:bg-gray-900 cursor-pointer">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <MdCheckBoxOutlineBlank className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300 shrink-0" />
                <span className="text-sm sm:text-base lg:text-lg font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 truncate">
                  I&apos;m not a robot
                </span>
              </div>
              <div className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 shrink-0">
                <img
                  src={Logo}
                  alt="RCL Logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Privacy notice */}
      {/* <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
        This site is protected by reCAPTCHA and the Google{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline">
          Terms of Service
        </a>{" "}
        apply.
      </div> */}
    </div>
  );
};

export default RecaptchaV3;
