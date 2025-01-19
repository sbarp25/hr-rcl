import { Button } from "@nextui-org/react";
import React from "react";

const ButtonComp = ({ onPress, className }) => {
  return (
    <Button onPress={onPress} className={className}>
      ButtonComp
    </Button>
  );
};

export default ButtonComp;
