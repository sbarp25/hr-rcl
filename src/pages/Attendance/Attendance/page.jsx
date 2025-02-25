import React, { useEffect } from "react";
import { Calendar } from "@nextui-org/calendar";
import { parseDate } from "@internationalized/date";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import { useNavigate } from "react-router-dom";
const Attendance = () => {
  let [value, setValue] = React.useState(parseDate("2024-03-07"));
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Attendance", href: "/Attendance" },
  ];
  const navigate = useNavigate();
  const hasaccess = false;

  useEffect(() => {
    if (!hasaccess) {
      navigate("/login");
    }
  }, []);
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
