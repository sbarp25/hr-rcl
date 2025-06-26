import { Button } from "@heroui/react";

const GoBack = () => {
  function goBack() {
    window.history.back();
  }
  return (
    <Button
      className="text-white bg-black dark:text-white dark:bg-white"
      onPress={goBack}>
      Back
    </Button>
  );
};

export default GoBack;
