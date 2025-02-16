import { Input } from "@nextui-org/react";
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
  iconClassName = "absolute right-3 top-4 text-gray-500 text-xl",
  id,
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
        render={({
          field: { onChange, onBlur, value, ref },
          fieldState: { error },
        }) => (
          <Input
            ref={ref}
            id={id || name}
            variant={variant}
            label={label}
            type={isPasswordField && showPassword ? "text" : type}
            isInvalid={!!error}
            errorMessage={error?.message}
            validationBehavior="aria"
            value={value}
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
