import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Form, Input, Button } from "@nextui-org/react";
import { DateInput } from "@nextui-org/date-input";
import { useState } from "react";

const LeaveRequest = () => {
  const [dropdown, setDropdown] = useState("");
  const [teamLeader, setTeamLeader] = useState("");
  const [leaveType, setLeaveType] = useState("");

  const handleDropdownChange = (key) => {
    setDropdown(key);
    setTeamLeader(key);
  };

  const handleLeaveTypeChange = (e) => {
    setLeaveType(e.target.value);
  };

  return (
    <div className="">
      <div className="page-title">Leave Request</div>
      <div className="h-96 bg-white rounded-3xl container pb-4">
        <div className="pt-2">
          <label className="">Subject</label>
          <Input label="Title" />
        </div>
        <div>
          <label>Desctiption</label>
          <Input label="Content" />
        </div>
        <div className="flex flex-col justify-center items-center gap-10">
          <div className="flex w-full gap-10">
            <div className="w-full">
              <label>Team Leader</label>
              <Dropdown>
                <DropdownTrigger>
                  <Input
                    isReadOnly
                    label={teamLeader}
                    className=""
                    aria-label
                  />
                </DropdownTrigger>

                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Single selection example"
                  selectedKeys={dropdown}
                  selectionMode="single"
                  variant="flat"
                  onSelectionChange={handleDropdownChange}>
                  <DropdownItem key="mother">mother</DropdownItem>
                  <DropdownItem key="Father">Father</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="w-full">
              <label>Leave Type</label>
              <Input value={leaveType} onChange={handleLeaveTypeChange} />
            </div>
          </div>

          <div className="flex gap-10 w-full">
            <div className="w-full">
              <label>Start Date</label>
              <DateInput />
            </div>
            <div className="w-full">
              <label>End Date</label>
              <DateInput />
            </div>
          </div>
        </div>
        <div className="flex mt-6">
          <Button>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
