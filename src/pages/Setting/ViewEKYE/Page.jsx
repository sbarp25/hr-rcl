import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "sonner";
import GoBack from "../../../components/GoBack";

import { useNavigate } from "react-router-dom";
import EkyeDocumentDetail from "../../../components/Ekye/View/Document";
// import Personal from "../../../../components/Ekye/View/Personal";
import Personal from "../../../components/Ekye/View/Personal";
import EkyeAddress from "../../../components/Ekye/View/Address";
import UserEducation from "../../../components/Ekye/View/UserEducation";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import Loader from "../../../components/Loader/Loader";
const tabData = [
  {
    name: "Personal Information",
    component: Personal,
    panelClass: "panel-success",
  },
  {
    name: "Address Details",
    component: EkyeAddress,
    panelClass: "panel-warning",
  },
  {
    name: "Document Details",
    component: EkyeDocumentDetail,
    panelClass: "panel-danger",
  },
  {
    name: "Education Details",
    component: UserEducation,
    panelClass: "panel-info",
  },
];

const Tabs = ({ activeTab, changeTab }) => (
  <ul className="flex ">
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
    <div className="container">
      {/* <BreadcrumbsComponent items={breadcrumbItems} /> */}
      <h1 className="page-title my-3 ml-6">EKYE</h1>
      <Tabs activeTab={activeTab} changeTab={setActiveTab} />
      {isLoading ? (
        <Loader />
      ) : (
        <Content activeTab={activeTab} employeeData={employeeData} />
      )}
    </div>
  );
};

export default ViewEKYE;
