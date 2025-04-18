import { useEffect, useState } from "react";
import LocalStorageUtil from "../utils/LocalStorageUtil";
import { getIpAddress } from "../utils/getIpAddress";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios-Instance";
import { MdRadioButtonChecked } from "react-icons/md";
import { Button } from "@nextui-org/react";

const CheckIn = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const latitude = LocalStorageUtil.getItem("latitude");
  const longitude = LocalStorageUtil.getItem("longitude");

  const checkedInStatus = localStorage.getItem("CheckinStatus");

  useEffect(() => {
    const checkIn = () => {
      if (checkedInStatus === "true") {
        setIsCheckedIn(true);
      } else {
        setIsCheckedIn(false);
      }
    };
    const interval = setInterval(() => {
      checkIn();
    }, 1000);
    return () => clearInterval(interval);
  }, [checkedInStatus]);

  const handleAttendance = async () => {
    const ipAddress = await getIpAddress();

    if (!isCheckedIn) {
      const requestData = {
        data: {
          requestLat: latitude,
          requestLong: longitude,
          requestDevice: "Mobile",
          checkInType: "office",
          requestIp: ipAddress,
          isStudent: false,
        },
      };

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
          toast.success(response?.data?.message || "Checked in successfully!");
          localStorage.setItem("CheckinStatus", "true");
          setIsCheckedIn(true);
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
          toast.success("Checked out successfully!");
          localStorage.setItem("CheckinStatus", "false");
          setIsCheckedIn(false);
        } else {
          const error = response?.data?.error?.errorList?.[0]?.errorMessage;
          toast.error(error || "Check Out Failed");
        }
      } catch (error) {
        console.error("Error during checkout", error);
        toast.error("Check Out Failed");
      }
    }
  };

  return (
    <div className="flex justify-end ">
      {isCheckedIn ? (
        <MdRadioButtonChecked className="text-green-700 h-8 w-8 md:h-10 md:w-10" />
      ) : (
        <MdRadioButtonChecked className="text-red-700 h-8 w-8 md:h-10 md:w-10" />
      )}
      <Button
        onPress={handleAttendance}
        className="button bg-bgprimary hover:bg-hoverbackground text-white py-2 tracking-normal">
        {isCheckedIn ? (
          <span className="text-white font-Poppins text-base md:text-xl">
            Check Out
          </span>
        ) : (
          <span className="text-white font-Poppins text-base md:text-xl">
            Check In
          </span>
        )}
      </Button>
    </div>
  );
};

export default CheckIn;
