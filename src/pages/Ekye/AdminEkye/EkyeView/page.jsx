import { Tabs, Tab } from "@nextui-org/tabs";
import BreadcrumbsComponent from "../../../../components/BreadCrumbsComp";
import Personal from "../../../../components/Ekye/View/Personal";
import EkyeAdreess from "../../../../components/Ekye/View/Address";
import EkyeEducationDetails from "../../../../components/Ekye/View/Education";
import EkyeDocumentDetail from "../../../../components/Ekye/View/Document";
import SalaryDetails from "../../../Salary/page";
const Page = () => {
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
          <Tabs aria-label="EKYE" className="" size="lg">
            {/* Personal Information Section */}
            <Tab key="PersonalDetails" title="Basic Information">
              <Personal />
            </Tab>
            <Tab key="AddressDetails" title="Address Details">
              <EkyeAdreess />
            </Tab>
            <Tab key="DocumentDetails" title="Document Details">
              <EkyeDocumentDetail />
            </Tab>
            <Tab key="EducationDetails" title="Education Details">
              <EkyeEducationDetails />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Page;
