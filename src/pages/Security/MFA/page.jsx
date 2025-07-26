import { useEffect, useState } from "react";
import InputComponent from "../../../components/ui/InputComponent.jsx";
import { useForm } from "react-hook-form";
import { Button, Switch } from "@heroui/react";

import Loader from "../../../components/Loader/Loader.jsx";
import GoBack from "../../../components/GoBack.jsx";
import { IoShieldCheckmark, IoInformationCircle } from "react-icons/io5";
import {
  useFetchingMFASetting,
  useSaveMFAsetting,
} from "../../../hooks/useAuth.js";

const MFA = () => {
  const {
    control: twoFactorControl,
    handleSubmit: handletwoFactorSubmit,
    formState: { errors: twoFactorErrors, isSubmitting: isTwoFactorSubmitting },
    reset: resetTwoFactor,
  } = useForm();

  const [mfaEnabled, setMfaEnabled] = useState(false);

  const { mutate: updateMfaSettings, isPending: isTwoFactorPenging } =
    useSaveMFAsetting();

  const handleSubmit = (formData) => {
    const payload = {
      mfaEnabled,
      currentPassword: formData.currentPassword,
    };

    updateMfaSettings(payload, {
      onSuccess: () => {
        resetTwoFactor();
      },
    });
  };

  const { data } = useFetchingMFASetting();

  useEffect(() => {
    if (data) {
      setMfaEnabled(data?.mfaEnabled);
    }
  }, [data]);

  const loading = isTwoFactorPenging || isTwoFactorSubmitting;
  if (loading) {
    return <Loader />; // Added return statement
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <GoBack />

      <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <IoShieldCheckmark className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Multi-Factor Authentication
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mx-8 mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
          <div className="flex items-start space-x-3">
            <IoInformationCircle className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p className="font-medium mb-1">
                About Multi-Factor Authentication
              </p>
              <p className="text-xs leading-relaxed">
                When enabled, you&apos;ll need to enter a verification code from
                your gmail in addition to your password when signing in. This
                significantly improves your account security.
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form
            onSubmit={handletwoFactorSubmit(handleSubmit)}
            className="space-y-6">
            {/* MFA Toggle */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {mfaEnabled ? "Currently enabled" : "Currently disabled"}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-sm font-medium ${
                      mfaEnabled
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                    {mfaEnabled ? "Enabled" : "Disabled"}
                  </span>
                  <Switch
                    isSelected={mfaEnabled}
                    onValueChange={setMfaEnabled}
                    color="default"
                    size="lg"
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Your Identity
              </label>
              <InputComponent
                type="password"
                name="currentPassword"
                control={twoFactorControl}
                variant="bordered"
                className="w-full"
                label="Current Password"
                placeholder="Enter your current password to confirm changes"
                rules={{
                  required: "Password is required to update MFA settings",
                  pattern: {
                    value:
                      /^(?!\s$)(?!.*\s{2,})[A-Za-z0-9!@#$%^&*()_+={}[\]:;"'<>,.?\\|-]{8,20}$/,
                    message:
                      "Password must be 8-20 characters long and can include letters, numbers, and special characters.",
                  },
                }}
                isDisabled={isTwoFactorSubmitting}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                We need your current password to verify this security change.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                className="w-fit  px-16 py-4 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                isDisabled={isTwoFactorSubmitting}
                isLoading={isTwoFactorSubmitting}>
                {isTwoFactorSubmitting
                  ? "Updating Settings..."
                  : "Update MFA Settings"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MFA;
