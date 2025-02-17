import { Tabs, Tab } from "@nextui-org/tabs";
import BreadcrumbsComponent from "../../../../components/BreadCrumbsComp";
import Personal from "../../../../components/Ekye/View/Personal";
import EkyeAdreess from "../../../../components/Ekye/View/Address";
import EkyeEducationDetails from "../../../../components/Ekye/View/Education";
import EkyeDocumentDetail from "../../../../components/Ekye/View/Document";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../lib/axios-Instance";
import { toast } from "react-toastify";
const Page = () => {
  const [employeeData, setEmployeeData] = useState();
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axiosInstance.get(
          // `/api/v1/admin/singleCompleteEkyeUser/rclId/${rclid}`
          `/api/v1/admin/singleCompleteEkyeUser/rclId/RCL-250441143100002`
        );
        if (response.data.responseCode === "200") {
          const data = response?.data?.data;
          setEmployeeData(data);
          console.log(data);
        } else {
          toast.error(response?.data?.Message);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        // toast.error("Error fetching employee data.");
      }
    };
    fetchEmployeeData();
  }, []);
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "EKYE", href: "/EKYE" },
    { label: "Personal", href: "/AddEmployees" },
  ];

  return (
    <div className="container flex flex-col space-y-4">
      <div className="text-sm">
        <BreadcrumbsComponent items={breadcrumbItems} />
      </div>
      <h1 className="page-title">EKYE</h1>
      <div className="">
        <div className="rounded-xl">
          <Tabs
            aria-label="EKYE"
            className="-mb-3 ml-2  "
            size="lg"
            variant="light"
          >
            {/* Personal Information Section */}
            <Tab
              className="   rounded-t-lg "
              key="PersonalDetails"
              title="Personal Information"
            >
              <Personal employeeData={employeeData} />
            </Tab>
            <Tab
              className="rounded-t-lg "
              key="AddressDetails"
              title="Address Details"
            >
              <EkyeAdreess employeeData={employeeData} />
            </Tab>
            <Tab
              className="rounded-t-lg"
              key="DocumentDetails"
              title="Document Details"
            >
              <EkyeDocumentDetail employeeData={employeeData} />
            </Tab>
            <Tab
              className="rounded-t-lg"
              key="EducationDetails"
              title="Education Details"
            >
              <EkyeEducationDetails employeeData={employeeData} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Page;
