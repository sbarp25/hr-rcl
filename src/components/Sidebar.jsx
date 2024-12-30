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

const Sidebar = () => {
  const user = {
    username: "Odinson",
    email: "fiocroh@ib.bw",
  };

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [expandedDropdown, setExpandedDropdown] = useState(null);

  const navbarElements = [
    { icon: MdDashboard, label: "Dashboard", to: "/" },
    {
      icon: IoAlarm,
      label: "Attendance",
      children: [
        { label: "My Attendence", to: "/Attendance" },
        { label: "Request Attendence", to: "/Attendance/Request" },
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
        { label: "Menu", to: "/master-data/Menu" },
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
  ];

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const toggleDropdown = (index) => {
    setExpandedDropdown(expandedDropdown === index ? null : index);
  };

  return (
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
            <Link to="/">
              <img src={Logo} className="w-32" alt="Logo" />
            </Link>
          )}
        </div>

        {/* Navigation items */}
        <div className="flex-grow">
          {navbarElements.map((service, index) => (
            <div key={index} className="relative">
              <div
                className="flex items-center gap-4 p-3 hover:bg-gray-700 transition-colors rounded-lg cursor-pointer"
                onClick={() => service.children && toggleDropdown(index)}>
                <service.icon className="text-2xl" />
                {isSidebarExpanded && (
                  <span className="text-base">{service.label}</span>
                )}
              </div>
              {/* Dropdown items */}
              {service.children && expandedDropdown === index && (
                <div className="pl-8 mt-2 space-y-2">
                  {service.children.map((child, childIndex) => (
                    <Link
                      key={childIndex}
                      to={child.to}
                      className="block p-2 hover:bg-gray-600 rounded-lg transition-colors">
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
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
                <p className="text-xl">{user.username}</p>
                <p className="text-sm">{user.email}</p>
              </div>
            )}
            {isSidebarExpanded && (
              <a href="/settings">
                <GoGear className="text-2xl" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
