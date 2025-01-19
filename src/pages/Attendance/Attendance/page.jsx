import React from "react";
import { Calendar } from "@nextui-org/calendar";
import { parseDate } from "@internationalized/date";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
const Attendance = () => {
  let [value, setValue] = React.useState(parseDate("2024-03-07"));
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Attendance", href: "/Attendance" },
  ];
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
