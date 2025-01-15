import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "react-toastify";
import {
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const EducationalDetails = ({
  formData,
  handleNestedChange,
  handleNext,
  setFormData,
  handleBack,
}) => {
  const degrees = ["SEE/SLC", "+2", "Bachelor's", "Master's", "PhD"];
  const [selectedDegree, setSelectedDegree] = useState("");
  const statusOptions = ["Completed", "Ongoing"];
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const numberOfItems = selectedDegree
    ? degrees.indexOf(selectedDegree) + 1
    : 0;

  // Ensure formData.education has enough entries to render inputs
  while (formData.education.length < numberOfItems) {
    formData.education.push({});
  }

  const handleFileChange = (index, files) => {
    const updatedEducation = [...formData.education];
    const updatedFiles = [...(updatedEducation[index]?.files || []), ...files];

    updatedEducation[index] = {
      ...updatedEducation[index],
      files: updatedFiles,
    };

    setFormData({
      ...formData,
      education: updatedEducation,
    });
  };

  const handleChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      education: updatedEducation,
    });
  };

  const onSubmit = async () => {
    setIsLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("userName", localStorage.getItem("fullName"));

    // Append education details
    formData.education.forEach((edu, index) => {
      formDataToSend.append(`eduData[${index}].degree`, edu.degree);
      formDataToSend.append(`eduData[${index}].institution`, edu.institution);
      formDataToSend.append(`eduData[${index}].faculty`, edu.faculty);
      formDataToSend.append(`eduData[${index}].startYear`, edu.startYear);
      formDataToSend.append(`eduData[${index}].endYear`, edu.endYear);
      formDataToSend.append(`eduData[${index}].status`, edu.status);

      // Append files for each degree
      if (edu.files?.length) {
        edu.files.forEach((file, fileIndex) => {
          formDataToSend.append(`educationFiles[${index}][${fileIndex}]`, file);
        });
      }
    });

    try {
      const response = await axiosInstance.post(
        "/api/userEducation/save",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.responseCode === "201") {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error("Failed to save educational details.");
      }
    } catch (error) {
      console.error("Error uploading educational details:", error);
      toast.error("An error occurred while saving educational details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const fetchEducationDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/userEducation", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.data.responseCode === "200") {
          const data = response.data.data;

          setFormData((prev) => ({
            ...prev,
            documents: {
              panNumber: data.panNumber || "",
              panissuedPlace: data.panissuedPlace || "",
              citizenshipNumber: data.citizenshipNumber || "",
              issuedDate: data.issueDate || "",
              citizenshipIssuedPlaceDistrict:
                data.citizenshipIssuedPlaceDistrict || "",
              panCardDocumentFile: null, // Assuming you want to keep the file input as null when fetching
              citizenshipFrontDocumentFile: null,
              citizenshipBackDocumentFile: null,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching document details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEducationDetails();
  }, [setFormData]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-700">
        Educational Details
      </h2>
      <div>
        <Dropdown>
          <DropdownTrigger>
            <Input className="text-left" label="Degree">
              {selectedDegree || "Select Degree"}
            </Input>
          </DropdownTrigger>
          <DropdownMenu aria-label="Degree Selection">
            {degrees.map((degree) => (
              <DropdownItem
                key={degree}
                onClick={() => setSelectedDegree(degree)}
              >
                {degree}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      {Array.from({ length: numberOfItems }).map((_, index) => (
        <div key={index} className="space-y-4 border p-4 rounded-md">
          <h3 className="text-lg font-semibold text-gray-600">
            {degrees[index]} Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Institution
              </label>
              <Input
                type="text"
                label="Institution"
                value={formData.education[index]?.institution || ""}
                onChange={(e) =>
                  handleChange(index, "institution", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Faculty
              </label>
              <Input
                type="text"
                label="Faculty"
                value={formData.education[index]?.faculty || ""}
                onChange={(e) => handleChange(index, "faculty", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Year
              </label>
              <Input
                type="date"
                value={formData.education[index]?.startYear || ""}
                onChange={(e) =>
                  handleChange(index, "startYear", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Year
              </label>
              <Input
                type="date"
                value={formData.education[index]?.endYear || ""}
                onChange={(e) => handleChange(index, "endYear", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <Dropdown>
                <DropdownTrigger>
                  <Input readOnly className="text-left" label="Status">
                    {formData.education[index]?.status || "Select Status"}
                  </Input>
                </DropdownTrigger>
                <DropdownMenu aria-label="Status Selection">
                  {statusOptions.map((status) => (
                    <DropdownItem
                      key={status}
                      onClick={() => handleChange(index, "status", status)}
                    >
                      {status}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Files
              </label>
              <Input
                type="file"
                multiple
                onChange={(e) =>
                  handleFileChange(index, Array.from(e.target.files))
                }
              />
            </div>
          </div>
          <div className="flex gap-x-4">
            <input
              type="checkbox"
              className="border border-gray-300 p-2 rounded-md w-3"
              onChange={(e) =>
                handleNestedChange(
                  "education",
                  null,
                  "currentlyStudying",
                  e.target.checked
                )
              }
            />
            <label className="block text-sm font-medium text-gray-700">
              Are you currently a student?
            </label>
          </div>
        </div>
      ))}

      <div className="form-navigation flex justify-between mt-6">
        <Button onPress={handleBack} className="px-4 py-2 bg-gray-300 rounded">
          Back
        </Button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default EducationalDetails;
