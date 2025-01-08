import React, { useState } from "react";
import axiosInstance from "../lib/axios-Instance";
import { Input } from "@nextui-org/react";
import { toast } from "react-toastify";

const DocumentDetails = ({ formData, handleNestedChange }) => {
  const districts = ["District A", "District B", "District C"]; // Replace with actual options
  const [isLoading, setIsLoading] = useState(false);

  const handleDocument = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newData = {
      data: {
        userDocumentId: 0,
        userName: "Odinson",
        usersId: "0",
        documentType: "string",
        documentNumber: "string",
        issueDate: "2025-01-05",
        expiryDate: "2025-01-05",
        documentUrl: "string",
        citizenshipFrontDocumentFile: "string",
        citizenshipBackDocumentFile: "string",
        panCardDocumentFile: "string",
      },
    };
    try {
      const response = await axiosInstance.post(
        "/user-document/save",
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
          guardian: { name: "", phone: "", relation: "" },
          emergency: { name: "", phone: "", relation: "" },
        });
        toast.success("Employee added successfully!");
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
      <h2 className="text-2xl font-semibold text-gray-700">Document Details</h2>

      {/* PAN Details Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-600">PAN Details</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            PAN Number
          </label>
          <Input
            type="text"
            className="border border-gray-300 p-2 rounded-md w-full"
            // value={formData.documents.pan.number}
            onChange={(e) =>
              handleNestedChange("documents", "pan", "number", e.target.value)
            }
            placeholder="Enter your PAN number"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 w-1/2">
              Issued Place
            </label>
            <select
              className="border border-gray-300 p-2 rounded-md w-full"
              // value={formData.documents.pan.issuedPlace}
              onChange={(e) =>
                handleNestedChange(
                  "documents",
                  "pan",
                  "issuedPlace",
                  e.target.value
                )
              }>
              <option value="">Select Issued Place</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className=" text-sm font-medium text-gray-700 w-1/2">
              Upload PAN Photo
            </label>
            <Input
              type="file"
              className="border border-gray-300 p-2 rounded-md w-full"
              onChange={(e) =>
                handleNestedChange(
                  "documents",
                  "pan",
                  "file",
                  e.target.files[0]
                )
              }
            />
          </div>
        </div>
      </div>
      {/* Citizenship Details Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-600">
          Citizenship Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Citizenship Number
            </label>
            <Input
              type="text"
              className="border border-gray-300 p-2 rounded-md w-full"
              // value={formData.documents.citizenship.number}
              onChange={(e) =>
                handleNestedChange(
                  "documents",
                  "citizenship",
                  "number",
                  e.target.value
                )
              }
              placeholder="Enter Citizenship Number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Issued Date
            </label>
            <Input
              type="date"
              className="border border-gray-300 p-2 rounded-md w-full"
              // value={formData.documents.citizenship.issuedDate}
              onChange={(e) =>
                handleNestedChange(
                  "documents",
                  "citizenship",
                  "issuedDate",
                  e.target.value
                )
              }
            />
          </div>
        </div>
        <div className=" grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Issued Place
            </label>
            <select
              className="border border-gray-300 p-2 rounded-md w-full"
              // value={formData.documents.citizenship.issuedPlace}
              onChange={(e) =>
                handleNestedChange(
                  "documents",
                  "citizenship",
                  "issuedPlace",
                  e.target.value
                )
              }>
              <option value="">Select Issued Place</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Citizenship Photo
            </label>
            <Input
              type="file"
              className="border border-gray-300 p-2 rounded-md w-full"
              onChange={(e) =>
                handleNestedChange(
                  "documents",
                  "citizenship",
                  "file",
                  e.target.files[0]
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
