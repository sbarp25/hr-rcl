import { MdDashboard, MdMapsHomeWork } from "react-icons/md";
import { IoAlarm } from "react-icons/io5";
import { FcLeave, FcDepartment } from "react-icons/fc";
import { FaBookBookmark, FaNewspaper } from "react-icons/fa6";
import { BiData } from "react-icons/bi";
import { IoIosPeople } from "react-icons/io";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BsArrowReturnRight } from "react-icons/bs";
import { toast } from "sonner";
import { LuMapPinCheckInside } from "react-icons/lu";
import axios from "axios";
import { GrStatusGoodSmall } from "react-icons/gr";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { TbScanPosition } from "react-icons/tb";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Avatar,
  Input,
  Tooltip,
} from "@nextui-org/react";

import { useNavigate } from "react-router-dom";
import { CiLogout, CiMenuBurger } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import CheckIn from "../Dashboard/CheckIn.jsx";
import LocalStorageUtil from "../../utils/LocalStorageUtil";
import axiosInstance from "../../lib/axios-Instance";
import getInitials from "../../utils/getInitials";

const MobileNavigation = () => {
  const [imageURL, setImageURL] = useState("");
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const username = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [expandedDropdown, setExpandedDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const menu = LocalStorageUtil.getItem("menu");

  const seeEmployee = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 10)
  );
  /**To check Dashboard see status */
  // const seeDashboard = menu?.some((menu) =>
  //   menu?.actions?.some((action) => action.actionId === 2)
  // );
  const seeDashboard = true;
  /**To check Department see status */
  const seeDepartment = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 44)
  );
  /**To check Position see status */
  const seePosition = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 48)
  );
  const seeRole = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 52)
  );
  const seeMasterData = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 14)
  );
  const seeAttendance = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 6)
  );
  const seeMyAttendance = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 36)
  );
  const seeLateCheckIn = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 40)
  );
  const seeHandbook = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 20)
  );
  const seeNotices = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 24)
  );
  const seeLeave = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 28)
  );

  const seeLeaveStatus = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 56)
  );
  const seeLeaveRequest = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 60)
  );
  const seeEKYE = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 32)
  );
  const seeWorkFromHome = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 80)
  );
  const seeWorkFromHomeAdmin = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 81)
  );
  const navbarElements = [
    // { icon: MdDashboard, label: "Dashboard", to: "/", view: seeDashboard },
    {
      icon: MdDashboard,
      label: "Dashboard",
      to: "/dashboard",
      view: seeDashboard,
    },
    {
      icon: IoAlarm,
      label: "Attendance",
      view: seeAttendance,
      children: [
        // { label: "My Attendence", to: "/Attendance", view: seeMyAttendance },
        {
          icon: LuMapPinCheckInside,
          label: "Late Checkin ",
          to: "/Attendance/Request",
          view: seeLateCheckIn,
        },
      ],
    },
    {
      icon: IoIosPeople,
      label: "Employees",
      to: "/Employees",
      view: seeEmployee,
    },

    {
      icon: BiData,
      label: "Master Data",
      view: seeMasterData,
      children: [
        {
          icon: FcDepartment,
          label: "Department",
          to: "/master-data/Department",
          view: seeDepartment,
        },
        {
          icon: TbScanPosition,
          label: "Position",
          to: "/master-data/Position",
          view: seePosition,
        },
        {
          icon: FcDepartment,
          label: "Roles",
          to: "/master-data/Roles",
          view: seeRole,
        },
      ],
    },
    // {
    //   icon: FaBookBookmark,
    //   label: "HandBook",
    //   to: "/handbook",
    //   view: seeHandbook,
    // },
    // { icon: FaNewspaper, label: "Notice", to: "/notice", view: seeNotices },
    {
      icon: FcLeave,
      label: "Leave",
      // view: seeLeave,
      view: seeLeave,
      children: [
        {
          icon: GrStatusGoodSmall,
          label: "Leave Status",
          to: "/Leave/Status",
          view: seeLeaveStatus,
        },
        {
          icon: VscGitPullRequestNewChanges,
          label: "Leave Request",
          to: "/Leave/Request",
          view: seeLeaveRequest,
        },
      ],
    },
    {
      icon: MdMapsHomeWork,
      label: "Work From Home",
      view: seeWorkFromHome,
      children: [
        {
          icon: GrStatusGoodSmall,
          label: "WFH Status",
          to: "/WFH/Status",
          view: seeWorkFromHome && seeWorkFromHomeAdmin,
        },
        {
          icon: VscGitPullRequestNewChanges,
          label: "WFH Request",
          to: "/WFH",
          view: true,
        },
      ],
    },
    {
      icon: IoIosPeople,
      label: "Ekye",
      to: "/AdminEkye",
      view: seeEKYE,
    },
  ];

  const toggleDropdown = (index) => {
    setExpandedDropdown(expandedDropdown === index ? null : index);
  };

  const handleLogOut = async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      const newData = {
        data: {
          jwtToken: accessToken,
        },
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/logout`,
        newData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.responseCode === "200") {
        toast.success(response.data.message);
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      setIsLoading(true);
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const fetchProfilephoto = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        "/api/v1/profilePicture/getById"
      );
      if (response.data.responseCode === "200") {
        setImageURL(response.data.data?.profilePicture);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfilephoto();
  }, []);

  const handleProfileChange = () => {
    navigate("/settings");
  };
  return (
    <>
      <div className="flex justify-between gap-6 px-2 mt-1 h-12 w-full mx-1 rounded-full bg-gray-300 shadow-lg">
        <div className="flex justify-center items-center">
          <button
            onClick={onOpen}
            className="p-2 rounded-lg hover:bg-gray-600 transition">
            {isOpen ? <RxCross2 size={24} /> : <CiMenuBurger size={24} />}
          </button>
        </div>
        <Tooltip content={email}>
          <div
            className="h-10 w-10 overflow-hidden rounded-full"
            onClick={handleProfileChange}>
            {imageURL ? (
              <Avatar className="h-full w-full object-cover" src={imageURL} />
            ) : (
              <div className="flex rounded-full items-center justify-center h-full w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-lg font-medium">
                {getInitials(username)}
              </div>
            )}
          </div>
        </Tooltip>
      </div>

      <Drawer
        isOpen={isOpen}
        size="xs"
        onOpenChange={onOpenChange}
        placement="left">
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                RCL HRIMS
              </DrawerHeader>

              <div className="flex items-center gap-4 ml-4">
                <Avatar size="md" src={imageURL} />

                <div>
                  <p className="text-sm">
                    <Tooltip content={email}>{email}</Tooltip>
                  </p>
                </div>
              </div>
              <DrawerBody>
                {" "}
                <div className="flex-grow">
                  {navbarElements.map((service, index) => {
                    if (!service.view) return null;
                    return (
                      <div key={index} className="relative">
                        <div
                          className={`flex items-center gap-4 p-3 transition-colors rounded-lg cursor-pointer ${
                            location.pathname === service.to
                              ? "bg-active text-white border-l-4 border-l-red-800"
                              : "hover:bg-gray-700"
                          }`}
                          onClick={() => {
                            if (service.children) {
                              toggleDropdown(index);
                            } else {
                              handleNavigation(service.to);
                            }
                          }}>
                          {/* {location.pathname === service.to && <BsArrowReturnRight />} */}
                          <service.icon className="text-2xl" />
                          {isSidebarExpanded && (
                            <span className="text-base">{service.label}</span>
                          )}
                        </div>
                        {/* Dropdown items */}
                        {service.children && expandedDropdown === index && (
                          <div className="pl-8 mt-2 space-y-2">
                            {service.children.map((child, childIndex) => (
                              <div
                                onClick={() => handleNavigation(child.to)}
                                key={childIndex}
                                to={child.to}
                                className={`flex p-2 rounded-lg transition-colors gap-4 ${
                                  location.pathname === child.to
                                    ? "bg-active text-white border-l-4 border-l-red-800"
                                    : "hover:bg-gray-600"
                                }`}>
                                {location.pathname === child.to && (
                                  <BsArrowReturnRight className="mt-1 " />
                                )}
                                {child.label}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* <button>
                  <CheckIn />
                </button> */}
                <button className="">
                  <CiLogout
                    onClick={handleLogOut}
                    className="text-2xl text-red-500  hover:scale-125"
                  />
                </button>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileNavigation;
