import { Button, Input } from "@nextui-org/react";
import { BsFilter } from "react-icons/bs";
import EkyeDashboard from "../../../components/EkyeDashboard";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
const page = () => {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "EKYE", href: "/EKYE" },
  ];
  return (
    <div className=" max-w-[200vh] max-h-[450vh] h-full w-full ">
      <div className="flex justify-between items-center px-8 py-4">
        {/* Left Text */}
        <div className="flex flex-col">
          <BreadcrumbsComponent items={breadcrumbItems} />
          <h1 className="page-title">EKYE</h1>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-4">
          <Input className="w-64" type="search" placeholder="Search..." />
          <Button className="flex items-center bg-white hover:bg-gray-200 text-black py-2 px-4">
            <BsFilter className="mr-2 text-2xl" />
            <span className="text-lg font-bold">Filter</span>
          </Button>
        </div>
      </div>

      <div className="px-8 ">
        <EkyeDashboard />
      </div>
    </div>
  );
};

export default page;
