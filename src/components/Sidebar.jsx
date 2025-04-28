import Logo from "../assets/Images/Logo.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdDashboard } from "react-icons/md";
import { IoAlarm } from "react-icons/io5";
import { FcLeave } from "react-icons/fc";
import { FaBookBookmark, FaNewspaper } from "react-icons/fa6";
import { GoGear } from "react-icons/go";
import { BiData } from "react-icons/bi";
import { IoIosPeople } from "react-icons/io";
import { Link } from "react-router-dom";
import { Avatar } from "@nextui-org/avatar";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { BsArrowReturnRight } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import LocalStorageUtil from "../utils/LocalStorageUtil";

const Sidebar = () => {
  const username = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");

  const truncateText = (text, maxLength) =>
    text?.length > maxLength ? `${text?.slice(0, maxLength)}...` : text;

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [expandedDropdown, setExpandedDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

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
    menu.actionList.some((action) => action.actionId === 14)
  );
  const seeRole = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 14)
  );
  const seeAttendance = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 14)
  );
  const seeHandbook = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 14)
  );
  const seeNotices = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 14)
  );
  const seeLeave = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 14)
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
        { label: "Roles", to: "/master-data/Roles", view: true },
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
              <Avatar
                size="md"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
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

export default Sidebar;
