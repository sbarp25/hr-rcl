import { useEffect, useState } from "react";
import LocalStorageUtil from "../utils/LocalStorageUtil";
import { getIpAddress } from "../utils/getIpAddress";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios-Instance";
import { MdRadioButtonChecked } from "react-icons/md";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import Loader from "./Loader";
import TextAreaComp from "./TextAreaComp";

const CheckIn = ({ checkedInStatus }) => {
  const [isloading, setIsloading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isSecondModalOpen,
    onOpen: onOpenSecondModal,
    onOpenChange: onOpenChangeSecondModal,
  } = useDisclosure();

  const latitude = LocalStorageUtil.getItem("latitude");
  const longitude = LocalStorageUtil.getItem("longitude");

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const getMaxRows = () => {
    if (screenWidth >= 1536) return 12; // 2xl
    if (screenWidth >= 1280) return 10; // xl
    if (screenWidth >= 1024) return 8; // lg
    if (screenWidth >= 768) return 6; // md
    return 4; // default for smaller screens
  };

  const getRows = () => {
    if (screenWidth >= 1536) return 10; // 2xl
    if (screenWidth >= 1280) return 8; // xl
    if (screenWidth >= 1024) return 6; // lg
    if (screenWidth >= 768) return 4; // md
    return 4; // default for smaller screens
  };

  const lateCheckinCheck = () => {
    onOpen();
  };
  const handleLateCheckInConfirm = () => {
    // Close the first modal
    onOpenChange(false);

    // Open the second modal
    onOpenSecondModal();
  };
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
          isStudent: false,
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
        } else if (response.data.responseCode === "406") {
          lateCheckinCheck();
        } else {
          const errorMessage =
            response?.data?.error?.errorList?.[0]?.errorMessage;
          toast.error(errorMessage || "Check In Failed");
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
        } else {
          const error = response?.data?.error?.errorList?.[0]?.errorMessage;
          toast.error(error || "Check Out Failed");
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
        isStudent: false,
        justification: data.reason,
      },
    };
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
        onOpenChangeSecondModal(false); // Close the second modal
      } else {
        toast.error("Late Check In Failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isloading && <Loader />}
      <div className="flex justify-end ">
        {checkedInStatus ? (
          <MdRadioButtonChecked className="text-green-700 h-8 w-8 md:h-10 md:w-10" />
        ) : (
          <MdRadioButtonChecked className="text-red-700 h-8 w-8 md:h-10 md:w-10" />
        )}
        <Button
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
          // size="5xl"
          // placement="bottom"
          //  backdrop="blur">
          isDismissable={true}
          isKeyboardDismissDisabled={false}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  <div>
                    You are Currently Late do you want to Check in lates?
                  </div>
                  <div className="flex justify-center gap-4 py-2">
                    <Button onPress={handleLateCheckInConfirm}>Yes</Button>
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
          isKeyboardDismissDisabled={false}>
          <ModalContent>
            {(onClose) => (
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
                      <Button type="submit" color="primary" className="px-8">
                        Submit
                      </Button>
                      <Button
                        color="danger"
                        variant="light"
                        onPress={onClose}
                        className="px-8">
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

{
  /**Test Garnay wala function */
}

// import { useEffect, useState } from "react";
// import LocalStorageUtil from "../utils/LocalStorageUtil";
// import { getIpAddress } from "../utils/getIpAddress";
// import { toast } from "react-toastify";
// import axiosInstance from "../lib/axios-Instance";
// import { MdRadioButtonChecked } from "react-icons/md";
// import {
//   Button,
//   Modal,
//   ModalBody,
//   ModalContent,
//   useDisclosure,
//   Switch,
// } from "@nextui-org/react";
// import { Controller, useForm } from "react-hook-form";
// import { Textarea } from "@nextui-org/input";

// const simulateBackendResponse = (requestData, endpoint) => {
//   return new Promise((resolve) => {
//     // Simulate network delay
//     setTimeout(() => {
//       if (endpoint === "/api/attendance/check_in") {
//         // For testing purposes, we'll use the testMode to alternate between response codes
//         const simulateLateCheckIn =
//           localStorage.getItem("simulateLateCheckIn") === "true";

//         if (simulateLateCheckIn) {
//           // Simulate late check-in response
//           resolve({
//             data: {
//               responseCode: "199",
//               message: "You are late for check-in",
//             },
//           });
//         } else {
//           // Simulate successful check-in
//           resolve({
//             data: {
//               responseCode: "200",
//               message: "Check-in successful",
//             },
//           });
//         }
//       } else if (endpoint === "/api/attendance/check_out") {
//         // Always simulate successful check-out
//         resolve({
//           data: {
//             responseCode: "200",
//             message: "Check-out successful",
//           },
//         });
//       }
//     }, 500);
//   });
// };

// const CheckIn = () => {
//   const {
//     control,
//     formState: { errors },
//   } = useForm();

//   const { isOpen, onOpen, onOpenChange } = useDisclosure();
//   const {
//     isOpen: isSecondModalOpen,
//     onOpen: onOpenSecondModal,
//     onOpenChange: onOpenChangeSecondModal,
//   } = useDisclosure();
//   const [isCheckedIn, setIsCheckedIn] = useState(false);
//   const [testMode, setTestMode] = useState(
//     localStorage.getItem("simulateLateCheckIn") === "true"
//   );
//   const [reason, setReason] = useState("");

//   // Set default values for latitude and longitude if not in LocalStorage
//   if (!LocalStorageUtil.getItem("latitude")) {
//     LocalStorageUtil.setItem("latitude", "12.9716");
//   }
//   if (!LocalStorageUtil.getItem("longitude")) {
//     LocalStorageUtil.setItem("longitude", "77.5946");
//   }

//   const latitude = LocalStorageUtil.getItem("latitude");
//   const longitude = LocalStorageUtil.getItem("longitude");

//   const checkedInStatus = localStorage.getItem("CheckinStatus");

//   useEffect(() => {
//     const checkIn = () => {
//       if (checkedInStatus === "true") {
//         setIsCheckedIn(true);
//       } else {
//         setIsCheckedIn(false);
//       }
//     };
//     const interval = setInterval(() => {
//       checkIn();
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [checkedInStatus]);

//   useEffect(() => {
//     // Update localStorage when testMode changes
//     localStorage.setItem("simulateLateCheckIn", testMode);
//   }, [testMode]);

//   const lateCheckinCheck = () => {
//     onOpen();
//   };

//   const handleLateCheckInConfirm = () => {
//     // Close the first modal
//     onOpenChange(false);

//     // Open the second modal
//     onOpenSecondModal();
//   };

//   const handleAttendance = async () => {
//     let ipAddress = "192.168.1.1"; // Default dummy IP

//     try {
//       // Try to get real IP if getIpAddress is available
//       ipAddress = await getIpAddress();
//     } catch (error) {
//       console.log("Using dummy IP address for testing");
//     }

//     if (!isCheckedIn) {
//       const requestData = {
//         data: {
//           requestLat: latitude,
//           requestLong: longitude,
//           requestDevice: "Mobile",
//           checkInType: "office",
//           requestIp: ipAddress,
//           isStudent: false,
//         },
//       };

//       try {
//         // Use real API in production or simulated response in test
//         let response;
//         if (process.env.NODE_ENV === "development" || true) {
//           // Force test mode for now
//           response = await simulateBackendResponse(
//             requestData,
//             "/api/attendance/check_in"
//           );
//         } else {
//           response = await axiosInstance.post(
//             "/api/attendance/check_in",
//             requestData,
//             {
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//         }

//         if (response.data.responseCode === "200") {
//           toast.success(response?.data?.message || "Checked in successfully!");
//           localStorage.setItem("CheckinStatus", "true");
//           setIsCheckedIn(true);
//         } else if (response.data.responseCode === "199") {
//           lateCheckinCheck();
//         } else {
//           const errorMessage =
//             response?.data?.error?.errorList?.[0]?.errorMessage;
//           toast.error(errorMessage || "Check In Failed");
//         }
//       } catch (error) {
//         const errorMessage = error?.data?.error?.errorList?.[0]?.errorMessage;
//         toast.error(errorMessage || "Check In Failed");
//       }
//     } else {
//       const requestData = {
//         data: {
//           requestLat: latitude,
//           requestLong: longitude,
//           requestIp: ipAddress,
//         },
//       };

//       try {
//         // Use real API in production or simulated response in test
//         let response;
//         if (process.env.NODE_ENV === "development" || true) {
//           // Force test mode for now
//           response = await simulateBackendResponse(
//             requestData,
//             "/api/attendance/check_out"
//           );
//         } else {
//           response = await axiosInstance.post(
//             "/api/attendance/check_out",
//             requestData,
//             {
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//         }

//         if (response?.data?.responseCode === "200") {
//           toast.success("Checked out successfully!");
//           localStorage.setItem("CheckinStatus", "false");
//           setIsCheckedIn(false);
//         } else {
//           const error = response?.data?.error?.errorList?.[0]?.errorMessage;
//           toast.error(error || "Check Out Failed");
//         }
//       } catch (error) {
//         console.error("Error during checkout", error);
//         toast.error("Check Out Failed");
//       }
//     }
//   };

//   const handleSecondModalConfirm = async () => {
//     let ipAddress = "192.168.1.1"; // Default dummy IP

//     try {
//       // Try to get real IP if getIpAddress is available
//       ipAddress = await getIpAddress();
//     } catch (error) {
//       console.log("Using dummy IP address for testing");
//     }

//     const requestData = {
//       data: {
//         requestLat: latitude,
//         requestLong: longitude,
//         requestDevice: "Mobile",
//         checkInType: "office",
//         requestIp: ipAddress,
//         isStudent: false,
//         confirmLateCheckIn: true,
//         reason: reason,
//       },
//     };

//     try {
//       // Always succeed late check-in in test mode
//       toast.success("Late check-in processed successfully!");
//       localStorage.setItem("CheckinStatus", "true");
//       setIsCheckedIn(true);
//       onOpenChangeSecondModal(false); // Close the second modal
//       setReason(""); // Clear the reason field
//     } catch (error) {
//       toast.error("Late Check In Failed");
//     }
//   };

//   return (
//     <div className="flex flex-col items-end">
//       {/* Test Mode Toggle */}
//       <div className="flex items-center gap-2 mb-4 self-end">
//         <span className="text-sm">Simulate Late Check-in:</span>
//         <Switch isSelected={testMode} onValueChange={setTestMode} size="sm" />
//       </div>

//       {/* Check-in Button Area */}
//       <div className="flex items-center">
//         {isCheckedIn ? (
//           <MdRadioButtonChecked className="text-green-700 h-8 w-8 md:h-10 md:w-10" />
//         ) : (
//           <MdRadioButtonChecked className="text-red-700 h-8 w-8 md:h-10 md:w-10" />
//         )}
//         <Button
//           onPress={handleAttendance}
//           className="button bg-bgprimary hover:bg-hoverbackground text-white py-2 tracking-normal">
//           {isCheckedIn ? (
//             <span className="text-white font-Poppins text-base md:text-xl">
//               Check Out
//             </span>
//           ) : (
//             <span className="text-white font-Poppins text-base md:text-xl">
//               Check In
//             </span>
//           )}
//         </Button>
//       </div>

//       {/* First Modal - Late Check-in Confirmation */}
//       <Modal
//         isOpen={isOpen}
//         onOpenChange={onOpenChange}
//         isDismissable={true}
//         isKeyboardDismissDisabled={false}>
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalBody className="py-4">
//                 <div className="text-center font-medium py-4">
//                   You are Currently Late. Do you want to Check in late?
//                 </div>
//                 <div className="flex justify-center gap-4 py-2">
//                   <Button onPress={handleLateCheckInConfirm} color="primary">
//                     Yes
//                   </Button>
//                   <Button onPress={onClose} color="danger" variant="light">
//                     No
//                   </Button>
//                 </div>
//               </ModalBody>
//             </>
//           )}
//         </ModalContent>
//       </Modal>

//       {/* Second Modal - Additional Information for Late Check-in */}
//       <Modal
//         isOpen={isSecondModalOpen}
//         onOpenChange={onOpenChangeSecondModal}
//         isDismissable={true}
//         isKeyboardDismissDisabled={false}>
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalBody className="py-4">
//                 <div className="text-center font-medium text-lg py-2">
//                   Please provide a reason for your late check-in
//                 </div>
//                 <div>
//                   <Controller
//                     name="reason"
//                     control={control}
//                     rules={{
//                       required: "reason is required",
//                       minLength: {
//                         value: 10,
//                         message: "reason must be at least 10 characters long.",
//                       },
//                     }}
//                     render={({ field }) => (
//                       <Textarea
//                         {...field}
//                         // minRows={getRows()}
//                         // maxRows={getMaxRows()}
//                         isInvalid={!!errors.reason}
//                         className="rounded-xl"
//                         label="Reason For Late Check In"
//                         variant="bordered"
//                       />
//                     )}
//                   />
//                   {errors.reason && (
//                     <p className="text-danger text-sm">
//                       {errors.reason.message}
//                     </p>
//                   )}
//                 </div>
//                 <div className="flex justify-center gap-4 mt-4">
//                   <Button
//                     color="primary"
//                     onPress={handleSecondModalConfirm}
//                     className="px-8"
//                     isDisabled={!reason.trim()}>
//                     Submit
//                   </Button>
//                   <Button
//                     color="danger"
//                     variant="light"
//                     onPress={onClose}
//                     className="px-8">
//                     Cancel
//                   </Button>
//                 </div>
//               </ModalBody>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// };

// export default CheckIn;
