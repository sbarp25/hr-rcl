import { useState } from "react";
import Loader from "../../../components/Loader";

const Menu = () => {
  const [isLoading, setIsLoading] = useState("");
  return (
    <>
      {isLoading && (
        <Loader message="Please wait while we get the process done." />
      )}
      <div>Menu</div>
    </>
  );
};

export default Menu;
