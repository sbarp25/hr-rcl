import { Input } from "@nextui-org/react";
import ValidationComponent from "./ValidationComponent";
const Inputcomp = ({ value, onChange, label, variant, type, id }) => {
  return (
    <>
      <Input
        className="shadow-lg shadow-gray-300 rounded-lg"
        id={id}
        variant={variant}
        type={type}
        value={value}
        onChange={onChange}
        label={label}
      />
    </>
  );
};

export default Inputcomp;
