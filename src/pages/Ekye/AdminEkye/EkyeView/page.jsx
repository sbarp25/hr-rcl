import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "../../../../lib/axios-Instance";
import BreadcrumbsComponent from "../../../../components/ui/BreadCrumbsComp.jsx";
import Personal from "../../../../components/Ekye/View/Personal";
import EkyeAddress from "../../../../components/Ekye/View/Address";
import EkyeEducationDetails from "../../../../components/Ekye/View/Education";
import EkyeDocumentDetail from "../../../../components/Ekye/View/Document";
import { useNavigate, useParams } from "react-router-dom";
import { useEmployeeDetails } from "../../../../hooks/useAuth.js";

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
            ? " bg-gray-50 dark:bg-slate-500 border border-gray-300 "
            : "hover:border-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
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
