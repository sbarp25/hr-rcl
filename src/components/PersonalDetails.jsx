import { Input } from "@nextui-org/react";
import React from "react";

const PersonalDetails = ({ formData, handleNestedChange }) => {
  const relations = ["Father", "Mother", "Brother", "Sister"];
  const BloodGroup = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  const gender = ["Male", "Female"];
  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Personal Information</h2>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="email"
              placeholder="Email"
              value={formData.personalInfo.email}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  null,
                  "email",
                  e.target.value
                )
              }
              className="w-full p-2 border rounded"
            />
            <select
              value={formData.personalInfo.gender}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  null,
                  "gender",
                  e.target.value
                )
              }
              className="w-full p-2 border rounded">
              <option value="">Select Gender</option>
              {gender.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-full gap-x-4">
            <Input
              type="date"
              placeholder="Date of Birth"
              value={formData.personalInfo.dob}
              onChange={(e) =>
                handleNestedChange("personalInfo", null, "dob", e.target.value)
              }
              className="w-full p-2 border rounded"
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
            {/* <Input
      type="text"
      placeholder="Blood Type"
      value={formData.personalInfo.bloodType}
      onChange={(e) =>
        handleNestedChange(
          "personalInfo",
          null,
          "bloodType",
          e.target.value
          )
          }
          className="w-full p-2 border rounded"
          /> */}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Guardian Details</h3>
          <div className="flex gap-x-4 w-full">
            <Input
              type="text"
              placeholder="Guardian Name"
              value={formData.personalInfo.guardian.name}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  "guardian",
                  "name",
                  e.target.value
                )
              }
              className="w-full p-2 border rounded"
            />
            <Input
              type="text"
              placeholder="Guardian Phone"
              value={formData.personalInfo.guardian.phone}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  "guardian",
                  "phone",
                  e.target.value
                )
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <select
            value={formData.personalInfo.guardian.relation}
            onChange={(e) =>
              handleNestedChange(
                "personalInfo",
                "guardian",
                "relation",
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
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Emergency Details</h3>
          <div className="flex gap-x-4 w-full">
            <Input
              type="text"
              placeholder="Emergency Name"
              value={formData.personalInfo.emergency.name}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  "emergency",
                  "name",
                  e.target.value
                )
              }
              className="w-full p-2 border rounded"
            />
            <Input
              type="text"
              placeholder="Emergency Phone"
              value={formData.personalInfo.emergency.phone}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  "emergency",
                  "phone",
                  e.target.value
                )
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <Input
            type="text"
            placeholder="Emergency Relation"
            value={formData.personalInfo.emergency.relation}
            onChange={(e) =>
              handleNestedChange(
                "personalInfo",
                "emergency",
                "relation",
                e.target.value
              )
            }
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
