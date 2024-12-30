import React from "react";
import { Form, Input, Button } from "@nextui-org/react";
import { DateInput } from "@nextui-org/date-input";
import { CalendarDate } from "@internationalized/date";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { IoMdArrowDropdown } from "react-icons/io";
const PersonalInformation = () => {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys]
  );
  return (
    <div className="container">
      <h2>Personal Information</h2>
      <Form>
        {/**Personal Information */}
        <label>Email:</label>
        <Input name="Email" required />
        <div className="flex w-full gap-8">
          <div className="w-1/2">
            <label>Date Of Birth</label>
            <DateInput
              className=""
              placeholderValue={new CalendarDate(1995, 11, 6)}
            />
          </div>
          <div className="w-1/2 flex">
            <label>Blood Group</label>
            <Dropdown>
              <DropdownTrigger>
                <Input isReadOnly label={selectedValue} className="" />
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Single selection example"
                selectedKeys={selectedKeys}
                selectionMode="single"
                variant="flat"
                onSelectionChange={setSelectedKeys}>
                {/**Insert the type of blood group */}
                <DropdownItem key="text">Text</DropdownItem>
                <DropdownItem key="number">Number</DropdownItem>
                <DropdownItem key="date">Date</DropdownItem>
                <DropdownItem key="single_date">Single Date</DropdownItem>
                <DropdownItem key="iteration">Iteration</DropdownItem>
              </DropdownMenu>
              <IoMdArrowDropdown />
            </Dropdown>
          </div>
        </div>
        {/**Guardians Details */}
        <h2>Guardians Details</h2>
        <div className="flex w-full gap-10">
          <div className="w-full">
            <label>Guardians Name</label>
            <Input name="text" required />
          </div>
          <div className="w-full">
            <label>Guardians Number</label>
            <Input name="number" required />
          </div>
        </div>
        <div className="flex w-full gap-10">
          <label>Relationship</label>
          <Dropdown>
            <DropdownTrigger>
              <Input isReadOnly label={selectedValue} className="" />
            </DropdownTrigger>

            <DropdownMenu
              disallowEmptySelection
              aria-label="Single selection example"
              selectedKeys={selectedKeys}
              selectionMode="single"
              variant="flat"
              onSelectionChange={setSelectedKeys}>
              <DropdownItem key="mother">mother</DropdownItem>
              <DropdownItem key="Father">Father</DropdownItem>
            </DropdownMenu>
            <IoMdArrowDropdown />
          </Dropdown>
        </div>
        {/**Emergency Details  */}
        <h2 className="">Emergency Details:</h2>
        <div className="w-full ">
          <div className="flex gap-10 mb-4">
            <div className="w-full">
              <label>Guardians Name</label>
              <Input name="text" required />
            </div>
            <div className="w-full">
              <label>Guardians NUmber</label>
              <Input name="text" required />
            </div>
          </div>
          <div className="">
            <label>Relationship</label>
            <Input name="text" required />
          </div>
        </div>
        <Button type="submit" variant="primary">
          Save
        </Button>
      </Form>
    </div>
  );
};

export default PersonalInformation;
