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
import { CiLogout } from "react-icons/ci";
import { CiBank } from "react-icons/ci";
import { IoShieldCheckmark } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";
import getInitials from "../../utils/getInitials";
import axios from "axios";
const UserSidebar = () => {
  const [imageURL, setImageURL] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedDropdown, setExpandedDropdown] = useState(null);

  const username = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const navbarElements = [
    { icon: MdDashboard, label: "Dashboard", to: "/dashboard", view: true },
    {
      icon: IoPersonSharp,
      label: "Profile",
      to: "/settings",
      view: true,
    },
    {
      icon: IoIosPeople,
      label: "My EKYE",
      to: "/settings/ViewEKYE",
      view: true,
    },
    {
      icon: IoShieldCheckmark,
      label: "Security",
      to: "/settings/Change",
      view: true,
    },
    {
      icon: CiBank,
      label: "Bank Details",
      to: "/Bank",
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

  const truncateText = (text, maxLength) =>
    text?.length > maxLength ? `${text?.slice(0, maxLength)}...` : text;
  return (
    <>
      {isLoading && <Loader />}
      <div className="flex">
        <div
          className={`h-screen bg-black text-white flex flex-col transition-all duration-300 ${
            isSidebarExpanded ? "w-64" : "w-20"
          }`}>
          {/* Hamburger menu */}
          <div className="flex items-center gap-4 p-4">
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
          <div className="flex-grow">
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
                            {location.pathname === child.to && (
                              <BsArrowReturnRight className="mt-1 " />
                            )}
                            {child.label}
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
          <div className="p-4">
            <div className="flex items-center gap-4">
              {imageURL ? (
                <Avatar className="h-full w-full object-cover" src={imageURL} />
              ) : (
                <div className="flex rounded-full items-center justify-center h-full w-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-800 text-blue-800 dark:text-blue-200 text-xl shadow-inner border border-white/20 dark:border-black/20">
                  {getInitials(username)}
                </div>
              )}
              {isSidebarExpanded && (
                <div>
                  <p className="text-xl" title={username}>
                    {" "}
                    {truncateText(username, 7)}
                  </p>
                  <p className="text-sm" title={email}>
                    {" "}
                    {truncateText(email, 10)}
                  </p>
                </div>
              )}
              {isSidebarExpanded && (
                <div className="flex items-center gap-x-2">
                  <a href="/settings">
                    <GoGear className="text-2xl" />
                  </a>
                  <button className="">
                    <CiLogout
                      onClick={handleLogOut}
                      className="text-2xl text-red-500  hover:scale-125"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;
