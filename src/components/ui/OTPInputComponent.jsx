import { Controller } from "react-hook-form";
import { InputOtp } from "@heroui/react";
import { useState } from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";

const OTPInputComponent = ({
  name,
  control,
  length = 4,
  label = "Enter OTP",
  type = "text",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // Determine the actual input type based on visibility state
  const getInputType = () => {
    if (isPasswordField) {
      return showPassword ? "text" : "password";
    }
    return type;
  };
  return (
    <div className="flex flex-col items-start gap-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>

      <div className="relative">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <InputOtp
              type={getInputType()}
              length={length}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
            {showPassword ? <FaEye /> : <FaRegEyeSlash />}
          </button>
        )}
      </div>
    </div>
  );
};

export default OTPInputComponent;
