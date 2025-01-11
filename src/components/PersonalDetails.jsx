import { Button, DatePicker, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
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

  const onSubmit = async (e) => {
    // e.preventDefault();
    // setIsLoading(true);
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
    console.log(newData);
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
        // Reset the form
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

  const relations = ["Father", "Mother", "Brother", "Sister"];
  const BloodGroup = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  const gender = ["Male", "Female"];

  const handlenextsubmit = () => {
    handleNext();
    onSubmit();
  };
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Personal Information</h2>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="email"
            label="Email"
            value={formData.personalInfo.email}
            onChange={(e) =>
              handleNestedChange("personalInfo", null, "email", e.target.value)
            }
          />
          <select
            value={formData.personalInfo.gender}
            onChange={(e) =>
              handleNestedChange("personalInfo", null, "gender", e.target.value)
            }
            className="w-full p-2 border rounded">
            <option value="">Select Gender</option>
            {gender.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-full gap-x-4">
          <Input
            type="date"
            label="Date of Birth"
            value={formData.personalInfo.dob}
            onChange={(e) =>
              handleNestedChange("personalInfo", null, "dob", e.target.value)
            }
          />
          <select
            value={formData.personalInfo.bloodType}
            onChange={(e) =>
              handleNestedChange(
                "personalInfo",
                null,
                "bloodType",
                e.target.value
              )
            }
            className="w-full p-2 border rounded">
            <option value="">Select Blood Group</option>
            {BloodGroup.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
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

        <select
          value={formData.personalInfo.guardianRelation}
          onChange={(e) =>
            handleNestedChange(
              "personalInfo",
              null,
              "guardianRelation",
              e.target.value
            )
          }
          className="w-full p-2 border rounded">
          <option value="">Select Relation</option>
          {relations.map((relation) => (
            <option key={relation} value={relation}>
              {relation}
            </option>
          ))}
        </select>
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
          className="px-4 py-2 bg-gray-300 rounded">
          Back
        </Button>
        <Button
          onPress={handlenextsubmit}
          className="px-4 py-2 bg-green-500 text-white rounded">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default PersonalDetails;
