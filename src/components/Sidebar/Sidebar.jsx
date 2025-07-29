import Logo from "../../assets/Images/Logo.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdDashboard, MdMapsHomeWork } from "react-icons/md";
import { IoAlarm, IoLogOutOutline } from "react-icons/io5";
import { FcLeave, FcDepartment } from "react-icons/fc";
import { GoGear } from "react-icons/go";
import { BiData } from "react-icons/bi";
import { IoIosPeople } from "react-icons/io";
import { Link } from "react-router-dom";
import { Avatar } from "@heroui/avatar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BsArrowReturnRight } from "react-icons/bs";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LocalStorageUtil from "../../utils/LocalStorageUtil";
import axiosInstance from "../../lib/axios-Instance";
import getInitials from "../../utils/getInitials";
import { TbScanPosition } from "react-icons/tb";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { GrStatusGoodSmall } from "react-icons/gr";
import { LuMapPinCheckInside } from "react-icons/lu";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import truncateText from "../../utils/truncateText";
import Loader from "../Loader/Loader.jsx";
import {
  hasApproveAccess,
  hasReadAccess,
  hasUpdateAccess,
  hasViewSingleAccess,
  MENU_NAMES,
  permissionManager,
} from "../../utils/permissionUtils.js";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../../api/auth.js";
import { useLogout } from "../../hooks/useAuth.js";
import { ThemeSwitcher } from "../ThemeSwitcher.jsx";

