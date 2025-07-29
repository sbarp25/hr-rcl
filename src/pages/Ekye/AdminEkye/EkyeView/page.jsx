import { useEffect, useState } from "react";
import BreadcrumbsComponent from "../../../../components/ui/BreadCrumbsComp.jsx";
import Personal from "../../../../components/Ekye/View/Personal";
import EkyeAddress from "../../../../components/Ekye/View/Address";
import EkyeEducationDetails from "../../../../components/Ekye/View/Education";
import EkyeDocumentDetail from "../../../../components/Ekye/View/Document";
import { useNavigate, useParams } from "react-router-dom";
import { useEmployeeDetails } from "../../../../hooks/useAuth.js";
import { FaChevronDown, FaBars } from "react-icons/fa";
import GoBack from "../../../../components/GoBack.jsx";

const tabData = [
  {
    name: "Personal Information",
    shortName: "Personal",
    component: Personal,
    panelClass: "panel-success",
  },
  {
    name: "Address Details",
    shortName: "Address",
    component: EkyeAddress,
    panelClass: "panel-warning",
  },
  {
    name: "Document Details",
    shortName: "Documents",
    component: EkyeDocumentDetail,
    panelClass: "panel-danger",
  },
  {
    name: "Education Details",
    shortName: "Education",
    component: EkyeEducationDetails,
    panelClass: "panel-info",
  },
];

// Desktop/Tablet Tabs Component
const DesktopTabs = ({ activeTab, changeTab }) => (
  <div className="hidden md:block">
    <ul className="nav nav-tabs flex border-b border-gray-200 dark:border-gray-700">
      {tabData?.map((tab) => (
        <li
          key={tab.name}
          onClick={(e) => {
            e.preventDefault();
            changeTab(tab);
          }}
          className={`cursor-pointer py-3 px-4 lg:px-8 text-center font-semibold rounded-t-lg border-t border-l border-r transition-all duration-300 ${
            activeTab.name === tab.name
              ? "bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 -mb-px"
              : "bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600"
          }`}>
          <span className="text-sm lg:text-base whitespace-nowrap">
            {/* Show short names on medium screens, full names on large screens */}
            <span className="hidden lg:inline">{tab.name}</span>
            <span className="lg:hidden">{tab.shortName}</span>
          </span>
        </li>
      ))}
    </ul>
  </div>
);

// Mobile Dropdown Tabs Component
const MobileTabs = ({ activeTab, changeTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block md:hidden">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <FaBars className="text-gray-500" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {activeTab.name}
            </span>
          </div>
          <FaChevronDown
            className={`text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
            {tabData.map((tab) => (
              <button
                key={tab.name}
                onClick={() => {
                  changeTab(tab);
                  setIsOpen(false);
                }}
                className={`w-full text-left p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors duration-200 ${
                  activeTab.name === tab.name
                    ? "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}>
                {tab.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Combined Tabs Component
const Tabs = ({ activeTab, changeTab }) => (
  <div className="mb-4">
    <DesktopTabs activeTab={activeTab} changeTab={changeTab} />
    <MobileTabs activeTab={activeTab} changeTab={changeTab} />
  </div>
);

const Content = ({ activeTab, employeeData }) => {
  const ActiveComponent = activeTab.component;
  return (
    <section
      className={`panel ${activeTab.panelClass} bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6`}>
      <ActiveComponent employeeData={employeeData} />
    </section>
  );
};

const Page = () => {
  const [activeTab, setActiveTab] = useState(tabData[0]);
  const { rclId } = useParams();

  const { data } = useEmployeeDetails(rclId);

  const employeeData = data?.data || [];

  const breadcrumbItems = [
    { label: "Admin EKYE", href: "/AdminEkye" },
    { label: activeTab.name, href: "" },
  ];
  const navigate = useNavigate();

  const hasaccess = true;

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  return (
    <div className="container px-2 md:px-4 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="text-sm">
          <BreadcrumbsComponent items={breadcrumbItems} />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="page-title text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
            EKYE
          </h1>
          <GoBack />
          {/* Optional: Add employee info or actions here */}
          {employeeData?.fullName && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Employee: </span>
              <span>{employeeData.fullName}</span>
              {employeeData.rclId && (
                <>
                  <span className="mx-2">•</span>
                  <span className="font-medium">ID: </span>
                  <span>{employeeData.rclId}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs activeTab={activeTab} changeTab={setActiveTab} />

      {/* Content Section */}
      <div className="min-h-[60vh]">
        <Content activeTab={activeTab} employeeData={employeeData} />
      </div>
    </div>
  );
};

export default Page;
