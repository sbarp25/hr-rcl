import Attendancereport from "../../components/Attendancereport.jsx";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import WorkFromHome from "../../components/WorkFromHome.jsx";
import Leave from "../../components/Leave.jsx";
import CheckIn from "../../components/CheckIn.jsx";

const Page = () => {
  const username = localStorage.getItem("fullName");

  return (
    <div className="w-full h-[97vh] overflow-y-hidden">
      <div className="w-full flex flex-col gap-4 ">
        <CheckIn />

        {/* Welcome Banner */}
        <div className="flex justify-center bg-white  items-center rounded-md w-full shadow-sm">
          <p className="font-light text-lg leading-10">Welcome, {username}</p>
        </div>

        {/* Weekly Attendance Report */}
        <div className="flex flex-col bg-white rounded-lg w-full border border-gray-300 shadow-sm">
          <div className="flex flex-col justify-center items-center">
            <h1 className="page-title mt-2 text-xl font-bold">
              Weekly Attendance Report
            </h1>
            <div className="w-full overflow-x-auto">
              <Attendancereport />
            </div>
          </div>
          <div className="text-md font-bold text-right mr-4 mb-3">
            <p className="text-teal-500 mt-1">Total Early Time: {"1Hrs"}</p>
            <p className="text-red-500 mt-1">Total delay Time: {"1.5Hrs"}</p>
          </div>
        </div>

        {/* WFH and Leave Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Work From Home Panel */}
          <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full px-4 py-3 border-b gap-3">
              <h3 className="text-xl font-bold">Work From Home</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm">Search:</p>
                <Input
                  className="max-w-xs w-full sm:w-auto"
                  type="search"
                  placeholder="Search..."
                  size="sm"
                />
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <WorkFromHome />
            </div>
          </div>

          {/* Leave Panel */}
          <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full px-4 py-3 border-b gap-3">
              <p className="text-xl font-bold">Leave</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  className="bg-blue-900 text-white text-sm shadow-sm"
                  size="sm">
                  Today Leave
                </Button>
                <Button
                  type="button"
                  className="bg-red-700 text-white text-sm shadow-sm"
                  size="sm">
                  Upcoming Leave
                </Button>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <Leave />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
