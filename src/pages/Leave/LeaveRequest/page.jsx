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
import { useState } from "react";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import InputComponent from "../../../components/InputComponent";
import { useForm } from "react-hook-form";
const LeaveRequest = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });

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
      <div className="container flex flex-col">
        <BreadcrumbsComponent items={breadcrumbItems} />
        <div className="page-title -pl-2">Leave Request</div>
        <form>
          <InputComponent
            name="email"
            control={control}
            variant="bordered"
            label="Email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid email address",
              },
            }}
          />
          <InputComponent
            name="email"
            control={control}
            variant="bordered"
            label="Description"
            rules={{
              required: "Description is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid email address",
              },
            }}
          />
          <div className="mb-4">
            <Select
              variant="bordered"
              label="Select an Department"
              color={errors.department ? "danger" : "default"}
              className={`  rounded-xl ${
                errors.department ? "border-2 border-red-500" : ""
              }`}
              {...register("department", {
                required: "Department is required",
              })}
              errorMessage={errors.department?.message}>
              {departmentsData?.map((dept) => (
                <SelectItem key={dept.id} textValue={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequest;
