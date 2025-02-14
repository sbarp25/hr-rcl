import { Input } from "@nextui-org/react";
import ValidationComponent from "./ValidationComponent";
const Inputcomp = ({
  className,
  value,
  onChange,
  label,
  variant,
  type,
  isReadonly,
  startContent,
  placeholder,
  errorMessage,
  isInvalid,
}) => {
  return (
    <>
      <Input
        className=""
        // className={className}
        variant={variant}
        placeholder={placeholder}
        type={type}
        isReadonly={isReadonly}
        value={value}
        onChange={onChange}
        startContent={startContent}
        label={label}
        errorMessage={errorMessage}
        isInvalid={isInvalid}
      />
    </>
  );
};

export default Inputcomp;
