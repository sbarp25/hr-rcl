import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "react-toastify";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

import { TimeInput } from "@nextui-org/react";
import { Time } from "@internationalized/date";
import { FaRegEye } from "react-icons/fa";
import Inputcomp from "./Inputcomp";
import { Input } from "@nextui-org/input";

const EducationalDetails = ({ formData, setFormData, handleBack }) => {
  const [errors, setErrors] = useState({});
  const degrees = ["SEE/SLC", "+2", "Bachelor's", "Master's", "PhD"];
  const [selectedDegree, setSelectedDegree] = useState("");
  const statusOptions = ["COMPLETED", "IN_PROGRESS"];
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  const navigate = useNavigate();
  const [educationalDocument, setEducationalDocument] = useState(false);
  const degreeIndex = degrees.indexOf(selectedDegree);
  const [numberOfItems, setNumberOfItems] = useState(0);

  useEffect(() => {
    if (degrees.includes(selectedDegree)) {
      const index = degrees.indexOf(selectedDegree);
      setFormData((prev) => {
        console.log("Previous formData:", prev); // Debugging
        return {
          ...prev,
          education: degrees
            .slice(0, index + 1)
            .map((_, i) => (prev.education ? prev.education[i] || {} : {})),
        };
      });
    }
  }, [selectedDegree]);

  const handleFileChange = (index, files) => {
    setFormData((prev) => {
      const updatedEducation = [...prev.education];
      const targetIndex = index - 1; // Adjust the index to index - 1

      // Ensure targetIndex is valid (within bounds)
      if (targetIndex >= 0 && targetIndex < updatedEducation.length) {
        updatedEducation[targetIndex] = {
          ...updatedEducation[targetIndex],
          files,
        };
      }

      return { ...prev, education: updatedEducation };
    });
    setEducationalDocument(false);
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

  const validateFields = () => {
    let isValid = true;
    formData.education.forEach((edu, index) => {
      if (
        !edu.institution ||
        !edu.startYear ||
        !edu.endYear ||
        !edu.status ||
        !edu.faculty
      ) {
        toast.error(`Please fill all required fields for ${degrees[index]}.`);
        isValid = false;
      }
    });
    return isValid;
  };
  const handleTimeChange = (expectedCheckingTime) => {
    if (
      expectedCheckingTime &&
      typeof expectedCheckingTime.hour === "number" &&
      typeof expectedCheckingTime.minute === "number" &&
      typeof expectedCheckingTime.second === "number"
    ) {
      // Determine whether the time is AM or PM
      const hour = expectedCheckingTime.hour;
      const period = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12; // Convert to 12-hour format (12:00 is not 0:00)

      // Format the time as "hh:mm:ss AM/PM"
      const formattedTime =
        [
          String(hour12).padStart(2, "0"),
          String(expectedCheckingTime.minute).padStart(2, "0"),
          String(expectedCheckingTime.second).padStart(2, "0"),
        ].join(":") +
        " " +
        period;

      console.log("Formatted Time:", formattedTime);
      return formattedTime; // Return or use the formatted time as needed
    } else {
      console.error("Invalid time object:", expectedCheckingTime);
      return null;
    }
  };
  useEffect(() => {
    if (degrees.includes(selectedDegree)) {
      setNumberOfItems(degrees.indexOf(selectedDegree) + 1);
    } else {
      setNumberOfItems(0);
    }
  }, [selectedDegree]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    const fetchEducationDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/v1/education/getById", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data.responseCode === "200") {
          const data = response.data.datalist || [];

          setFormData((prev) => ({
            ...prev,
            education: data.map((edu) => ({
              degree: edu.degree || "",
              institution: edu.institution || "",
              faculty: edu.faculty || "",
              startYear: edu.startYear || "",
              endYear: edu.endYear || "",
              status: edu.status || "",
              file: edu.documentUrl || "", // If document URL is fetched
              files: [], // Initialize for user-uploaded files
            })),
          }));
        }
        setEducationalDocument(true);
      } catch (error) {
        console.error("Error fetching education details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEducationDetails();
  }, [setFormData]);

  const validateFormData = () => {
    const newErrors = {};

    const filteredEducation = formData.education.filter(
      (edu) => Object.keys(edu).length > 0
    );

    if (!filteredEducation.length) {
      newErrors.education = "At least one education entry is required.";
    } else {
      filteredEducation.forEach((edu, index) => {
        if (!edu.institution)
          newErrors[`institution_${index}`] = "Institution is required.";
        if (!edu.faculty)
          newErrors[`faculty_${index}`] = "Faculty is required.";
        if (!edu.startYear)
          newErrors[`startYear_${index}`] = "Start year is required.";
        if (!edu.status) newErrors[`status_${index}`] = "Status is required.";
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validateFormData()) return;

    setIsLoading(true);

    const formDataToSend = new FormData();

    formDataToSend.append(
      "educationData",
      JSON.stringify(
        formData?.education?.map((edu, index) => ({
          level: degrees[index] || "",
          institution: edu.institution || "",
          faculty: edu.faculty || "",
          startYear: edu.startYear || "",
          endYear: edu.endYear || "",
          status: edu.status || "",
          imageIndex: index,
        }))
      )
    );

    // Append files for each education record
    formData?.education?.forEach((edu, index) => {
      // If files exist at the current index or the adjusted index (index - 1)
      const targetIndex = index - 1;

      if (targetIndex >= 0 && targetIndex < formData.education.length) {
        const eduAtTargetIndex = formData.education[targetIndex];

        if (eduAtTargetIndex?.files && eduAtTargetIndex.files.length > 0) {
          eduAtTargetIndex.files.forEach((file) => {
            formDataToSend.append("files", file);
          });
        }
      }
      0;
    });

    formDataToSend.append("isCurrentlyStudying", isCurrentlyStudying);
    if (isCurrentlyStudying) {
      const currentTime = new Time(10); // Example time instance
      formDataToSend.append(
        "expectedCheckingTime",
        handleTimeChange(currentTime) || ""
      );
    }

    try {
      const response = await axiosInstance.post(
        "/api/v1/education/save",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
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

  const handleSubmit = () => {
    if (!validateFormData()) return;
    onSubmit();
  };
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-700">
        Educational Details
      </h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Level</label>
        <Select
          variant="bordered"
          className="w-full rounded-lg shadow-lg shadow-gray-300"
          label="Select A Degree"
          value={selectedDegree}
          onChange={(e) => {
            const selected = e.target.value;
            console.log("Dropdown selection:", selected);
            setSelectedDegree(selected);
          }}
        >
          {degrees.map((degree) => (
            <SelectItem key={degree} value={degree}>
              {degree}
            </SelectItem>
          ))}
        </Select>
      </div>
      {Array.from({ length: numberOfItems }).map((_, index) => (
        <div key={index} className="space-y-4 border p-4 rounded-md">
          <h3 className="text-lg font-semibold text-gray-600">
            {degrees[index]} Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Inputcomp
                variant="bordered"
                type="text"
                label="Institution"
                value={formData.education[index]?.institution || ""}
                onChange={(e) =>
                  handleChange(index, "institution", e.target.value)
                }
              />
              {errors[`institution_${index}`] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`institution_${index}`]}
                </p>
              )}
            </div>
            <div>
              <Inputcomp
                variant="bordered"
                type="text"
                label="Faculty"
                value={formData.education[index]?.faculty || ""}
                onChange={(e) => handleChange(index, "faculty", e.target.value)}
              />
              {errors[`faculty_${index}`] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`faculty_${index}`]}
                </p>
              )}
            </div>
            <div>
              <Inputcomp
                variant="bordered"
                type="date"
                label="Select Start Date"
                value={formData.education[index]?.startYear || ""}
                onChange={(e) =>
                  handleChange(index, "startYear", e.target.value)
                }
              />
              {errors[`startYear_${index}`] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`startYear_${index}`]}
                </p>
              )}
            </div>
            <div>
              <Inputcomp
                variant="bordered"
                type="date"
                label="Select End Date"
                value={formData.education[index]?.endYear || ""}
                onChange={(e) => handleChange(index, "endYear", e.target.value)}
              />
            </div>
            {errors[`endYear_${index}`] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[`endYear_${index}`]}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select
                variant="bordered"
                className="w-full"
                label="Status"
                placeholder={formData.education[index]?.status || ""}
                value={formData.education[index]?.status || ""}
                onChange={(e) => handleChange(index, "status", e.target.value)}
              >
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </Select>
              {errors[`status_${index}`] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`status_${index}`]}
                </p>
              )}
            </div>
            <div>
              <div>
                <Inputcomp
                  label="Upload Document"
                  variant="bordered"
                  type="file"
                  onChange={(e) =>
                    handleFileChange(index, Array.from(e.target.files))
                  }
                />
              </div>
              <div className="flex gap-x-4">
                <label className="block text-xs font-medium text-gray-700">
                  Please upload the image of type either PNG or jpg
                </label>
                {educationalDocument &&
                  (formData.education[index]?.file ? (
                    <a
                      href={formData.education[index]?.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-green-600 underline mb-2"
                    >
                      <span className="flex items-center gap-x-2">
                        <FaRegEye />
                        View Uploaded Document
                      </span>
                    </a>
                  ) : (
                    <div className="text-xs text-red-500">
                      No Links Available
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-x-4 ">
        <div>
          <input
            type="checkbox"
            className="border border-gray-300 rounded w-4 h-4"
            checked={isCurrentlyStudying}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setIsCurrentlyStudying(isChecked);
              setFormData((prev) => ({
                ...prev,
                currentlyStudying: isChecked,
              }));
            }}
          />
          <label className="text-sm font-medium text-gray-700">
            Are you currently a student?
          </label>
        </div>
        <div>
          {isCurrentlyStudying && (
            <div>
              <TimeInput
                label="Select Your Expected Time Of Arrival"
                defaultValue={new Time(10)}
                minValue={new Time(10)}
                onChange={(time) => {
                  const formattedTime = handleTimeChange(time);
                  console.log("Selected Time:", formattedTime);
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="form-navigation flex justify-between mt-6">
        <Button onPress={handleBack} className="px-4 py-2 bg-gray-300 rounded">
          Back
        </Button>
        <button
          onClick={() => {
            handleSubmit();
          }}
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
