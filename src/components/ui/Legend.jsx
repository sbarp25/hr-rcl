import React from "react";

const Legend = () => {
  return (
    <div>
      {" "}
      <div className="flex gap-1 items-end justify-end text-right">
        <div className="flex w-2 h-2 rounded-full bg-red-400 dark:bg-red-400"></div>
        <div className="flex w-2 h-2 rounded-full bg-black dark:bg-white"></div>
        <div className="flex w-2 h-2 rounded-full bg-slate-600 dark:bg-slate-500"></div>
      </div>
    </div>
  );
};

export default Legend;
