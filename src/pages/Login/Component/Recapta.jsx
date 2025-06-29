import { useRef, useState, useCallback } from "react";
import { verifyRecaptcha } from "../../../api/auth";
import ReCAPTCHA from "react-google-recaptcha";
import { useRecaptcha } from "../../../hooks/useAuth";
import { getIpAddress } from "../../../utils/getIpAddress";
import { toast } from "sonner";

const Recaptcha = ({ setCapta, onError }) => {
  const { siteKey, loading, error, enabled } = useRecaptcha();

  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedToken, setVerifiedToken] = useState(null);

  const isVerifiedRef = useRef(false);
  const recaptchaRef = useRef(null);

  const handleRecaptchaChange = useCallback(
    async (token) => {
      console.log(
        "reCAPTCHA onChange triggered with token:",
        token ? "present" : "null"
      );

      if (!token && isVerifiedRef.current) {
        console.log("Token expired but already verified. Skipping reset.");
        return;
      }

      if (!token) {
        console.log("Token is null and not verified, resetting states.");
        setRecaptchaToken(null);
        setCapta(null);
        setVerificationResult(null);
        return;
      }

      if (isVerifiedRef.current) {
        console.log("Already verified. Skipping re-verification.");
        return;
      }

      console.log("New reCAPTCHA token received, starting verification");
      setRecaptchaToken(token);
      setVerificationResult(null);

      if (enabled) {
        setIsVerifying(true);
        try {
          const ipAddress = await getIpAddress();
          const response = await verifyRecaptcha({
            recaptchaResponse: token,
            userIp: ipAddress,
          });

          console.log("Verification response:", response);
          const isSuccess =
            response.responseCode === "200" && response.data?.success;

          if (isSuccess) {
            console.log("Verification successful");
            setCapta(token);
            setVerifiedToken(token);
            setVerificationResult(response);
            setIsVerified(true);
            isVerifiedRef.current = true;
            toast.success("reCAPTCHA verification successful!");
          } else {
            console.log("Verification failed:", response.message);
            recaptchaRef.current?.reset();
            setCapta(null);
            setRecaptchaToken(null);
            setVerificationResult(response);
            setIsVerified(false);
            isVerifiedRef.current = false;
            setVerifiedToken(null);
            toast.error(response.message || "reCAPTCHA verification failed");
            onError?.();
          }
        } catch (error) {
          console.error("Verification error:", error);
          recaptchaRef.current?.reset();
          setCapta(null);
          setRecaptchaToken(null);
          setVerificationResult({
            success: false,
            message: error.response?.data?.message || "Verification failed",
          });
          setIsVerified(false);
          isVerifiedRef.current = false;
          setVerifiedToken(null);
          toast.error("reCAPTCHA verification error. Please try again.");
          onError?.();
        } finally {
          setIsVerifying(false);
        }
      } else {
        setCapta(token);
      }
    },
    [enabled, setCapta, onError]
  );

  const handleExpired = useCallback(() => {
    console.log("reCAPTCHA expired.");
    if (isVerifiedRef.current) {
      console.log("Already verified. Keeping previous verified state.");
      setCapta(verifiedToken);
      return;
    }

    console.log("Token expired and not verified. Resetting state.");
    setRecaptchaToken(null);
    setCapta(null);
    setVerificationResult(null);
  }, [verifiedToken, setCapta]);

  const handleError = useCallback(() => {
    console.log("reCAPTCHA error occurred");
    if (isVerifiedRef.current) {
      console.log("Already verified. Ignoring error.");
      return;
    }

    setRecaptchaToken(null);
    setCapta(null);
    setVerificationResult(null);
    setIsVerified(false);
    isVerifiedRef.current = false;
    setVerifiedToken(null);
    onError?.();
  }, [setCapta, onError]);

  const handleReset = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Manual reset triggered");
    recaptchaRef.current?.reset();
    setCapta(null);
    setRecaptchaToken(null);
    setVerificationResult(null);
    setIsVerified(false);
    isVerifiedRef.current = false;
    setVerifiedToken(null);
  };

  if (loading) {
    return <div className="p-4">Loading reCAPTCHA...</div>;
  }

  if (error || !siteKey) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!enabled) {
    if (!recaptchaToken) {
      setCapta("disabled");
    }
    return null;
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="space-y-4">
        <div className="flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={siteKey}
            onChange={handleRecaptchaChange}
            onExpired={handleExpired}
            onError={handleError}
          />
        </div>

        {verificationResult && !isVerified && (
          <div className="text-center text-red-600">
            {verificationResult.message || "Verification failed!"}
            <div className="mt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors">
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recaptcha;
