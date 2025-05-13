import React, { useEffect } from "react";
import { Calendar } from "@nextui-org/calendar";
import { parseDate } from "@internationalized/date";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import { useNavigate } from "react-router-dom";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
const Attendance = () => {
  let [value, setValue] = React.useState(parseDate("2024-03-07"));
  const breadcrumbItems = [
    { label: "Attendance", href: "/Attendance" },
    { label: "My Attendance", href: "/Attendance" },
  ];
  const navigate = useNavigate();
  const hasaccess = false;

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);
  const menu = LocalStorageUtil.getItem("menu");

  /**To check Employee see status */
  const seeEmployee = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 2)
  );
  return (
    <>
      <BreadcrumbsComponent items={breadcrumbItems} />
      <Calendar
        aria-label="Date (Controlled)"
        value={value}
        onChange={setValue}
      />
    </>
  );
};

export default Attendance;
