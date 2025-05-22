import { Button } from "@nextui-org/react";

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
      className={className}
      disabled={disabled}
      type={type}>
      {content}
    </Button>
  );
};

export default ButtonComponent;
