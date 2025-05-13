import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../../lib/axios-Instance";
import BreadcrumbsComponent from "../../../../components/BreadCrumbsComp";
import Personal from "../../../../components/Ekye/View/Personal";
import EkyeAddress from "../../../../components/Ekye/View/Address";
import EkyeEducationDetails from "../../../../components/Ekye/View/Education";
import EkyeDocumentDetail from "../../../../components/Ekye/View/Document";
import { useNavigate, useParams } from "react-router-dom";
import LocalStorageUtil from "../../../../utils/LocalStorageUtil";

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
    component: EkyeEducationDetails,
    panelClass: "panel-info",
  },
];

const Tabs = ({ activeTab, changeTab }) => (
  <ul className="nav nav-tabs flex  border">
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

const Page = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [activeTab, setActiveTab] = useState(tabData[0]);
  const { rclId } = useParams();
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/v1/admin/singleCompleteEkyeUser/rclId/${rclId}`
        );
        if (response.data.responseCode === "200") {
          setEmployeeData(response.data.data);
        } else {
          toast.error(response?.data?.Message);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        toast.error("Error fetching employee data.");
      }
    };
    fetchEmployeeData();
  }, []);
  const breadcrumbItems = [
    { label: "Admin EKYE", href: "/AdminEkye" },
    { label: activeTab.name, href: "" },
  ];
  const navigate = useNavigate();

  const menu = LocalStorageUtil.getItem("menu");

  // const hasaccess = menu?.some((menu) =>
  //   menu?.actionList?.some((action) => action.actionId === 2)
  // );
  const ApproveEKYE = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 2)
  );
  const hasaccess = true;

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, []);
  return (
    <div className="container">
      <BreadcrumbsComponent items={breadcrumbItems} />
      <h1 className="page-title my-3 ml-6">EKYE</h1>
      <Tabs activeTab={activeTab} changeTab={setActiveTab} />

      <Content activeTab={activeTab} employeeData={employeeData} />
    </div>
  );
};

export default Page;
