import React from "react";
import { Calendar } from "@nextui-org/calendar";
import { parseDate } from "@internationalized/date";
const Attendance = () => {
  let [value, setValue] = React.useState(parseDate("2024-03-07"));
  return (
    <Calendar
      aria-label="Date (Controlled)"
      value={value}
      onChange={setValue}
    />
  );
};

export default Attendance;
