import { useState } from "react";
import Attendancereport from "../../components/Attendancereport.jsx";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import WorkFromHome from "../../components/WorkFromHome.jsx";
import Leave from "../../components/Leave.jsx";

const Page = () => {
  const [ischeckedin, setIscheckedin] = useState(true);

  const handleCheckin = () => {
    setIscheckedin(!ischeckedin);
  };

  const username = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");

  return (
    <>
      <div className="h-[95vh] overflow-y-hidden  ">
        <div className="flex justify-end mb-4">
          <Button
            onPress={handleCheckin}
            className="button bg-bgprimary hover:bg-bgprimaryhover mb-1  text-white px-4 py-2 tracking-normal"
          >
            {ischeckedin ? "Check Out" : "Check In"}
          </Button>
        </div>
        <div>
          <div className="flex justify-center bg-white h-12 rounded-md">
            <p className="font-medium text-2xl leading-10">
              Welcome, {username}
            </p>
          </div>
          <div className="flex flex-col mt-6 bg-white h-auto rounded-lg ">
            <div className="flex flex-col justify-center items-center">
              <h1 className="page-title mt-2">Weekly Attendance Report</h1>
              <Attendancereport />
            </div>

            <div className="text-md font-bold text-right mr-16">
              <p className="text-green-700 mr-2">Today Early Time: {}</p>
              <p className="text-red-700">Today Delay Time: {}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="bg-white mt-2 w-1/2 text-xl font-bold rounded-lg max-h-[40vh] overflow-auto">
              <h3 className="mt-5 ml-5"> Work from Home</h3>

              <div className="flex w-80 ml-64">
                <p className="-mt-6">Search:</p>
                <Input
                  className="-mt-8 ml-1"
                  type="search"
                  placeholder="Search..."
                  labelPlacement="outside"
                />
              </div>
              <WorkFromHome />
            </div>
            <div className=" max-h-[40vh] flex flex-col bg-white mt-2 pt-4 w-1/2 text-xl font-bold rounded-lg overflow-auto ">
              <div className="flex justify-between items-center">
                {/* Left aligned Leave text */}
                <div className="flex w-fit ml-2">Leave</div>

                {/* Button section */}
                <div className="flex h-10 font-normal text-right w-fit">
                  <Button
                    type="button"
                    className="bg-blue-900 px-4 py-2 rounded-lg text-white mr-2 shadow-md"
                  >
                    Today Leave
                  </Button>
                  <Button
                    type="button"
                    className="bg-red-700 px-4 py-2 rounded-lg text-white mr-5 shadow-md"
                  >
                    Upcoming Leave
                  </Button>
                </div>
              </div>

              <Leave />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
