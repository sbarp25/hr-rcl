// import { Tabs, Tab } from "@nextui-org/tabs";
// import BreadcrumbsComponent from "../../../../components/BreadCrumbsComp";
// import Personal from "../../../../components/Ekye/View/Personal";
// import EkyeAdreess from "../../../../components/Ekye/View/Address";
// import EkyeEducationDetails from "../../../../components/Ekye/View/Education";
// import EkyeDocumentDetail from "../../../../components/Ekye/View/Document";
// import { useEffect, useState } from "react";
// import axiosInstance from "../../../../lib/axios-Instance";
// import { toast } from "react-toastify";
// const Page = () => {
//   const [employeeData, setEmployeeData] = useState();
//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       try {
//         const response = await axiosInstance.get(
//           // `/api/v1/admin/singleCompleteEkyeUser/rclId/${rclid}`
//           `/api/v1/admin/singleCompleteEkyeUser/rclId/RCL-250441143100002`
//         );
//         if (response.data.responseCode === "200") {
//           const data = response?.data?.data;
//           setEmployeeData(data);
//           console.log(data);
//         } else {
//           toast.error(response?.data?.Message);
//         }
//       } catch (error) {
//         console.error("Error fetching employee data:", error);
//         // toast.error("Error fetching employee data.");
//       }
//     };
//     fetchEmployeeData();
//   }, []);
//   const breadcrumbItems = [
//     { label: "Dashboard", href: "/" },
//     { label: "EKYE", href: "/EKYE" },
//     { label: "Personal", href: "/AddEmployees" },
//   ];

//   return (
//     <div className="container flex flex-col space-y-4">
//       <div className="text-sm">
//         <BreadcrumbsComponent items={breadcrumbItems} />
//       </div>
//       <h1 className="page-title">EKYE</h1>
//       <div className="">
//         <div className="rounded-xl">
//           <Tabs
//             aria-label="EKYE"
//             className="-mb-5 ml-2 relative"
//             size="lg"
//             variant="light"
//             radius="lg"
//           >
//             <Tab
//               className=" rounded-t-lg border-b border-gray-300"
//               key="PersonalDetails"
//               title="Personal Information"
//             >
//               <Personal employeeData={employeeData} />
//             </Tab>
//             <Tab
//               className="rounded-t-2xl border-b border-gray-300"
//               key="AddressDetails"
//               title="Address Details"
//             >
//               <EkyeAdreess employeeData={employeeData} />
//             </Tab>
//             <Tab
//               className="rounded-t-lg border-b border-gray-300"
//               key="DocumentDetails"
//               title="Document Details"
//             >
//               <EkyeDocumentDetail employeeData={employeeData} />
//             </Tab>
//             <Tab
//               className="rounded-t-lg border-b border-gray-300"
//               key="EducationDetails"
//               title="Education Details"
//             >
//               <EkyeEducationDetails employeeData={employeeData} />
//             </Tab>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../../lib/axios-Instance";
import BreadcrumbsComponent from "../../../../components/BreadCrumbsComp";
import Personal from "../../../../components/Ekye/View/Personal";
import EkyeAddress from "../../../../components/Ekye/View/Address";
import EkyeEducationDetails from "../../../../components/Ekye/View/Education";
import EkyeDocumentDetail from "../../../../components/Ekye/View/Document";

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
        }`}
      >
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

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/v1/admin/singleCompleteEkyeUser/rclId/RCL-250471009100003`
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
    { label: "Dashboard", href: "/" },
    { label: "AdminEKYE", href: "/AdminEkye" },
    { label: activeTab.name, href: "" },
  ];

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
