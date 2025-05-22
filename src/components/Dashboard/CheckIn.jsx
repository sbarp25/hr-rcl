import { useState } from "react";
import LocalStorageUtil from "../../utils/LocalStorageUtil.js";
import { getIpAddress } from "../../utils/getIpAddress.js";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axios-Instance.js";
import { MdRadioButtonChecked } from "react-icons/md";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import TextAreaComp from "../ui/TextAreaComp.jsx";
import Loader from "../Loader/Loader.jsx";

const CheckIn = ({ checkedInStatus, onStatusChange }) => {
  const [isloading, setIsloading] = useState(false);
  const { control, handleSubmit, reset } = useForm();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isSecondModalOpen,
    onOpen: onOpenSecondModal,
    onOpenChange: onOpenChangeSecondModal,
  } = useDisclosure();

  const latitude = LocalStorageUtil.getItem("latitude");
  const longitude = LocalStorageUtil.getItem("longitude");

  const lateCheckinCheck = () => {
    onOpen();
  };
  const handleLateCheckInConfirm = () => {
    onOpenChange(false);
    onOpenSecondModal();
  };

  const isStudent = localStorage.getItem("isCurrentlyStudying") === "true";

  const handleAttendance = async () => {
    const ipAddress = await getIpAddress();

    if (!checkedInStatus) {
      const requestData = {
        data: {
          requestLat: latitude,
          requestLong: longitude,
          requestDevice: "Mobile",
          checkInType: "office",
          requestIp: ipAddress,
          isStudent: isStudent,
        },
      };
      setIsloading(true);
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
          // Update parent component's state via callback
          onStatusChange(true);
        } else if (response.data.responseCode === "406") {
          lateCheckinCheck();
        } else {
          const errorMessage =
            response?.data?.error?.errorList?.[0]?.errorMessage ||
            "Something went wrong";
          toast.error(errorMessage);
        }
      } catch (error) {
        const errorMessage = error?.data?.error?.errorList?.[0]?.errorMessage;
        toast.error(errorMessage || "Check In Failed");
      } finally {
        setIsloading(false);
      }
    } else {
      const requestData = {
        data: {
          requestLat: latitude,
          requestLong: longitude,
          requestIp: ipAddress,
        },
      };
      setIsloading(true);
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
          // Update parent component's state via callback
          onStatusChange(false);
        } else {
          const errorMessage =
            response?.data?.error?.errorList?.[0]?.errorMessage ||
            "Something went wrong";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Error during checkout", error);
        toast.error("Check Out Failed");
      } finally {
        setIsloading(false);
      }
    }
  };

  const handleSecondModalConfirm = async (data) => {
    const ipAddress = await getIpAddress();
    const lateCheckin = {
      data: {
        requestLat: latitude,
        requestLong: longitude,
        requestDevice: "Mobile",
        checkInType: "office",
        requestIp: ipAddress,
        isStudent: isStudent,
        justification: data.reason,
      },
    };
    setIsloading(true);
    try {
      const response = await axiosInstance.post(
        "/api/attendance/late_check_in",
        lateCheckin,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.responseCode === "200") {
        toast.success("Late check-in processed successfully!");
        onOpenChangeSecondModal(false);
        // Update parent component's state via callback
        onStatusChange(true);
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.log(error);
      toast.error("Late Check In Failed");
    } finally {
      setIsloading(false);
    }
  };

  const closeRejectModal = () => {
    onOpenChangeSecondModal(false);
    reset();
  };

  return (
    <>
      {isloading && <Loader />}
      <div className="flex justify-end items-center ">
        <div className="">
          {checkedInStatus ? (
            <MdRadioButtonChecked className="text-green-700 h-8 w-8 md:h-10 md:w-10" />
          ) : (
            <MdRadioButtonChecked className="text-red-700 h-8 w-8 md:h-10 md:w-10" />
          )}
        </div>
        <Button
          isDisabled={isloading}
          // isDisabled={isloading}
          onPress={handleAttendance}
          className="button bg-bgprimary hover:bg-hoverbackground text-white py-2 tracking-normal">
          {checkedInStatus ? (
            <span className="text-white font-Poppins text-base md:text-xl">
              Check Out
            </span>
          ) : (
            <span className="text-white font-Poppins text-base md:text-xl">
              Check In
            </span>
          )}
        </Button>
        {/* First Modal - Late Check-in Confirmation */}
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isDismissable={true}
          placement="center"
          isKeyboardDismissDisabled={false}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  <div className="flex flex-col justify-center items-center py-4">
                    <span>You are currently checking in late.</span> <br />
                    <span>Do you want to Check in late?</span>
                  </div>
                  <div className="flex justify-center gap-4 py-2">
                    <Button
                      onPress={handleLateCheckInConfirm}
                      className="text-white bg-black">
                      Yes
                    </Button>
                    <Button onPress={onClose}>No</Button>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
        {/* Second Modal - Additional Information for Late Check-in */}
        <Modal
          isOpen={isSecondModalOpen}
          onOpenChange={onOpenChangeSecondModal}
          isDismissable={true}
          placement="center"
          isKeyboardDismissDisabled={false}>
          <ModalContent>
            {() => (
              <>
                <ModalBody className="py-4">
                  <div className="text-center font-medium text-lg py-2">
                    Please provide a reason for your late check-in
                  </div>
                  <form onSubmit={handleSubmit(handleSecondModalConfirm)}>
                    <TextAreaComp
                      control={control}
                      name="reason"
                      label="Reason"
                      rules={{
                        required: "reason is required",
                        minLength: {
                          value: 10,
                          message:
                            "Reason must be at least 10 characters long.",
                        },
                      }}
                    />
                    <div className="flex justify-center gap-4 mt-4">
                      <Button className="text-white bg-black" type="submit">
                        Submit
                      </Button>
                      <Button onPress={closeRejectModal} className="px-8">
                        Cancel
                      </Button>
                    </div>
                  </form>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default CheckIn;
