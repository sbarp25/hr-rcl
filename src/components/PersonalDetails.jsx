import {
  Button,
  DatePicker,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import React, { useState } from "react";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "react-toastify";

const PersonalDetails = ({
  formData,
  handleNestedChange,
  handleNext,
  setFormData,
  handleBack,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const genderOptions = ["Male", "Female"];
  const bloodGroupOptions = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  const relationOptions = ["Father", "Mother", "Brother", "Sister"];

  const onSubmit = async () => {
    const newData = {
      data: {
        email: formData.personalInfo.email,
        dateOfBirthAd: formData.personalInfo.dob,
        gender: formData.personalInfo.gender,
        bloodGroup: formData.personalInfo.bloodType,
        emergencyNumber: formData.personalInfo.emergencyNumber,
        emergencyName: formData.personalInfo.emergencyName,
        emergencyType: formData.personalInfo.emergencyRelation,
        guardianName: formData.personalInfo.guardianName,
        guardianType: formData.personalInfo.guardianRelation,
        guardianNumber: formData.personalInfo.guardianPhone,
      },
    };

    try {
      const response = await axiosInstance.post(
        "/api/v1/personal-detail",
        newData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.responseCode === "201") {
        setFormData({
          email: "",
          dob: "",
          bloodType: "",
          emergencyNumber: "",
          emergencyName: "",
          emergencyType: "",
          guardianName: "",
          guardianType: "",
          guardianNumber: "",
        });
        toast.success(response.data.message);
      } else {
        toast.error("Failed to add employee.");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Error adding employee.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlenextsubmit = () => {
    handleNext();
    onSubmit();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Personal Information</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="email"
            label="Email"
            value={formData.personalInfo.email}
            onChange={(e) =>
              handleNestedChange("personalInfo", null, "email", e.target.value)
            }
          />

          {/* Gender Dropdown */}
          <div className="flex items-center">
            <Dropdown>
              <DropdownTrigger>
                <Input
                  readOnly
                  className="text-left"
                  value={formData.personalInfo.gender}
                  label="Gender"
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select Gender"
                selectionMode="single"
                selectedKeys={[formData.personalInfo.gender]}
                onSelectionChange={(keys) =>
                  handleNestedChange(
                    "personalInfo",
                    null,
                    "gender",
                    [...keys][0]
                  )
                }
              >
                {genderOptions.map((g) => (
                  <DropdownItem key={g}>{g}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <div className="flex  gap-x-4">
          {/* DatePicker for Date of Birth */}
          <DatePicker
            classNames="max-w-[50%] w-full"
            label="Date of Birth"
            isRequired
            selected={formData.personalInfo.dob}
            onChange={(date) =>
              handleNestedChange("personalInfo", null, "dob", date)
            }
          />

          {/* Blood Group Dropdown */}
          <div className="flex items-center  w-full">
            <Dropdown>
              <DropdownTrigger>
                <Input
                  readOnly
                  className="text-left"
                  value={formData.personalInfo.bloodType}
                  label="Blood Group"
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select Blood Group"
                selectionMode="single"
                selectedKeys={[formData.personalInfo.bloodType]}
                onSelectionChange={(keys) =>
                  handleNestedChange(
                    "personalInfo",
                    null,
                    "bloodType",
                    [...keys][0]
                  )
                }
              >
                {bloodGroupOptions.map((group) => (
                  <DropdownItem key={group}>{group}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
      {/* Guardian Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Guardian Details</h3>
        <div className="flex gap-x-4 w-full">
          <Input
            type="text"
            label="Guardian Name"
            value={formData.personalInfo.guardianName}
            onChange={(e) =>
              handleNestedChange(
                "personalInfo",
                null,
                "guardianName",
                e.target.value
              )
            }
          />

          <Input
            type="text"
            label="Guardian Phone"
            value={formData.personalInfo.guardianPhone}
            onChange={(e) =>
              handleNestedChange(
                "personalInfo",
                null,
                "guardianPhone",
                e.target.value
              )
            }
          />
        </div>

        {/* Guardian Relation Dropdown */}
        <div className="flex items-center max-w-[49.5%]">
          <Dropdown>
            <DropdownTrigger>
              <Input
                readOnly
                className="text-left"
                value={formData.personalInfo.guardianRelation}
                label="Guardian Relation"
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Select Relation"
              selectionMode="single"
              selectedKeys={[formData.personalInfo.guardianRelation]}
              onSelectionChange={(keys) =>
                handleNestedChange(
                  "personalInfo",
                  null,
                  "guardianRelation",
                  [...keys][0]
                )
              }
            >
              {relationOptions.map((relation) => (
                <DropdownItem key={relation}>{relation}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* Emergency Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Emergency Details</h3>
        <div className="flex gap-x-4 w-full">
          <Input
            type="text"
            label="Emergency Name"
            value={formData.personalInfo.emergencyName}
            onChange={(e) =>
              handleNestedChange(
                "personalInfo",
                null,
                "emergencyName",
                e.target.value
              )
            }
          />
          <Input
            type="text"
            label="Emergency Phone"
            value={formData.personalInfo.emergencyNumber}
            onChange={(e) =>
              handleNestedChange(
                "personalInfo",
                null,
                "emergencyNumber",
                e.target.value
              )
            }
          />
        </div>
        <Input
          className="max-w-[49.5%]"
          type="text"
          label="Emergency Relation"
          value={formData.personalInfo.emergencyRelation}
          onChange={(e) =>
            handleNestedChange(
              "personalInfo",
              null,
              "emergencyRelation",
              e.target.value
            )
          }
        />
      </div>

      <div className="flex justify-between mt-6">
        <Button
          onPress={handleBack}
          isDisabled
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Back
        </Button>
        <Button
          onPress={handlenextsubmit}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default PersonalDetails;
