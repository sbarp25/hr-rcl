import { FaDiamond } from "react-icons/fa6";

const UnderlineComponent = () => {
  return (
    <div className="absolute left-0 flex  flex-1 items-center w-full ">
      <FaDiamond className="h-3 w-2 text-red-300 " />
      <div className="flex-1 w-4  h-[2px] bg-red-300 dark:bg-active"></div>
      <div className="flex-1 border-b-2 border-black dark:border-white border-dashed"></div>
    </div>
  );
};

export default UnderlineComponent;
