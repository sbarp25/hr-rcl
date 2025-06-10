import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "sonner";
import GoBack from "../../../components/GoBack";

import { useNavigate } from "react-router-dom";
import EkyeDocumentDetail from "../../../components/Ekye/View/Document";
import Personal from "../../../components/Ekye/View/Personal";
import EkyeAddress from "../../../components/Ekye/View/Address";
import UserEducation from "../../../components/Ekye/View/UserEducation";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import Loader from "../../../components/Loader/Loader";

const tabData = [
  {
    name: "Personal Information",
    shortName: "Personal", // Short name for mobile
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
    component: UserEducation,
    panelClass: "panel-info",
  },
];

const Tabs = ({ activeTab, changeTab }) => (
  <div className="w-full">
    {/* Desktop Tabs */}
    <ul className="hidden md:flex">
      {tabData?.map((tab) => (
        <li
          key={tab.name}
          onClick={(e) => {
            e.preventDefault();
            changeTab(tab);
          }}
          className={`cursor-pointer py-2 px-4 lg:px-8 text-center min-w-0 flex-1 font-semibold rounded-t-2xl border transition-all duration-300 ${
            activeTab.name === tab.name
              ? "bg-gray-50 border border-gray-300"
              : "hover:border-gray-300 hover:bg-gray-100"
          }`}>
          <span className="text-sm lg:text-base truncate">{tab.name}</span>
        </li>
      ))}
    </ul>

    {/* Mobile Dropdown */}
    <div className="md:hidden relative">
      <select
        value={activeTab.name}
        onChange={(e) => {
          const selectedTab = tabData.find(
            (tab) => tab.name === e.target.value
          );
          changeTab(selectedTab);
        }}
        className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-white font-semibold text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        {tabData.map((tab) => (
          <option key={tab.name} value={tab.name}>
            {tab.name}
          </option>
        ))}
      </select>
      {/* Dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 fill-current text-gray-400" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>

    {/* Alternative Mobile: Horizontal Scrollable Tabs */}
    {/* Uncomment this section if you prefer scrollable tabs over dropdown
    <div className="md:hidden overflow-x-auto">
      <ul className="flex min-w-max">
        {tabData?.map((tab) => (
          <li
            key={tab.name}
            onClick={(e) => {
              e.preventDefault();
              changeTab(tab);
            }}
            className={`cursor-pointer py-2 px-4 text-center whitespace-nowrap font-semibold rounded-t-2xl border transition-all duration-300 ${
              activeTab.name === tab.name
                ? "bg-gray-50 border border-gray-300"
                : "hover:border-gray-300 hover:bg-gray-100"
            }`}
          >
            <span className="text-sm">{tab.shortName}</span>
          </li>
        ))}
      </ul>
    </div>
    */}
  </div>
);

const Content = ({ activeTab, employeeData }) => {
  const ActiveComponent = activeTab.component;
  return (
    <section className={`panel ${activeTab.panelClass} mt-0`}>
      <div className="p-4 md:p-6">
        <ActiveComponent employeeData={employeeData} />
      </div>
    </section>
  );
};

const ViewEKYE = () => {
  const [employeeData, setEmployeeData] = useState();
  const [activeTab, setActiveTab] = useState(tabData[0]);
  const [rclId, setRclId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchrcl = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/v1/auth/ekye/details`);
      if (response.data.responseCode === "200") {
        const data = response?.data?.data?.rclId;
        setRclId(data);
      } else {
        toast.error(response?.data?.Message);
      }
    } catch (error) {
      toast.error("Failed to fetch RCL ID");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeData = async () => {
    if (!rclId) return;

    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/api/v1/admin/singleCompleteEkyeUser/rclId/${rclId}`
      );
      if (response.data.responseCode === "200") {
        const data = response?.data?.data;
        setEmployeeData(data);
      } else {
        toast.error(response?.data?.Message);
      }
    } catch (error) {
      toast.error("Failed to fetch employee data");
    } finally {
      setIsLoading(false);
    }
  };

  // First fetch the rclId
  useEffect(() => {
    fetchrcl();
  }, []);

  // Then fetch employee data once rclId is available
  useEffect(() => {
    if (rclId) {
      fetchEmployeeData();
    }
  }, [rclId]);

  /**To check Employee see status */
  const seeEKYEAccess = true;

  useEffect(() => {
    if (!seeEKYEAccess) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <h1 className="page-title my-3 text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
        EKYE
      </h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Tabs activeTab={activeTab} changeTab={setActiveTab} />

        {isLoading ? (
          <div className="flex justify-center items-center p-8 md:p-12">
            <Loader />
          </div>
        ) : (
          <Content activeTab={activeTab} employeeData={employeeData} />
        )}
      </div>
    </div>
  );
};

export default ViewEKYE;
