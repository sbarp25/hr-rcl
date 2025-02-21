import { useState } from "react";
import Attendancereport from "../../components/Attendancereport.jsx";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import WorkFromHome from "../../components/WorkFromHome.jsx";
import Leave from "../../components/Leave.jsx";
import { MdRadioButtonChecked } from "react-icons/md";
import axiosInstance from "../../lib/axios-Instance.js";
import LocalStorageUtil from "../../utils/LocalStorageUtil";
import { toast } from "react-toastify";
import { getIpAddress } from "../../utils/getIpAddress.js";
const Page = () => {
  const [ischeckedin, setIscheckedin] = useState(true);

  const latitude = LocalStorageUtil.getItem("latitude");
  const longitude = LocalStorageUtil.getItem("longitude");

  // const isStudent = LocalStorageUtil.getItem("isStudent");
  const handleCheckin = async () => {
    const ipAddress = await getIpAddress();
    if (ischeckedin) {
      const requestData = {
        data: {
          requestLat: latitude,
          requestLong: longitude,
          requestDevice: "Mobile",
          checkInType: "office",
          // requestIp: "192.168.1.1",
          requestIp: ipAddress,
          // isStudent: isStudent,
          isStudent: false,
        },
      };
      console.log("RequestData for checkin", requestData);
      try {
        const response = await axiosInstance.post(
          "/api/attendance/check_in",
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.responseCode === "200") {
          toast.success(response?.data?.message);
          setIscheckedin(false);
        } else {
          const errorMessage =
            response?.data?.error?.errorList?.[0]?.errorMessage;
          toast.error(errorMessage || "Check In Failed");
        }
      } catch (error) {
        const errorMessage = error?.data?.error?.errorList?.[0]?.errorMessage;
        toast.error(errorMessage || "Check In Failed");
      }
    } else {
      const requestData = {
        data: {
          requestLat: latitude,
          requestLong: longitude,
          requestIp: ipAddress,
        },
      };
      try {
        const response = await axiosInstance.post(
          "/api/attendance/check_out",
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response?.data?.responseCode === "200") {
          toast.success("checked out successfully!");
          setIscheckedin(true);
        } else {
          const error = response?.data?.error?.errorList?.[0]?.errorMessage;
          toast.error(error || "CheckOut Failed");
        }
      } catch (error) {
        console.error("error during checkOut", error);
        toast.error("checkOut Failed");
      }
    }
  };
  const username = localStorage.getItem("fullName");

  return (
    <>
      <div className="max-h-[97vh] w-[80vw]  ">
        <div className="flex justify-end mb-4">
          {ischeckedin ? (
            <MdRadioButtonChecked className="text-red-700 h-10 w-10 mr-2 " />
          ) : (
            <MdRadioButtonChecked className="text-green-700 h-10 mr-2  w-10" />
          )}
          <Button
            onPress={handleCheckin}
            className="button bg-bgprimary hover:bg-hoverbackground mb-1  text-white px-4 py-2 tracking-normal">
            {ischeckedin ? (
              <>
                <span className="text-white font-Poppins text-xl">
                  Check In{" "}
                </span>
              </>
            ) : (
              <>
                <span className="text-white font-Poppins text-xl">
                  Check Out
                </span>
              </>
            )}
          </Button>
        </div>
        <div>
          <div className="flex justify-center bg-white h-8 rounded-md">
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
              <p className="text-green-700 mr-2">Total Early Time: {"1 hrs"}</p>
              <p className="text-red-700">Total Delay Time: {".5 hrs"}</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="bg-white mt-2 w-1/2 text-xl font-bold rounded-lg  ">
              <h3 className="mt-5 ml-5"> Work from Home</h3>

              <div className="flex w-80 ml-64 ">
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
            <div className=" flex flex-col bg-white mt-2 pt-4 w-1/2 text-xl font-bold rounded-lg  ">
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
