import { MdDashboard } from "react-icons/md";
import { IoAlarm } from "react-icons/io5";
import { FcLeave } from "react-icons/fc";
import { FaBookBookmark, FaNewspaper } from "react-icons/fa6";
import { BiData } from "react-icons/bi";
import { IoIosPeople } from "react-icons/io";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BsArrowReturnRight } from "react-icons/bs";
import { toast } from "react-toastify";
import axios from "axios";

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
import CheckIn from "./CheckIn";
import LocalStorageUtil from "../utils/LocalStorageUtil";
import axiosInstance from "../lib/axios-Instance";
import getInitials from "../utils/getInitials";

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

  /**To check Employee see status */
  const seeEmployee = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 2)
  );
  /**To check Dashboard see status */
  const seeDashboard = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 6)
  );
  /**To check Department see status */
  const seeDepartment = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 10)
  );
  /**To check Position see status */
  const seePosition = menu?.some((menu) =>
    menu.actionList?.some((action) => action.actionId === 14)
  );
  const seeRole = menu?.some((menu) =>
    menu.actionList?.some((action) => action.actionId === 52)
  );
  const seeAttendance = menu?.some((menu) =>
    menu.actionList?.some((action) => action.actionId === 14)
  );
  const seeHandbook = menu?.some((menu) =>
    menu.actionList?.some((action) => action.actionId === 14)
  );
  const seeNotices = menu?.some((menu) =>
    menu.actionList?.some((action) => action.actionId === 14)
  );
  const seeLeave = menu?.some((menu) =>
    menu.actionList?.some((action) => action.actionId === 14)
  );

  const navbarElements = [
    // { icon: MdDashboard, label: "Dashboard", to: "/", view: seeDashboard },
    { icon: MdDashboard, label: "Dashboard", to: "/dashboard", view: true },
    {
      icon: IoAlarm,
      label: "Attendance",
      view: true,
      children: [
        { label: "My Attendence", to: "/Attendance", view: true },
        { label: "Late Checkin ", to: "/Attendance/Request", view: true },
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
      view: true,
      children: [
        {
          label: "Department",
          to: "/master-data/Department",
          view: seeDepartment,
        },
        { label: "Position", to: "/master-data/Position", view: seePosition },
        { label: "Roles", to: "/master-data/Roles", view: seeRole },
      ],
    },
    { icon: FaBookBookmark, label: "HandBook", to: "/handbook", view: true },
    { icon: FaNewspaper, label: "Notice", to: "/notice", view: true },
    {
      icon: FcLeave,
      label: "Leave",
      view: true,
      children: [
        { label: "Leave Status", to: "/Leave/Status", view: true },
        { label: "Leave Request", to: "/Leave/Request", view: true },
      ],
    },
    // {
    //   icon: FcLeave,
    //   label: "Salary",
    //   view: true,
    //   children: [
    //     { label: "Salary Details", to: "/Salary", view: true },
    //     { label: "Salary Breakdown", to: "/salaryEdit", view: true },
    //     { label: "Advance", to: "/AdvanceSalary", view: true },
    //   ],
    // },

    {
      icon: IoIosPeople,
      label: "Ekye",
      to: "/AdminEkye",
      view: true,
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
      console.error("Error Logging out", error);
      toast.error(error.response?.data?.message);
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
      console.log(errorMessage);
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
          <Input
            isClearable
            className="max-w-full  mt-2"
            placeholder="Search in emails"
            radius="lg"
            variant="underlined"
          />
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
                RCL Mail
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
                <button>
                  <CheckIn />
                </button>
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
