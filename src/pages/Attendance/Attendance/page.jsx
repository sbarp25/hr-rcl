import { useEffect, useState } from "react";
import BreadcrumbsComponent from "../../../components/ui/BreadCrumbsComp.jsx";
import { useNavigate } from "react-router-dom";
import Calander from "../../../components/Attendance/Calander.jsx";
import UpComingHoliday from "../../../components/Attendance/UpComingHoliday.jsx";
import ChangeCalander from "../../../components/Attendance/ChangeCalander.jsx";
import { hasReadAccess, MENU_NAMES } from "../../../utils/permissionUtils.js";

const Attendance = () => {
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: "Attendance", href: "/Attendance" },
    { label: "My Attendance", href: "/Attendance" },
  ];
  const hasaccess = hasReadAccess(MENU_NAMES.MYATTENDANCE);

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  return (
    <>
      <BreadcrumbsComponent items={breadcrumbItems} />
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-4/5">
          {/* <ChangeCalander /> */}
          <Calander />
        </div>
        <div className="w-full lg:w-1/5 ">
          <UpComingHoliday />
        </div>
      </div>
    </>
  );
};

export default Attendance;
