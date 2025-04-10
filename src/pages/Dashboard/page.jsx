import Attendancereport from "../../components/Attendancereport.jsx";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import WorkFromHome from "../../components/WorkFromHome.jsx";
import Leave from "../../components/Leave.jsx";

import CheckIn from "../../components/CheckIn.jsx";
const Page = () => {
  const username = localStorage.getItem("fullName");

  return (
    <>
      <div className="max-h-[97vh] max-w-[84vw]  ">
        <CheckIn />
        <div>
          <div className="flex justify-center bg-white h-12 items-center rounded-md w-[85vw] ">
            <p className="font-light text-lg leading-10 ">
              Welcome, {username}
            </p>
          </div>
          <div className="flex flex-col mt-6 bg-white h-auto rounded-lg  w-[85vw] border-2 border-gray-300 ">
            <div className="flex flex-col justify-center items-center">
              <h1 className="page-title mt-2">Weekly Attendance Report</h1>
              <Attendancereport />
            </div>

            <div className="text-md font-bold text-right mr-16">
              <p className="text-teal-500 mr-2">Total Early Time: {"1 hrs"}</p>
              <p className="text-red-500">Total Delay Time: {".5 hrs"}</p>
            </div>
          </div>
          <div className="flex justify-around   w-[85vw]">
            <div className="bg-white mt-2 w-[40vw] text-xl font-bold rounded-lg  ">
              <h3 className="mt-5 ml-5"> Work from Home</h3>

              <div className="flex w-64 ml-64 ">
                <p className="-mt-7">Search:</p>

                <Input
                  className="-mt-8 ml-1"
                  type="search"
                  placeholder="Search..."
                  labelPlacement="outside"
                />
              </div>

              <WorkFromHome />
            </div>
            <div className=" flex flex-col bg-white mt-2 pt-4 w-[43vw] text-xl font-bold rounded-lg  ">
              <div className="flex justify-between items-center">
                {/* Left aligned Leave text */}
                <div className="flex w-fit ml-5">Leave</div>

                {/* Button section */}
                <div className="flex h-10 font-normal text-right w-fit">
                  <Button
                    type="button"
                    className="bg-blue-900 px-4 py-2 rounded-lg text-white mr-2 shadow-lg">
                    Today Leave
                  </Button>
                  <Button
                    type="button"
                    className="bg-red-700  py-2 rounded-lg text-white mr-5 shadow-lg">
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
