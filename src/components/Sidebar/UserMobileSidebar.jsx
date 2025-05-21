import { useEffect, useState } from "react";
import Logo from "../../assets/Images/Logo.png";
import { MdDashboard } from "react-icons/md";
import Loader from "../Loader";
import { IoIosPeople } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowReturnRight } from "react-icons/bs";
import { Avatar } from "@nextui-org/avatar";
import axiosInstance from "../../lib/axios-Instance";
import { toast } from "react-toastify";
import { GoGear } from "react-icons/go";
import { CiLogout, CiMenuBurger } from "react-icons/ci";
import { CiBank } from "react-icons/ci";
import { IoShieldCheckmark } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";
import getInitials from "../../utils/getInitials";
import axios from "axios";
import LocalStorageUtil from "../../utils/LocalStorageUtil";
import truncateText from "../../utils/truncateText";
import CheckIn from "../CheckIn";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { RxCross2 } from "react-icons/rx";
const UserMobileSidebar = () => {
  const [imageURL, setImageURL] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [expandedDropdown, setExpandedDropdown] = useState(null);

  const username = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const menu = LocalStorageUtil.getItem("menu");

  const seeProfile = true;
  // const seeProfile = menu?.some((menu) =>
  //   menu?.actions?.some((action) => action.actionId === 64)
  // );
  const seeDashboard = true;
  // const seeDashboard = menu?.some((menu) =>
  //   menu?.actions?.some((action) => action.actionId === 2)
  // );
  const seeEKYE = true;
  // const seeEKYE = menu?.some((menu) =>
  //   menu?.actions?.some((action) => action.actionId === 68)
  // );
  const seeSecurity = true;
  // const seeSecurity = menu?.some((menu) =>
  //   menu?.actions?.some((action) => action.actionId === 72)
  // );
  const seeBank = true;
  // const seeBank = menu?.some((menu) =>
  //   menu?.actions?.some((action) => action.actionId === 76)
  // );
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
  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };
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
