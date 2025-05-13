import { Button } from "@nextui-org/react";

const GoBack = () => {
  function goBack() {
    window.history.back();
  }
  return (
    <Button className="text-white bg-black" onPress={goBack}>
      Back
    </Button>
  );
};

export default GoBack;
