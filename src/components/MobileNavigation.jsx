import Logo from "../assets/Images/Logo.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdDashboard } from "react-icons/md";
import { IoAlarm } from "react-icons/io5";
import { FcLeave } from "react-icons/fc";
import { FaBookBookmark, FaNewspaper } from "react-icons/fa6";
import { GoGear } from "react-icons/go";
import { BiData } from "react-icons/bi";
import { IoIosPeople } from "react-icons/io";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { BsArrowReturnRight } from "react-icons/bs";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../components/Loader";
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

import { Link, useNavigate } from "react-router-dom";
import { CiLogout, CiMenuBurger } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";

const MobileNavigation = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const username = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");

  const truncateText = (text, maxLength) =>
    text?.length > maxLength ? `${text?.slice(0, maxLength)}...` : text;

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [expandedDropdown, setExpandedDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const navbarElements = [
    { icon: MdDashboard, label: "Dashboard", to: "/" },
    {
      icon: IoAlarm,
      label: "Attendance",
      children: [
        { label: "My Attendence", to: "/Attendance" },
        // { label: "Request Attendence", to: "/Attendance/Request" },
      ],
    },
    {
      icon: IoIosPeople,
      label: "Employees",
      to: "/Employees",
    },
    {
      icon: BiData,
      label: "Master Data",
      children: [
        { label: "Department", to: "/master-data/Department" },
        { label: "Position", to: "/master-data/Position" },
        { label: "Roles", to: "/master-data/Roles" },
      ],
    },
    { icon: FaBookBookmark, label: "HandBook", to: "/handbook" },
    { icon: FaNewspaper, label: "Notice", to: "/notice" },
    {
      icon: FcLeave,
      label: "Leave",
      children: [
        { label: "Leave Status", to: "/Leave/Status" },
        { label: "Leave Request", to: "/Leave/Request" },
      ],
    },
    {
      icon: FcLeave,
      label: "Salary",
      children: [
        { label: "Salary Details", to: "/Salary" },
        { label: "Salary Breakdown", to: "/salaryEdit" },
        { label: "Advance", to: "/AdvanceSalary" },
      ],
    },

    {
      icon: IoIosPeople,
      label: "Ekye",
      to: "/AdminEkye",
    },
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
      setIsLoading(true);
      console.error("Error Logging out", error);
      toast.error(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between gap-6 px-2 mt-1 h-12 w-full mx-1 rounded-full bg-white shadow-lg">
        <div className="flex justify-center">
          <button
            onClick={onOpen}
            className="p-2 rounded-lg hover:bg-gray-600 transition">
            {isOpen ? <RxCross2 size={24} /> : <CiMenuBurger size={24} />}
          </button>
        </div>
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
                <Avatar
                  size="md"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />

                <div>
                  <p className="text-sm">
                    <Tooltip content={email}>{email}</Tooltip>
                  </p>
                </div>
              </div>
              <DrawerBody>
                {" "}
                <div className="flex-grow">
                  {navbarElements.map((service, index) => (
                    <div key={index} className="relative">
                      <Link
                        to={service.to}
                        className={`flex items-center gap-4 p-3 transition-colors rounded-lg cursor-pointer ${
                          location.pathname === service.to
                            ? "bg-active text-white border-l-4 border-l-red-800"
                            : "hover:bg-gray-700"
                        }`}
                        onClick={() =>
                          service.children && toggleDropdown(index)
                        }>
                        {/* {location.pathname === service.to && <BsArrowReturnRight />} */}
                        <service.icon className="text-2xl" />
                        {isSidebarExpanded && (
                          <span className="text-base">{service.label}</span>
                        )}
                      </Link>
                      {/* Dropdown items */}
                      {service.children && expandedDropdown === index && (
                        <div className="pl-8 mt-2 space-y-2">
                          {service.children.map((child, childIndex) => (
                            <Link
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
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
