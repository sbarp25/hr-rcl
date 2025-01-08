import React, { useState } from "react";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "react-toastify";
import { Input } from "@nextui-org/react";

const EducationalDetails = ({ formData, handleNestedChange }) => {
  const degrees = ["High School", "Bachelor's", "Master's", "PhD"];
  const statusOptions = ["Completed", "Ongoing"];
  const [isLoading, setIsLoading] = useState(false);
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleNestedChange("education", null, "files", files);
  };

  const handleEducation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newData = {
      data: {
        userName: "0",
        degree: formData.education.degree,
        // institution: formData.education.institution,
        startYear: formData.education.startYear,
        endYear: formData.education.endYear,
        status: formData.education.status,
        documentUrl: formData.education.files,
        educationDocumentFile: formData.education.files,
        currentlyStudying: formData.education.currentlyStudying,
      },
    };
    try {
      const response = await axiosInstance.post(
        "/user-education/save",
        newData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.responseCode === "201") {
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-700">
        Educational Details
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Degree
          </label>
          <select
            className="border border-gray-300 p-2 rounded-md w-full"
            // value={formData.education.degree}
            onChange={(e) =>
              handleNestedChange("education", null, "degree", e.target.value)
            }>
            <option value="">Select Degree</option>
            {degrees.map((degree) => (
              <option key={degree} value={degree}>
                {degree}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Year
            </label>
            <Input
              type="date"
              className="border border-gray-300 p-2 rounded-md w-full"
              // value={formData.education.startYear}
              onChange={(e) =>
                handleNestedChange(
                  "education",
                  null,
                  "startYear",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Year
            </label>
            <Input
              type="date"
              className="border border-gray-300 p-2 rounded-md w-full"
              // value={formData.education.endYear}
              onChange={(e) =>
                handleNestedChange("education", null, "endYear", e.target.value)
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              className="border border-gray-300 p-2 rounded-md w-full"
              // value={formData.education.status}
              onChange={(e) =>
                handleNestedChange("education", null, "status", e.target.value)
              }>
              <option value="">Select Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Files
            </label>
            <Input
              type="file"
              className="border border-gray-300 p-2 rounded-md w-full"
              multiple
              onChange={handleFileChange}
            />
            <p className="text-sm text-gray-500 mt-1">
              You can upload multiple files.
            </p>
          </div>
          <div className="flex gap-x-4">
            <input
              type="checkbox"
              className="border border-gray-300 p-2 rounded-md w-3"
              // onChange={formData.education.currentlyStudying}
            />
            <label className="block text-sm font-medium text-gray-700">
              Are you currently A student?
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalDetails;
