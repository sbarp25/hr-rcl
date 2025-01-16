import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "react-toastify";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { TimeInput } from "@nextui-org/react";
import { Time } from "@internationalized/date";
import { FaRegEye } from "react-icons/fa";
const EducationalDetails = ({ formData, setFormData, handleBack }) => {
  const degrees = ["SEE/SLC", "+2", "Bachelor's", "Master's", "PhD"];
  const [selectedDegree, setSelectedDegree] = useState("");
  const statusOptions = ["COMPLETED", "IN_PROGRESS"];
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  const navigate = useNavigate();
  const [educationalDocument, setEducationalDocument] = useState(false);
  const numberOfItems = selectedDegree
    ? degrees.indexOf(selectedDegree) + 1
    : 0;

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      education: degrees
        .slice(0, numberOfItems)
        .map((_, i) => prev.education[i] || {}),
    }));
  }, [numberOfItems, setFormData]);

  const handleFileChange = (index, files) => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education.slice(0, index),
        { ...prev.education[index], files },
        ...prev.education.slice(index),
      ],
    }));
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
    for (let i = 0; i < formData.education.length; i++) {
      const edu = formData.education[i];
      if (!edu.institution || !edu.startYear || !edu.endYear || !edu.status) {
        toast.error(`Please fill all required fields for ${degrees[i]}.`);
        return false;
      }
    }
    return true;
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

  const onSubmit = async () => {
    if (!validateFields()) return;
    setIsLoading(true);

    const formDataToSend = new FormData();

    formDataToSend.append("isCurrentlyStudying", isCurrentlyStudying);

    if (isCurrentlyStudying === true) {
      const formattedTime = handleTimeChange(Time);
      if (formattedTime) {
        formDataToSend.append("expectedCheckingTime", formattedTime);
      }
    }

    formData.education.forEach((edu, eduIndex) => {
      formDataToSend.append(`eduData[${eduIndex}].degree`, degrees[eduIndex]);
      formDataToSend.append(
        `eduData[${eduIndex}].institution`,
        edu.institution || ""
      );
      formDataToSend.append(`eduData[${eduIndex}].faculty`, edu.faculty || "");
      formDataToSend.append(
        `eduData[${eduIndex}].startYear`,
        edu.startYear || ""
      );
      formDataToSend.append(`eduData[${eduIndex}].endYear`, edu.endYear || "");
      formDataToSend.append(`eduData[${eduIndex}].status`, edu.status || "");
      formDataToSend.append(
        `eduData[${eduIndex}].imageIndex`,
        `${eduIndex + 1}` || ""
      );

      if (edu.files?.length) {
        edu.files.forEach((file) => {
          formDataToSend.append(`imageAttachments[${eduIndex}]`, file);
        });
      }
    });

    try {
      const response = await axiosInstance.post(
        "/api/v1/education/save",
        // "/user-education/create",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.responseCode === "200") {
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
          onChange={(e) => setSelectedDegree(e.target.value)}>
          {degrees.map((degree) => (
            <SelectItem key={degree} value={degree}>
              {degree}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Always render the zeroth index card */}
      {/* <div className="space-y-4 border p-4 rounded-md">
        <h3 className="text-lg font-semibold text-gray-600">
          {degrees[0]} Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Institution
            </label>
            <Input
              classNames={{
                inputWrapper: "shadow-lg",
              }}
              variant="bordered"
              type="text"
              placeholder="Institution"
              value={formData?.education[0]?.institution || ""}
              onChange={(e) => handleChange(0, "institution", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Faculty
            </label>
            <Input
              classNames={{
                inputWrapper: "shadow-lg",
              }}
              variant="bordered"
              type="text"
              placeholder="Faculty"
              value={formData.education[0]?.faculty || ""}
              onChange={(e) => handleChange(0, "faculty", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Year
            </label>
            <Input
              classNames={{
                inputWrapper: "shadow-lg",
              }}
              variant="bordered"
              type="date"
              value={formData.education[0]?.startYear || ""}
              onChange={(e) => handleChange(0, "startYear", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Year
            </label>
            <Input
              classNames={{
                inputWrapper: "shadow-lg",
              }}
              variant="bordered"
              type="date"
              value={formData.education[0]?.endYear || ""}
              onChange={(e) => handleChange(0, "endYear", e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <Select
              variant="bordered"
              className="w-full"
              label="Select Status"
              value={formData.education[0]?.status || ""}
              onChange={(e) => handleChange(0, "status", e.target.value)}>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Files
            </label>
            <Input
              classNames={{
                inputWrapper: "shadow-lg",
              }}
              variant="bordered"
              type="file"
              multiple
              onChange={(e) => handleFileChange(0, Array.from(e.target.files))}
            />
          </div>
        </div>
      </div> */}
      {Array.from({ length: numberOfItems }).map((_, index) => (
        <div key={index} className="space-y-4 border p-4 rounded-md">
          <h3 className="text-lg font-semibold text-gray-600">
            {degrees[index]} Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                variant="bordered"
                type="text"
                label="Institution"
                value={formData.education[index]?.institution || ""}
                onChange={(e) =>
                  handleChange(index, "institution", e.target.value)
                }
              />
            </div>
            <div>
              <Input
                variant="bordered"
                type="text"
                label="Faculty"
                value={formData.education[index]?.faculty || ""}
                onChange={(e) => handleChange(index, "faculty", e.target.value)}
              />
            </div>
            <div>
              <Input
                variant="bordered"
                type="date"
                label="Select Start Date"
                value={formData.education[index]?.startYear || ""}
                onChange={(e) =>
                  handleChange(index, "startYear", e.target.value)
                }
              />
            </div>
            <div>
              <Input
                variant="bordered"
                type="date"
                label="Select End Date"
                value={formData.education[index]?.endYear || ""}
                onChange={(e) => handleChange(index, "endYear", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select
                variant="bordered"
                className="w-full"
                label="Status"
                value={formData.education[index]?.status || ""}
                onChange={(e) => handleChange(index, "status", e.target.value)}>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <Input
                label="Upload Document"
                variant="bordered"
                type="file"
                onChange={(e) =>
                  handleFileChange(index, Array.from(e.target.files))
                }
              />
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
                      className="block text-sm text-green-600 underline mb-2">
                      <span className="flex items-center gap-x-2">
                        <FaRegEye />
                        View Uploaded Document
                      </span>
                    </a>
                  ) : (
                    <div className="text-xs text-red-500">No Links Found</div>
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
          onClick={onSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded"
          disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default EducationalDetails;
