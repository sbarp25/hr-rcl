import { Input } from "@nextui-org/react";
import ValidationComponent from "./ValidationComponent";
const Inputcomp = ({
  className,
  value,
  onChange,
  label,
  variant,
  type,
  id,
  startContent,
  placeholder,
}) => {
  return (
    <>
      <Input
        className="shadow-lg shadow-gray-300 rounded-lg"
        // className={className}
        id={id}
        variant={variant}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        startContent={startContent}
        label={label}
      />
    </>
  );
};

export default Inputcomp;
