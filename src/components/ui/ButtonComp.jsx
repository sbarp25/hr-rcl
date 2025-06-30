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
      className={`bg-black text-white dark:bg-white dark:text-black ${className}`}
      disabled={disabled}
      type={type}>
      {content}
    </Button>
  );
};

export default ButtonComponent;
