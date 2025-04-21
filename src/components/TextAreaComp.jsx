import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Textarea } from "@nextui-org/react";

const TextAreaComp = ({
  name,
  label,
  control,
  rules,
  className,
  variant = "bordered",
  defaultValue,
  errors = {}, // Add default empty object for errors
}) => {
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const getMaxRows = () => {
    if (screenWidth >= 1536) return 12; // 2xl
    if (screenWidth >= 1280) return 10; // xl
    if (screenWidth >= 1024) return 8; // lg
    if (screenWidth >= 768) return 6; // md
    return 4; // default for smaller screens
  };

  const getRows = () => {
    if (screenWidth >= 1536) return 10; // 2xl
    if (screenWidth >= 1280) return 8; // xl
    if (screenWidth >= 1024) return 6; // lg
    if (screenWidth >= 768) return 4; // md
    return 4; // default for smaller screens
  };

  return (
    <div>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue || ""}
        rules={rules}
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            minRows={getRows()}
            maxRows={getMaxRows()}
            isInvalid={fieldState?.error ? true : false}
            errorMessage={fieldState?.error?.message}
            className={className}
            label={label}
            variant={variant}
          />
        )}
      />
    </div>
  );
};

export default TextAreaComp;