const Sidebar = () => {
  const [imageURL, setImageURL] = useState("");
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);
  const username = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [expandedDropdown, setExpandedDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  // Force re-evaluation of permissions
  const [, forceUpdate] = useState({});
  const triggerRerender = () => forceUpdate({});

  // Check if permissions are loaded
  useEffect(() => {
    const checkPermissions = () => {
      const menu = LocalStorageUtil.getItem("menu");
      // Check if menu exists in localStorage
      if (menu !== null && menu !== undefined) {
        setPermissionsLoaded(true);
        permissionManager.refresh(); // Refresh the permission manager
        triggerRerender();
      } else {
        // If permissions not loaded, check again after a short delay
        setTimeout(checkPermissions, 100);
      }
    };

    checkPermissions();
  }, []);

  // Listen for localStorage changes (useful if menu data is set after component mounts)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "menu" && e.newValue !== null) {
        permissionManager.refresh();
        setPermissionsLoaded(true);
        triggerRerender();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Get permission values (will be recalculated when component re-renders)
  const seeEmployee = permissionsLoaded
    ? hasReadAccess(MENU_NAMES.EMPLOYEES)
    : false;
  const seeDashboard = true; // Dashboard is always visible
  const seeDepartment = permissionsLoaded
    ? hasReadAccess(MENU_NAMES.DEPARTMENT)
    : false;
  const seePosition = permissionsLoaded
    ? hasReadAccess(MENU_NAMES.POSITION)
    : false;
  const seeRole = permissionsLoaded ? hasReadAccess(MENU_NAMES.ROLES) : false;
  const seeMasterData = permissionsLoaded
    ? hasViewSingleAccess(MENU_NAMES.MASTERDATA)
    : false;
  const seeAttendance = permissionsLoaded
    ? hasViewSingleAccess(MENU_NAMES.ATTENDANCE)
    : false;
  const seeMyAttendance = permissionsLoaded
    ? hasReadAccess(MENU_NAMES.MYATTENDANCE)
    : false;
  const seeLateCheckIn = permissionsLoaded
    ? hasReadAccess(MENU_NAMES.LATECHECKIN)
    : false;
  const seeTeamLateCheckIn = permissionsLoaded
    ? hasApproveAccess(MENU_NAMES.LATECHECKIN)
    : false;
  const seeHandbook = permissionsLoaded
    ? hasReadAccess(MENU_NAMES.HANDBOOK)
    : false;
  const seeNotices = permissionsLoaded
    ? hasReadAccess(MENU_NAMES.NOTICE)
    : false;
  const seeLeave = permissionsLoaded
    ? hasViewSingleAccess(MENU_NAMES.LEAVE)
    : false;
  const seeLeaveStatus = permissionsLoaded
    ? hasReadAccess(MENU_NAMES.LEAVESTATUS)
    : false;
  const seeLeaveRequest = permissionsLoaded
    ? hasReadAccess(MENU_NAMES.LEAVEREQUEST)
    : false;
  const seeEKYE = permissionsLoaded ? hasReadAccess(MENU_NAMES.EKYE) : false;
  const seeWorkFromHome = permissionsLoaded
    ? hasViewSingleAccess(MENU_NAMES.WORKFROMHOME)
    : false;
  const seeWorkFromHomeAdmin = permissionsLoaded
    ? hasUpdateAccess(MENU_NAMES.WORKFROMHOME)
    : false;

  const navbarElements = [
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
        {
          icon: IoIosPeople,
          label: "Auto-Checkout",
          to: "/autoCheckOut",
          view: true,
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
    {
      icon: FcLeave,
      label: "Leave",
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
          // view: seeWorkFromHome && seeWorkFromHomeAdmin,
          view: true,
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

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const toggleDropdown = (index) => {
    setExpandedDropdown(expandedDropdown === index ? null : index);
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
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
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

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Show loading state only if menu hasn't been checked yet (null/undefined)
  if (!permissionsLoaded) {
    return (
      <div className="flex h-screen bg-black">
        <div className="w-20 h-full bg-black text-white flex flex-col">
          <div className="flex items-center gap-4 p-4 flex-shrink-0">
            <GiHamburgerMenu className="text-2xl cursor-pointer" />
          </div>
          <div className="flex-grow flex items-center justify-center">
            <div className="text-white text-sm">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {isLoading && <Loader />}
      <div className="flex h-screen bg-black">
        <div
          className={` h-full sticky top-0 bg-black text-white flex flex-col transition-all duration-300 ${
            isSidebarExpanded ? "w-64" : "w-20"
          }`}>
          {/* Hamburger menu */}
          <div className="flex items-center gap-4 p-4 flex-shrink-0">
            <GiHamburgerMenu
              className="text-2xl cursor-pointer"
              onClick={toggleSidebar}
            />
            {isSidebarExpanded && (
              <>
                <Link to="/dashboard">
                  <img src={Logo} className="w-32" alt="Logo" />
                </Link>
                <ThemeSwitcher />
              </>
            )}
          </div>

          {/* Navigation items */}
          <div className="flex-grow overflow-y-auto">
            {navbarElements.map((service, index) => {
              if (!service.view) return null;
              return (
                <div key={index} className="relative">
                  <Link
                    to={service.to}
                    className={`flex items-center gap-4 p-3  rounded-lg cursor-pointer transition-all duration-300 ${
                      location.pathname === service.to
                        ? "bg-active text-white border-l-4 border-l-red-800"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => service.children && toggleDropdown(index)}>
                    <service.icon className="text-2xl" />
                    {isSidebarExpanded && (
                      <span className="text-base">{service.label}</span>
                    )}
                  </Link>
                  {/* Dropdown items */}
                  {service.children && expandedDropdown === index && (
                    <div
                      className={`pl-8 mt-2 space-y-2 bg-slate-600 overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedDropdown === index
                          ? "max-h-96 opacity-100 mt-2"
                          : "max-h-0 opacity-0"
                      }`}>
                      {service.children.map((child, childIndex) => {
                        if (!child?.view) return null;
                        return (
                          <Link
                            key={childIndex}
                            to={child.to}
                            className={`flex p-2 rounded-lg transition-all duration-300 gap-4  ${
                              location.pathname === child.to
                                ? "bg-active text-white border-l-4 border-l-red-800"
                                : "hover:bg-gray-600"
                            }`}>
                            {location.pathname === child.to &&
                              isSidebarExpanded && (
                                <BsArrowReturnRight className="mt-1 " />
                              )}
                            {isSidebarExpanded ? (
                              <span className="text-base">{child.label}</span>
                            ) : (
                              <child.icon className="text-2xl" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Profile section */}
          <div className="p-4 flex-shrink-0">
            <div className="flex items-center gap-4">
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

              {isSidebarExpanded && (
                <Link to="/settings" className="flex-grow min-w-0">
                  <div>
                    <p className="text-xl">
                      <Tooltip content={username}>
                        {truncateText(username, 7)}
                      </Tooltip>
                    </p>
                    <p className="text-sm" title={email}>
                      <Tooltip content={email}>
                        {truncateText(email, 10)}
                      </Tooltip>
                    </p>
                  </div>
                </Link>
              )}
              {isSidebarExpanded && (
                <div className="flex items-center gap-x-2">
                  <Link to="/settings">
                    <GoGear className="text-2xl" />
                  </Link>
                  <button className="">
                    <IoLogOutOutline
                      onClick={onOpen}
                      className="text-2xl text-red-500  hover:scale-125"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={true}
        isKeyboardDismissDisabled={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="text-center">
                <p>Are you sure you want to Log out ?</p>
                <div className="flex gap-2 justify-end mt-4 ">
                  <Button
                    className="bg-black text-white"
                    onPress={handleLogout}>
                    Log Out
                  </Button>
                  <Button onPress={onClose}>Cancel</Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Sidebar;
