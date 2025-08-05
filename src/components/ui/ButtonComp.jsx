import { Button } from "@heroui/react";

const ButtonComponent = ({
  onPress,
  variant,
  className,
  content,
  type,
  disabled,
  color,
}) => {
  return (
    <Button
      onPress={onPress}
      color={color}
      variant={variant}
      className={`text-white bg-black dark:bg-white dark:text-black dark:hover:text-white hover:bg-active dark:hover:dark:bg-active ${className}`}
      disabled={disabled}
      type={type}>
      {content}
    </Button>
  );
};

export default ButtonComponent;
