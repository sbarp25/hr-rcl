import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axios-Instance";
import { Button, Input } from "@nextui-org/react";
import { toast } from "react-toastify";

const DocumentDetails = ({ formData, handleNext, handleBack, setFormData }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Utility function to handle nested changes
  const handleNestedChange = (parentKey, childKey, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [parentKey]: {
        ...prevState[parentKey],
        [childKey]: value,
      },
    }));
  };

  const onSubmit = async () => {
    setIsLoading(true);

    const formDataToSubmit = new FormData();

    // Append form data
    formDataToSubmit.append("panNumber", formData.documents.panNumber);
    formDataToSubmit.append("panIssueDate", formData.documents.panIssueDate);
    formDataToSubmit.append("panIssuePlace", formData.documents.panIssuePlace);
    formDataToSubmit.append(
      "citizenshipNumber",
      formData.documents.citizenshipNumber
    );
    formDataToSubmit.append(
      "citizenshipIssueDate",
      formData.documents.issuedDate
    );
    formDataToSubmit.append(
      "citizenshipIssuedPlaceDistrict",
      formData.documents.isIssuedPlaceDistrict
    );

    // Append Files
    if (formData.documents.citizenshipFrontDocumentFile instanceof File) {
      formDataToSubmit.append(
        "citizenshipFrontDocumentFile",
        formData.documents.citizenshipFrontDocumentFile
      );
    }
    if (formData.documents.citizenshipBackDocumentFile instanceof File) {
      formDataToSubmit.append(
        "citizenshipBackDocumentFile",
        formData.documents.citizenshipBackDocumentFile
      );
    }
    if (formData.documents.panCardDocumentFile instanceof File) {
      formDataToSubmit.append(
        "panCardDocumentFile",
        formData.documents.panCardDocumentFile
      );
    }

    try {
      const response = await axiosInstance.post(
        "/user-documents/create",
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.responseCode === "201") {
        toast.success("Document details saved successfully!");
      } else {
        toast.error("Failed to save document details.");
      }
    } catch (error) {
      console.error("Error saving document details:", error);
      toast.error("Error saving document details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextSubmit = () => {
    onSubmit();
    handleNext();
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const fetchDocumentDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          "/user-documents/get/documentDetails",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (response.data.responseCode === "200") {
          const data = response.data.data;

          setFormData((prev) => ({
            ...prev,
            documents: {
              panNumber: data.panNumber || "",
              panIssuePlace: data.panIssuePlace || "",
              citizenshipNumber: data.citizenshipNumber || "",
              panIssueDate: data.panIssueDate || "",
              issuedDate: data.citizenshipIssueDate || "",
              isIssuedPlaceDistrict: data.citizenshipIssuedPlaceDistrict || "",
              panCardDocumentFile: data.panCardDocumentUrl || null,
              citizenshipFrontDocumentFile:
                data.citizenshipFrontDocumentUrl || null,
              citizenshipBackDocumentFile:
                data.citizenshipBackDocumentUrl || null,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching document details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [setFormData]);

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
            value={formData.documents.panNumber}
            onChange={(e) =>
              handleNestedChange("documents", "panNumber", e.target.value)
            }
            placeholder="Enter your PAN number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Issued Date
          </label>
          <Input
            type="date"
            value={formData.documents.panIssueDate}
            onChange={(e) =>
              handleNestedChange("documents", "panIssueDate", e.target.value)
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Issued Place
            </label>
            <Input
              type="text"
              value={formData.documents.panIssuePlace}
              onChange={(e) =>
                handleNestedChange("documents", "panIssuePlace", e.target.value)
              }
              placeholder="Enter PAN issued place"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload PAN Photo
            </label>
            {formData.documents.panCardDocumentFile && (
              <a
                href={formData.documents.panCardDocumentFile}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 underline mb-2">
                View Uploaded PAN Card
              </a>
            )}
            <Input
              type="file"
              onChange={(e) =>
                handleNestedChange(
                  "documents",
                  "panCardDocumentFile",
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
              value={formData.documents.citizenshipNumber}
              onChange={(e) =>
                handleNestedChange(
                  "documents",
                  "citizenshipNumber",
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
              value={formData.documents.issuedDate}
              onChange={(e) =>
                handleNestedChange("documents", "issuedDate", e.target.value)
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Issued Place
            </label>
            <Input
              type="text"
              value={formData.documents.isIssuedPlaceDistrict}
              onChange={(e) =>
                handleNestedChange(
                  "documents",
                  "isIssuedPlaceDistrict",
                  e.target.value
                )
              }
              placeholder="Enter Citizenship Issued Place"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Front Photo of Citizenship
            </label>
            {formData.documents.citizenshipFrontDocumentFile && (
              <a
                href={formData.documents.citizenshipFrontDocumentFile}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 underline mb-2">
                View Uploaded Front Side
              </a>
            )}
            <Input
              type="file"
              onChange={(e) =>
                handleNestedChange(
                  "documents",
                  "citizenshipFrontDocumentFile",
                  e.target.files[0]
                )
              }
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Back Photo of Citizenship
          </label>
          {formData.documents.citizenshipBackDocumentFile && (
            <a
              href={formData.documents.citizenshipBackDocumentFile}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-blue-600 underline mb-2">
              View Uploaded Back Side
            </a>
          )}
          <Input
            type="file"
            onChange={(e) =>
              handleNestedChange(
                "documents",
                "citizenshipBackDocumentFile",
                e.target.files[0]
              )
            }
          />
        </div>
        <div className="form-navigation flex justify-between mt-6">
          <Button
            onPress={handleBack}
            className="px-4 py-2 bg-gray-300 rounded">
            Back
          </Button>
          <Button
            onPress={handleNextSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
