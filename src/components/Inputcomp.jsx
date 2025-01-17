import React from "react";
import { Input } from "@nextui-org/react";
const Inputcomp = ({ value, onChange, label, variant, type, id }) => {
  return (
    <Input
      onChange={onChange}
      value={value}
      variant={variant}
      type={type}
      id={id}>
      {label}
    </Input>
  );
};

export default Inputcomp;
