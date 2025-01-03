import React, { useState } from "react";
import { Form, Input, Button } from "@nextui-org/react";
import { DateInput } from "@nextui-org/date-input";
import { CalendarDate } from "@internationalized/date";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

const PersonalInformation = ({ formData, setFormData }) => {
  const [localFormData, setLocalFormData] = useState(formData || {});
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("text");
  const [selectedRelationship, setSelectedRelationship] = useState("mother");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData(localFormData); // Update parent state
    console.log("Form Data:", JSON.stringify(localFormData, null, 2)); // Debugging
  };

  return (
    <div className="container">
      <h2 className="h2-text">Personal Information</h2>
      <Form onSubmit={handleSubmit}>
        <div className="w-full">
          <label className="label-text">Email:</label>
          <Input
            name="email"
            label="Email"
            required
            onChange={handleInputChange}
            aria-label
          />
        </div>
        <div className="flex w-full gap-x-8">
          <div className="w-1/2 h-4">
            <label className="label-text">Date Of Birth</label>
            <DateInput
              name="dob"
              aria-label
              placeholderValue={new CalendarDate(1995, 11, 6)}
              onChange={(date) =>
                setLocalFormData((prev) => ({
                  ...prev,
                  dob: date.toString(),
                }))
              }
            />
          </div>
          <div className="w-1/2">
            <label className="label-text">Blood Group</label>
            <Dropdown>
              <DropdownTrigger>
                <Input isReadOnly label={selectedBloodGroup} />
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Blood Group"
                selectedKeys={new Set([selectedBloodGroup])}
                selectionMode="single"
                onSelectionChange={(keys) =>
                  setSelectedBloodGroup(Array.from(keys)[0])
                }>
                <DropdownItem key="A+">A+</DropdownItem>
                <DropdownItem key="B+">B+</DropdownItem>
                <DropdownItem key="O+">O+</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <h2 className="h2-text">Guardians Details</h2>
        <div className="flex w-full gap-x-10">
          <div className="w-full">
            <label className="label-text">Guardians Name</label>
            <Input
              name="guardianName"
              label="Guardian's Name"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full">
            <label className="label-text">Guardians Number</label>
            <Input
              name="guardianNumber"
              label="Guardian's Number"
              required
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className=" w-full gap-x-10">
          <label className="label-text">Relationship</label>
          <Dropdown>
            <DropdownTrigger>
              <Input isReadOnly label={selectedRelationship} />
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Relationship"
              selectedKeys={new Set([selectedRelationship])}
              selectionMode="single"
              onSelectionChange={(keys) =>
                setSelectedRelationship(Array.from(keys)[0])
              }>
              <DropdownItem key="mother">Mother</DropdownItem>
              <DropdownItem key="father">Father</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <Button type="submit" variant="primary">
          Save
        </Button>
      </Form>
    </div>
  );
};

export default PersonalInformation;
