import { useEffect, useState } from "react";
import Logo from "../../assets/Images/Logo.png";
import { MdDashboard } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowReturnRight } from "react-icons/bs";
import { Avatar } from "@heroui/avatar";
import axiosInstance from "../../lib/axios-Instance";
import { toast } from "sonner";
import { GoGear } from "react-icons/go";
import { CiLogout, CiMenuBurger } from "react-icons/ci";
import { CiBank } from "react-icons/ci";
import { IoShieldCheckmark } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";
import getInitials from "../../utils/getInitials";
import axios from "axios";
import LocalStorageUtil from "../../utils/LocalStorageUtil";
import truncateText from "../../utils/truncateText";
import CheckIn from "../Dashboard/CheckIn.jsx";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { RxCross2 } from "react-icons/rx";
import { useLogout } from "../../hooks/useAuth.js";
const UserMobileSidebar = () => {
  const [imageURL, setImageURL] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [expandedDropdown, setExpandedDropdown] = useState(null);
  const logoutMutation = useLogout();
  const username = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const seeProfile = true;

  const seeDashboard = true;
  const seeEKYE = true;
  const seeSecurity = true;
  const seeBank = true;
  const navbarElements = [
    {
      icon: MdDashboard,
      label: "Dashboard",
      to: "/dashboard",
      view: seeDashboard,
    },
    {
      icon: IoPersonSharp,
      label: "Profile",
      to: "/settings",
      view: seeProfile,
    },
    {
      icon: IoIosPeople,
      label: "My EKYE",
      to: "/settings/ViewEKYE",
      view: seeEKYE,
    },
    {
      icon: IoShieldCheckmark,
      label: "Security",
      to: "/settings/Change",
      view: seeSecurity,
    },
    {
      icon: CiBank,
      label: "Bank Details",
      to: "/Bank",
      view: seeBank,
    },
  ];
  const toggleDropdown = (index) => {
    setExpandedDropdown(expandedDropdown === index ? null : index);
  };

  const handleLogOut = () => {
    logoutMutation.mutate();
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
  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };
  const handleProfileChange = () => {
    navigate("/settings");
  };

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

export default UserMobileSidebar;
