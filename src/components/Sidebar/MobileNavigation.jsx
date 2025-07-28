import { MdDashboard, MdMapsHomeWork } from "react-icons/md";
import { IoAlarm } from "react-icons/io5";
import { FcLeave, FcDepartment } from "react-icons/fc";
import { BiData } from "react-icons/bi";
import { IoIosPeople } from "react-icons/io";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsArrowReturnRight } from "react-icons/bs";
import { toast } from "sonner";
import { LuMapPinCheckInside } from "react-icons/lu";
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
  Tooltip,
} from "@heroui/react";

import { useNavigate } from "react-router-dom";
import { CiLogout, CiMenuBurger } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import axiosInstance from "../../lib/axios-Instance";
import getInitials from "../../utils/getInitials";
import {
  hasReadAccess,
  hasUpdateAccess,
  hasViewSingleAccess,
  MENU_NAMES,
} from "../../utils/permissionUtils.js";
import truncateText from "../../utils/truncateText.js";
import { useLogout } from "../../hooks/useAuth.js";
import { ThemeSwitcher } from "../../components/ThemeSwitcher.jsx";
const MobileNavigation = () => {
  const [imageURL, setImageURL] = useState("");
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const username = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");
  const logoutMutation = useLogout();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [expandedDropdown, setExpandedDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const seeEmployee = hasReadAccess(MENU_NAMES.EMPLOYEES);

  const seeDashboard = true;

  const seeDepartment = hasReadAccess(MENU_NAMES.DEPARTMENT);
  /**To check Position see status */
  const seePosition = hasReadAccess(MENU_NAMES.POSITION);
  const seeRole = hasReadAccess(MENU_NAMES.ROLES);
  const seeMasterData = hasViewSingleAccess(MENU_NAMES.MASTERDATA);
  const seeAttendance = hasViewSingleAccess(MENU_NAMES.ATTENDANCE);
  // const seeAttendance = true;

  const seeMyAttendance = hasReadAccess(MENU_NAMES.MYATTENDANCE);
  const seeLateCheckIn = hasReadAccess(MENU_NAMES.LATECHECKIN);
  const seeHandbook = hasReadAccess(MENU_NAMES.HANDBOOK);

  const seeNotices = hasReadAccess(MENU_NAMES.NOTICE);
  const seeLeave = hasViewSingleAccess(MENU_NAMES.LEAVE);

  const seeLeaveStatus = hasReadAccess(MENU_NAMES.LEAVESTATUS);
  const seeLeaveRequest = hasReadAccess(MENU_NAMES.LEAVEREQUEST);
  const seeEKYE = hasReadAccess(MENU_NAMES.EKYE);

  const seeWorkFromHome = hasViewSingleAccess(MENU_NAMES.WORKFROMHOME);

  const seeWorkFromHomeAdmin = hasUpdateAccess(MENU_NAMES.WORKFROMHOME);
  const seeTeamLateCheckIn = hasUpdateAccess(MENU_NAMES.WORKFROMHOME);

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
        {
          icon: LuMapPinCheckInside,
          label: "Team Lead Late Checkin ",
          to: "/attendance/teamLead",
          view: seeTeamLateCheckIn,
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

  const handleLogOut = () => {
    logoutMutation.mutate();
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

  return (
    <>
      <div className="flex justify-between gap-6 px-2 mt-1 h-12 w-full mx-1 rounded-full  shadow-lg">
        <div className="flex justify-center items-center">
          <button
            onClick={onOpen}
            className="p-2 rounded-lg hover:bg-gray-600 transition">
            {isOpen ? <RxCross2 size={24} /> : <CiMenuBurger size={24} />}
          </button>
        </div>
        <Tooltip content={email}>
          <Link to="/settings">
            <div className="h-12 w-12">
              <Avatar
                className="h-full w-full object-cover"
                showFallback
                fallback={
                  <div className="flex items-center justify-center h-full w-full  dark:bg-gray-700 text-black dark:text-white text-2xl">
                    {getInitials(username)}
                  </div>
                }
                src={imageURL}
              />
            </div>
          </Link>
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
              <DrawerHeader className="flex justify-between mr-8 gap-1">
                RCL HRIMS
                <ThemeSwitcher />
              </DrawerHeader>

              <div className="flex items-center gap-4 ml-4">
                <div className="h-12 w-12">
                  <Avatar
                    className="h-full w-full object-cover"
                    showFallback
                    fallback={
                      <div className="flex items-center justify-center h-full w-full  dark:bg-gray-700 text-black dark:text-white text-2xl">
                        {getInitials(username)}
                      </div>
                    }
                    src={imageURL}
                  />
                </div>

                <div>
                  <p className="text-sm">
                    <Tooltip content={email}>{truncateText(email, 20)}</Tooltip>
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
