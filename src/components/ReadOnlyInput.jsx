import { Input } from "@nextui-org/react";
import React from "react";

const ReadOnlyInput = ({ label, placeholder }) => {
  return (
    <Input
      isReadOnly
      label={label}
      variant="underlined"
      placeholder={placeholder}
      className="w-full"
    />
  );
};

export default ReadOnlyInput;
