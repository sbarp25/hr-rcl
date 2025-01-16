import { useState } from "react";
import Attendancereport from "../../components/Attendancereport.jsx";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";

const Page = () => {
  const [ischeckedin, setIscheckedin] = useState(true);

  const handleCheckin = () => {
    setIscheckedin(!ischeckedin);
  };

  const username = localStorage.getItem("fullName");

  return (
    <>
      <div className="h-[100vh] overflow-y-hidden ">
        <div className="flex justify-end mb-4">
          <Button
            onPress={handleCheckin}
            className="button bg-bgprimary hover:bg-bgprimaryhover mb-1  text-white px-4 py-2 ">
            {ischeckedin ? "Check Out" : "Check In"}
          </Button>
        </div>
        <div>
          <div className="flex justify-center bg-white h-12 rounded-md">
            <p className="font-medium text-2xl leading-10">
              Welcome, {username}
            </p>
          </div>
          <div className="flex flex-col mt-2 bg-white h-auto rounded ">
            <div className="flex flex-col justify-center items-center">
              <h1 className="page-title mt-2">Weekly Attendance Report</h1>
              <Attendancereport />
            </div>

            <div className="text-xl font-bold ">
              <p>Today Delay Time: {}</p>
              <p>Today Early Time: {}</p>
            </div>
          </div>
          <div className="flex gap-2 h-32">
            <div className="bg-white mt-2 w-1/2 text-xl font-bold rounded-lg h-full">
              Work from Home
              <div className="flex w-80 ml-80">
                <p className="mt-1">Search:</p>
                <Input
                  type="search"
                  placeholder="Search..."
                  labelPlacement="outside"
                />
              </div>
            </div>
            <div className="h-full flex bg-white mt-2 pt-4 w-1/2 text-xl font-bold rounded-lg justify-between">
              Leave
              <div className="flex h-8 font-normal ">
                <button
                  type="button"
                  className="bg-blue-700 px-4 py-2 rounded-lg text-white mr-2 pb-8">
                  Today Leave
                </button>
                <button
                  type="button"
                  className="bg-red-700 px-4 py-2 rounded-lg text-white pb-8">
                  Upcoming Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
