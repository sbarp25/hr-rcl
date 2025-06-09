import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../lib/axios-Instance.js";
import BreadcrumbsComponent from "../../../components/ui/BreadCrumbsComp.jsx";
import LeaveDetails from "./Components/Leave/page.jsx";
import WFHdetails from "./Components/WFH/page.jsx";
import Salary from "./Components/Salary/Salary.jsx";
import EkyeDetails from "./Components/EKYE/page.jsx";
import AttendanceDetails from "./Components/Attendance/page.jsx";
import GoBack from "../../../components/GoBack.jsx";
import Loader from "../../../components/Loader/Loader.jsx";

const tabData = [
  {
    name: "Leave Details",
    component: LeaveDetails,
    panelClass: "panel-success",
  },
  {
    name: "WFH details",
    component: WFHdetails,
    panelClass: "panel-warning",
  },
  {
    name: "Salary details",
    component: Salary,
    panelClass: "panel-danger",
  },
  {
    name: "Ekye Details",
    component: EkyeDetails,
    panelClass: "panel-info",
  },
  {
    name: "Attendance Details",
    component: AttendanceDetails,
    panelClass: "panel-info",
  },
];

const Tabs = ({ activeTab, changeTab }) => (
  <ul className="nav nav-tabs flex  ">
    {tabData?.map((tab) => (
      <li
        key={tab.name}
        onClick={(e) => {
          e.preventDefault();
          changeTab(tab);
        }}
        className={` cursor-pointer py-2 px-8 text-center w-40 font-semibold rounded-t-2xl border  transition-all duration-300 ${
          activeTab.name === tab.name
            ? " bg-gray-50 border border-gray-300 "
            : "hover:border-gray-300 hover:bg-gray-100"
        }`}>
        <span>{tab.name}</span>
      </li>
    ))}
  </ul>
);

const Content = ({ activeTab, employeeData }) => {
  const ActiveComponent = activeTab.component;
  return (
    <section className={`panel ${activeTab.panelClass}`}>
      <ActiveComponent employeeData={employeeData} />
    </section>
  );
};

const ViewEmployeeDetails = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [activeTab, setActiveTab] = useState(tabData[0]);
  const [isLoading, setIsloading] = useState(false);
  const { rclId } = useParams();

  const fetchEmployeeData = async () => {
    const requestBody = {
      data: {
        rclId: rclId,
      },
    };
    setIsloading(true);
    try {
      const response = await axiosInstance.post(
        `/api/v1/admin/complete-details/rclId`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.responseCode === "200") {
        setEmployeeData(response.data.data);
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage;
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsloading(false);
    }
  };
  useEffect(() => {
    if (rclId) {
      fetchEmployeeData();
    }
  }, [rclId]);
  const breadcrumbItems = [
    { label: "Employee", href: "/AdminEkye" },
    { label: activeTab.name, href: "" },
  ];
  const navigate = useNavigate();

  const hasaccess = true;

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, []);
  return (
    <div className="container">
      <BreadcrumbsComponent items={breadcrumbItems} />
      <GoBack />

      <Tabs activeTab={activeTab} changeTab={setActiveTab} />
      {isLoading ? (
        <Loader />
      ) : (
        <Content activeTab={activeTab} employeeData={employeeData} />
      )}
    </div>
  );
};

export default ViewEmployeeDetails;
