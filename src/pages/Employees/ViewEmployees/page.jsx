import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "sonner";
import GoBack from "../../../components/GoBack";

import { useNavigate, useParams } from "react-router-dom";
import EkyeDocumentDetail from "../../../components/Ekye/View/Document";
import Personal from "../../../components/Ekye/View/Personal";
import EkyeAddress from "../../../components/Ekye/View/Address";
import UserEducation from "../../../components/Ekye/View/UserEducation";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import Loader from "../../../components/Loader/Loader";
import { useEmployeeDetails, useEmployeeRCL } from "../../../hooks/useAuth";
import EkyeDetails from "./Components/EKYE/page";
import Salary from "./Components/Salary/Salary";
import AttendanceDetails from "./Components/Attendance/page";
import WFHdetails from "./Components/WFH/page";
import LeaveDetails from "./Components/Leave/page";
// const tabData = [
//   {
//     name: "Personal Information",
//     shortName: "Personal", // Short name for mobile
//     component: Personal,
//     panelClass: "panel-success",
//   },
//   {
//     name: "Address Details",
//     shortName: "Address",
//     component: EkyeAddress,
//     panelClass: "panel-warning",
//   },
//   {
//     name: "Document Details",
//     shortName: "Documents",
//     component: EkyeDocumentDetail,
//     panelClass: "panel-danger",
//   },
//   {
//     name: "Education Details",
//     shortName: "Education",
//     component: UserEducation,
//     panelClass: "panel-info",
//   },
// ];

const tabData = [
  {
    name: "EKYE",
    shortName: "EKYE",
    component: EkyeDetails,
    panelClass: "panel-success",
  },
  {
    name: "Salary",
    shortName: "Salary",
    component: Salary,
    panelClass: "panel-success",
  },
  {
    name: "WFH",
    shortName: "WFH",
    component: WFHdetails,
    panelClass: "panel-success",
  },
  {
    name: "Attendace",
    shortName: "Attendace",
    component: AttendanceDetails,
    panelClass: "panel-success",
  },
  {
    name: "Leave",
    shortName: "Leave",
    component: LeaveDetails,
    panelClass: "panel-success",
  },
];

const Tabs = ({ activeTab, changeTab }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Desktop tabs
  const DesktopTabs = () => (
    <ul className="hidden md:flex nav nav-tabs overflow-x-auto">
      {tabData?.map((tab) => (
        <li
          key={tab.name}
          onClick={(e) => {
            e.preventDefault();
            changeTab(tab);
          }}
          className={`cursor-pointer py-2 px-4 lg:px-8 text-center min-w-fit lg:w-40 font-semibold rounded-t-2xl border transition-all duration-300 whitespace-nowrap ${
            activeTab.name === tab.name
              ? "bg-gray-50 dark:bg-black border border-gray-300"
              : "hover:border-gray-300 hover:bg-gray-100 dark:bg-neutral-900"
          }`}>
          <span className="text-sm lg:text-base">{tab.name}</span>
        </li>
      ))}
    </ul>
  );

  // Mobile dropdown
  const MobileDropdown = () => (
    <div className="md:hidden relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-black border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-600">
        <span className="font-medium text-gray-900">{activeTab.name}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            showDropdown ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-black border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {tabData?.map((tab) => (
            <button
              key={tab.name}
              onClick={(e) => {
                e.preventDefault();
                changeTab(tab);
                setShowDropdown(false);
              }}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-600 transition-colors duration-150 ${
                activeTab.name === tab.name
                  ? "bg-blue-50 dark:bg-black dark:text-white text-black font-medium"
                  : "text-gray-900 dark:text-white"
              } ${
                tab !== tabData[tabData.length - 1]
                  ? "border-b border-gray-100"
                  : ""
              }`}>
              {tab.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mb-4">
      <DesktopTabs />
      <MobileDropdown />
    </div>
  );
};

const Content = ({ activeTab, employeeData }) => {
  const ActiveComponent = activeTab.component;
  return (
    <section className={`panel ${activeTab.panelClass} p-4 sm:p-6`}>
      <ActiveComponent employeeData={employeeData} />
    </section>
  );
};

const ViewEKYE = () => {
  const [activeTab, setActiveTab] = useState(tabData[0]);
  const navigate = useNavigate();

  const { data: RCLIdData } = useEmployeeRCL();

  // const rclId = RCLIdData?.data?.rclId;
  const { rclId } = useParams();

  const { data: EmployeeEKYEData, isLoading } = useEmployeeDetails(rclId);

  const employeeData = EmployeeEKYEData?.data;

  /**To check Employee see status */
  const seeEKYEAccess = true;

  useEffect(() => {
    if (!seeEKYEAccess) {
      navigate("/dashboard");
    }
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <h1 className="page-title my-3 text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
        Employee Details
      </h1>

      {/* Go back button */}
      <div className="mb-4">
        <GoBack />
      </div>

      {/* Responsive tabs */}
      <Tabs activeTab={activeTab} changeTab={setActiveTab} />

      {/* Content area */}
      <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-500 min-h-[400px]">
        <Content activeTab={activeTab} employeeData={employeeData} />
      </div>
    </div>
  );
};

export default ViewEKYE;
