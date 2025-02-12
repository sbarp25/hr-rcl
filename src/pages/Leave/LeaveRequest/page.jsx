import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DatePicker,
  Select,
  SelectSection,
  SelectItem,
} from "@nextui-org/react";
import { Form, Input, Button } from "@nextui-org/react";
import { DateInput } from "@nextui-org/date-input";
import { useState } from "react";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";

const LeaveRequest = () => {
  const [dropdown, setDropdown] = useState("");
  const [teamLeader, setTeamLeader] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Leave", href: "" },
    { label: "Leave Request", href: "/Leave/Request" },
  ];
  const handleDropdownChange = (key) => {
    setDropdown(key);
    setTeamLeader(key);
  };

  const handleLeaveTypeChange = (e) => {
    setLeaveType(e.target.value);
  };

  return (
    <div className="">
      <div className="flex flex-col">
        <BreadcrumbsComponent items={breadcrumbItems} />
        <div className="page-title">Leave Request</div>
      </div>
      <Form className="h-fit bg-white rounded-3xl container p-4 w-full">
        <div className="pt-2 w-full">
          <label className="">Subject</label>
          <Input label="Title" id="description" />
        </div>
        <div className=" w-full">
          <label>Desctiption</label>
          <Input label="Content" id="description" />
        </div>
        <div className="flex flex-col justify-center items-center gap-x-10 w-full">
          <div className="flex w-full gap-10">
            <div className="w-full">
              <Select
                label="Team Leader"
                selectedKeys={dropdown}
                selectionMode="single"
                onSelectionChange={handleDropdownChange}
                className="w-full mt-4"
              >
                <SelectItem key="mother" value="HR">
                  HR
                </SelectItem>
                <SelectItem key="Father" value="District">
                  District
                </SelectItem>
              </Select>
            </div>
            <div className="w-full">
              <Select
                label="Leave Type"
                value={Dropdown} // Use 'value' instead of 'selectedKeys' for single selection
                onChange={handleDropdownChange}
                className="w-full mt-4"
              >
                <SelectItem key="Sick Leave" value="Seasonal Illness">
                  Seasonal Illness
                </SelectItem>
                <SelectItem key="Month Leave" value="Paid Leave">
                  Paid Leave
                </SelectItem>
              </Select>
            </div>
          </div>

          <div className="flex gap-10 w-full">
            <div className="w-full">
              <label>Start Date</label>
              <DatePicker />
            </div>
            <div className="w-full">
              <label>End Date</label>
              <DatePicker />
            </div>
          </div>
        </div>
        <div className="flex mt-6">
          <Button className="button bg-bgprimary text-white">Submit</Button>
        </div>
      </Form>
    </div>
  );
};

export default LeaveRequest;
