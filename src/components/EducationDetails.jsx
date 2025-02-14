import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "react-toastify";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { TimeInput } from "@nextui-org/react";
import { FaRegEye } from "react-icons/fa";
import { Time } from "@internationalized/date";
import { Input } from "@nextui-org/input";

const EducationalDetails = ({ formData, setFormData, handleBack }) => {
  const [errors, setErrors] = useState({});
  const degrees = ["SEE/SLC", "+2", "Bachelor's", "Master's", "PhD"];
  const [selectedDegree, setSelectedDegree] = useState(degrees[0]); // Initialize with the first degree
  const statusOptions = ["COMPLETED", "IN_PROGRESS"];
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  const navigate = useNavigate();
  const [educationalDocument, setEducationalDocument] = useState(false);
  let [selectedTime, setSelectedTime] = useState(new Time(10, 0, 45)); // Default to 10:00:45 AM

  // const degreeIndex = degrees.indexOf(selectedDegree);
  const [numberOfItems, setNumberOfItems] = useState(1); // Initialize with 1 to show the first degree by default

  useEffect(() => {
    if (degrees.includes(selectedDegree)) {
      const index = degrees.indexOf(selectedDegree);
      setFormData((prev) => {
        console.log("Previous formData:", prev); // Debugging
        return {
          ...prev,
          education: degrees
            .slice(0, index)
            .map((_, i) => (prev.education ? prev.education[i] || {} : {})),
        };
      });
    }
  }, [selectedDegree]);

  const handleFileChange = (index, files) => {
    setFormData((prev) => {
      const updatedEducation = [...prev.education];

      // Ensure index is valid (within bounds)
      if (index >= 0 && index < updatedEducation.length) {
        updatedEducation[index] = {
          ...updatedEducation[index],
          files,
        };
      }

      return { ...prev, education: updatedEducation };
    });
    setEducationalDocument(false);
  };

  const handleChange = (index, field, value) => {
    const updatedEducation = [...(formData.education || [])]; // Ensure it's an array
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      education: updatedEducation,
    });
  };

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
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
            education: data.length
              ? data.map((edu) => ({
                  degree: edu.degree || "",
                  institution: edu.institution || "",
                  faculty: edu.faculty || "",
                  startYear: edu.startYear || "",
                  endYear: edu.endYear || "",
                  status: edu.status || "",
                  file: edu.documentUrl || "",
                  files: [],
                }))
              : degrees.map(() => ({})), // Ensure there's an empty object for each degree
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

    if (!formData.education || formData.education.length === 0) {
      toast.error("Please add at least one education record.");
      return false;
    }

    formData.education.forEach((edu, index) => {
      if (!edu.institution)
        newErrors[`institution_${index}`] = "Institution is required.";
      if (!edu.faculty) newErrors[`faculty_${index}`] = "Faculty is required.";
      if (!edu.startYear)
        newErrors[`startYear_${index}`] = "Start year is required.";
      if (!edu.endYear) newErrors[`endYear_${index}`] = "End year is required.";
      if (!edu.status) newErrors[`status_${index}`] = "Status is required.";
      if (!edu.files || edu.files.length === 0)
        newErrors[`files_${index}`] = "Document is required.";
    });

    setErrors(newErrors);

    // If there are errors, return false, otherwise return true
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

    formData?.education?.forEach((edu) => {
      if (edu?.files && edu.files.length > 0) {
        edu.files.forEach((file) => {
          formDataToSend.append("files", file);
        });
      }
    });

    console.log([...formDataToSend.entries()]);

    formDataToSend.append("isCurrentlyStudying", isCurrentlyStudying);
    if (isCurrentlyStudying) {
      const formattedTime = `${selectedTime.hour}:${selectedTime.minute}:${selectedTime.second}`;
      formDataToSend.append("expectedCheckingTime", formattedTime);
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
    if (!validateFormData()) {
      console.log("Validation errors:", errors);
      return;
    }
    onSubmit();
  };

  return (
    <div className="space-y-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-700">
        Educational Details
      </h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Level</label>
        <Select
          variant="bordered"
          className="w-full rounded-lg shadow-lg shadow-gray-300"
          label="Select A Level"
          selectedKeys={[selectedDegree]}
          onChange={(e) => {
            const selected = e.target.value;
            console.log("Dropdown selection:", selected);
            setSelectedDegree(selected);
          }}>
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
            {/**Institution */}
            <div>
              <Input
                variant="bordered"
                className={`w-full rounded-xl ${
                  errors[`institution_${index}`]
                    ? "border-2 border-red-500"
                    : ""
                }`}
                type="text"
                label="Institution"
                value={formData?.education?.[index]?.institution || ""}
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
            {/**Faculty */}
            <div>
              <Input
                variant="bordered"
                className={`w-full rounded-xl ${
                  errors[`faculty_${index}`] ? "border-2 border-red-500" : ""
                }`}
                type="text"
                label="Faculty"
                value={formData?.education?.[index]?.faculty || ""}
                onChange={(e) => handleChange(index, "faculty", e.target.value)}
              />
              {errors[`faculty_${index}`] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`faculty_${index}`]}
                </p>
              )}
            </div>

            {/**Start Year */}
            <div>
              <Input
                variant="bordered"
                className={`w-full rounded-xl ${
                  errors[`startYear_${index}`] ? "border-2 border-red-500" : ""
                }`}
                type="date"
                label="Select Start Date"
                value={formData?.education?.[index]?.startYear || ""}
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
            {/**End Year */}
            <div>
              <Input
                variant="bordered"
                className={`w-full rounded-xl ${
                  errors[`endYear_${index}`] ? "border-2 border-red-500" : ""
                }`}
                type="date"
                label="Select End Date"
                value={formData?.education?.[index]?.endYear || ""}
                onChange={(e) => handleChange(index, "endYear", e.target.value)}
              />
              {errors[`endYear_${index}`] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`endYear_${index}`]}
                </p>
              )}
            </div>
            <div>
              <Select
                variant="bordered"
                className={`w-full  rounded-xl ${
                  errors[`status_${index}`]
                    ? "border-2 border-red-500"
                    : "border-gray-300"
                }`}
                label="Status"
                placeholder={formData?.education?.[index]?.status || ""}
                value={formData?.education?.[index]?.status || ""}
                onChange={(e) => handleChange(index, "status", e.target.value)}>
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
                <label className="relative flex items-center justify-left w-full h-14 border-2 border-gray-300 rounded-xl cursor-pointer bg-white hover:bg-gray-200">
                  <span className="text-gray-600 px-4">
                    {formData?.education?.[index]?.files?.length > 0 ? (
                      <div className="flex gap-2">
                        <p>Choose a photo</p>
                        {formData?.education?.[index]?.files.name}
                      </div>
                    ) : (
                      "Upload Education Certificate"
                    )}
                  </span>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) =>
                      handleFileChange(index, Array.from(e.target.files))
                    }
                  />
                </label>
              </div>
              <div className="flex gap-x-4">
                <label className="block text-xs font-medium text-gray-700 pl-2">
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
                    <div className="text-xs text-red-500">
                      No Links Available
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-x-4 pl-1 ">
        <div className="flex items-center gap-2">
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
            <TimeInput
              label="Expected Checking Time"
              minValue={new Time(10)}
              maxValue={new Time(16)}
              errorMessage={(value) => {
                if (value.isInvalid) {
                  return "Please enter a valid time";
                }
              }}
              value={selectedTime}
              onChange={handleTimeChange}
            />
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
          disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default EducationalDetails;
