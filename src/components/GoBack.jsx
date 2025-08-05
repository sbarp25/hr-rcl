import { Button } from "@heroui/react";

const GoBack = () => {
  function goBack() {
    window.history.back();
  }
  return (
    <Button
      className="text-white bg-black dark:bg-white dark:text-black dark:hover:text-white hover:dark:bg-active dark:hover:dark:bg-active"
      onPress={goBack}>
      Back
    </Button>
  );
};

export default GoBack;
