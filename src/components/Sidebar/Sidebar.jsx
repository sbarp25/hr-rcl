import Logo from "../../assets/Images/Logo.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdDashboard, MdMapsHomeWork } from "react-icons/md";
import { IoAlarm, IoLogOutOutline, IoLogOutSharp } from "react-icons/io5";
import { FcLeave, FcDepartment } from "react-icons/fc";
import { FaBookBookmark, FaNewspaper } from "react-icons/fa6";
import { GoGear } from "react-icons/go";
import { BiData } from "react-icons/bi";
import { IoIosPeople } from "react-icons/io";
import { Link } from "react-router-dom";
import { Avatar } from "@heroui/avatar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BsArrowReturnRight } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
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
  hasReadAccess,
  hasUpdateAccess,
  hasViewSingleAccess,
  MENU_NAMES,
} from "../../utils/permissionUtils.js";

const Sidebar = () => {
  const [imageURL, setImageURL] = useState("");
  const username = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [expandedDropdown, setExpandedDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();
  const menu = LocalStorageUtil.getItem("menu");

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
        // { label: "Auto CheckOut", to: "/Attendance", view: seeMyAttendance },
        {
          icon: LuMapPinCheckInside,
          label: "Late Checkin ",
          to: "/Attendance/Request",
          view: seeLateCheckIn,
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

    // {
    //   icon: IoIosPeople,
    //   label: "Auto-Checkout",
    //   to: "/selfAutoCheckOut",
    //   view: true,
    // },
  ];

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

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
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
              <Link to="/dashboard">
                <img src={Logo} className="w-32" alt="Logo" />
              </Link>
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
                    {/* {location.pathname === service.to && <BsArrowReturnRight />} */}
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
                    onPress={() => handleLogOut()}>
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
