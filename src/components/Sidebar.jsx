import Logo from "../assets/Images/Logo.png";

import { GiHamburgerMenu } from "react-icons/gi";
import { MdDashboard } from "react-icons/md";
import { IoAlarm } from "react-icons/io5";
import { FcLeave, FcOvertime } from "react-icons/fc";
import { FaBookBookmark, FaNewspaper } from "react-icons/fa6";
import { GoGear } from "react-icons/go";

import { Link } from "react-router-dom";
import { useState } from "react";
import { Avatar } from "@nextui-org/avatar";

const Sidebar = () => {
  const user = "Odinson";
  const email = "fiocroh@ib.bw";
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const navbarElements = [
    { icon: MdDashboard, label: "Dashboard" },
    { icon: IoAlarm, label: "Attendance" },
    { icon: FcLeave, label: "Leave" },
    { icon: FcOvertime, label: "OverTime" },
    { icon: FaBookBookmark, label: "HandBook" },
    { icon: FaNewspaper, label: "Notice" },
  ];

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
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
            <Link To="/">
              <img src={Logo} className="w-32" />
            </Link>
          )}
        </div>

        {/* Navigation items */}
        <div className="flex-grow">
          {navbarElements.map((service, index) => (
            <Link
              to={service.label}
              key={index}
              className="flex items-center gap-4 p-3 hover:bg-gray-700 transition-colors rounded-lg">
              <service.icon className="text-2xl" />
              {isSidebarExpanded && (
                <span className="text-base">{service.label}</span>
              )}
            </Link>
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
                <p className="text-xl">{user}</p>
                <p className="text-sm">{email}</p>
              </div>
            )}
            {isSidebarExpanded && <GoGear className="text-2xl" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
