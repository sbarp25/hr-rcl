import { Input } from "@heroui/react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";

const InputComponent = ({
  name,
  control,
  rules,
  label,
  variant,
  type,
  inputClassName = "",
  icon,
  isReadOnly = false, // Default to false
  iconClassName = "absolute right-3 top-4 text-gray-500 text-xl",
  id,
  value, // Accept initial value
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative">
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={value} // Set default value
        render={({
          field: { onChange, onBlur, value: fieldValue, ref },
          fieldState: { error },
        }) => (
          <Input
            ref={ref}
            id={id || name}
            isDisabled={isReadOnly} // Set read-only state
            variant={variant}
            label={label}
            type={isPasswordField && showPassword ? "text" : type}
            isInvalid={!!error}
            errorMessage={error?.message}
            validationBehavior="aria"
            value={fieldValue} // Ensure controlled input
            onChange={onChange}
            onBlur={onBlur}
            className={inputClassName}
            multiple
          />
        )}
      />
      {isPasswordField && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className={iconClassName}>
          {showPassword ? <FaEye /> : <FaRegEyeSlash />}
        </button>
      )}
      {icon && <icon className={iconClassName} />}
    </div>
  );
};

export default InputComponent;
