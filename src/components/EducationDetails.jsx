import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "react-toastify";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { TimeInput } from "@nextui-org/react";
import { FaRegEye } from "react-icons/fa";
import { Time } from "@internationalized/date";
import { useForm } from "react-hook-form";
import InputComponent from "./InputComponent";
import { Controller } from "react-hook-form";
const MAX_FILE_SIZE = 1024 * 1024;

const degrees = ["SEE/SLC", "+2", "Bachelor's", "Master's", "PhD"];
const statusOptions = ["COMPLETED", "IN_PROGRESS"];

const EducationalDetails = ({ formData, setFormData, handleBack }) => {
  const [selectedDegree, setSelectedDegree] = useState(degrees[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  const [educationalDocument, setEducationalDocument] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Time(10, 10, 45));
  const [numberOfItems, setNumberOfItems] = useState(1);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const handleDegreeSelection = (selected) => {
    setSelectedDegree(selected);
  };

  useEffect(() => {
    if (degrees.includes(selectedDegree)) {
      const index = degrees.indexOf(selectedDegree);
      setFormData((prev) => {
        // Ensure education is always an array before updating
        const existingEducation = Array.isArray(prev.education)
          ? prev.education
          : [];

        // Create a new array with the correct number of elements
        const updatedEducation = [...existingEducation];

        // Make sure the array has at least index+1 elements
        while (updatedEducation.length < index + 1) {
          updatedEducation.push({});
        }

        // Update the elements up to the selected degree
        for (let i = 0; i <= index; i++) {
          updatedEducation[i] = {
            ...updatedEducation[i],
            degree: degrees[i],
          };
        }

        return {
          ...prev,
          education: updatedEducation,
        };
      });
      setNumberOfItems(index + 1);
    }
  }, [selectedDegree, setFormData]);

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

          // Create an empty education array based on degrees
          const initialEducation = degrees.map(() => ({}));

          // Map each fetched education item to its corresponding degree position
          data.forEach((edu) => {
            const degreeIndex = degrees.indexOf(edu.degree);
            if (degreeIndex !== -1) {
              initialEducation[degreeIndex] = {
                degree: edu.degree || "",
                institution: edu.institution || "",
                faculty: edu.faculty || "",
                startYear: edu.startYear || "",
                endYear: edu.endYear || "",
                status: edu.status || "",
                file: edu.documentUrl || "",
                files: [],
              };
            }
          });

          setFormData((prev) => ({
            ...prev,
            education: initialEducation,
          }));

          // Update selected degree if we have education data
          if (data.length > 0) {
            const highestDegreeIndex = data.reduce((highest, edu) => {
              const index = degrees.indexOf(edu.degree);
              return index > highest ? index : highest;
            }, 0);
            setSelectedDegree(degrees[highestDegreeIndex]);
            setNumberOfItems(highestDegreeIndex + 1);
          }
        } else {
          // Initialize with empty education array if no data returned
          setFormData((prev) => ({
            ...prev,
            education: degrees.map(() => ({})),
          }));
        }
        setEducationalDocument(true);
      } catch (error) {
        console.error("Error fetching education details:", error);
        // Initialize with empty education array on error
        setFormData((prev) => ({
          ...prev,
          education: degrees.map(() => ({})),
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEducationDetails();
  }, [setFormData]);

  // Set form values when education data is loaded
  useEffect(() => {
    if (formData?.education && Array.isArray(formData.education)) {
      formData.education.forEach((edu, index) => {
        if (edu.institution) setValue(`institution_${index}`, edu.institution);
        if (edu.faculty) setValue(`faculty_${index}`, edu.faculty);
        if (edu.startYear) setValue(`startYear_${index}`, edu.startYear);
        if (edu.endYear) setValue(`endYear_${index}`, edu.endYear);
        if (edu.status) setValue(`status_${index}`, edu.status);
      });
    }
  }, [formData.education, setValue]);

  const validateFileType = (file) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    return allowedTypes.includes(file.type);
  };

  const validateFile = (file) => {
    const errors = [];
    if (!validateFileType(file)) {
      errors.push("Only PNG, JPEG, or JPG files are allowed.");
    }
    if (file.size > MAX_FILE_SIZE) {
      errors.push("File size must be less than 5MB.");
    }
    return errors;
  };

  const handleFileChange = (index, files) => {
    if (files.length > 0) {
      const file = files[0];
      const fileErrors = validateFile(file);

      if (fileErrors.length > 0) {
        toast.error(fileErrors.join(" "));
        return;
      }

      setFormData((prev) => {
        // Ensure education array exists
        const updatedEducation = Array.isArray(prev.education)
          ? [...prev.education]
          : degrees.map(() => ({}));

        // Ensure the element at index exists
        updatedEducation[index] = {
          ...updatedEducation[index],
          files,
          fileName: files[0].name,
        };

        return { ...prev, education: updatedEducation };
      });
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    const formDataToSend = new FormData();
    const educationData = degrees.slice(0, numberOfItems).map((deg, index) => ({
      level: deg,
      institution: data[`institution_${index}`],
      faculty: data[`faculty_${index}`],
      startYear: data[`startYear_${index}`],
      endYear: data[`endYear_${index}`],
      status: data[`status_${index}`],
      imageIndex: index + 1,
    }));

    formDataToSend.append("educationData", JSON.stringify(educationData));

    // Check if formData.education exists before iterating
    if (formData?.education && Array.isArray(formData.education)) {
      formData.education.forEach((edu, index) => {
        if (edu?.files?.length) {
          edu.files.forEach((file) => formDataToSend.append("files", file));
        }
      });
    }

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
      console.error(error);
      toast.error("An error occurred while saving educational details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Ensure formData has an education property and it's an array
  const education =
    formData?.education && Array.isArray(formData.education)
      ? formData.education
      : degrees.map(() => ({}));

  return (
    <div className="space-y-4 py-4">
      <h2 className="text-2xl font-semibold text-gray-700">
        Educational Details
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Level</label>
        <Select
          variant="bordered"
          className="w-full"
          label="Select A Level"
          selectedKeys={[selectedDegree]}
          onChange={(e) => handleDegreeSelection(e.target.value)}>
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
              <InputComponent
                name={`institution_${index}`}
                control={control}
                label="Institution"
                rules={{
                  required: "Institution is required",
                  minLength: {
                    value: 3,
                    message:
                      "Institution name must be atleast 3 character long",
                  },
                }}
                variant="bordered"
                type="text"
                inputClassName="w-full rounded-xl"
                value={education[index]?.institution || ""}
              />
            </div>
            {/**Faculty */}
            <div>
              <InputComponent
                name={`faculty_${index}`}
                control={control}
                label="Faculty"
                rules={{
                  required: "Faculty is required",
                  minLength: {
                    value: 3,
                    message: "Faculty  must be atleast 3 character long",
                  },
                }}
                variant="bordered"
                type="text"
                inputClassName="w-full rounded-xl"
                value={education[index]?.faculty || ""}
              />
            </div>
            {/**Start Year */}
            <div>
              <InputComponent
                name={`startYear_${index}`}
                control={control}
                label="Start Year"
                rules={{ required: "Start year is required" }}
                type="date"
                variant="bordered"
                inputClassName="w-full rounded-xl"
                value={education[index]?.startYear || ""}
              />
            </div>
            {/**End Year */}
            <div>
              <InputComponent
                name={`endYear_${index}`}
                control={control}
                label="End Year"
                rules={{
                  required:
                    education[index]?.status !== "IN_PROGRESS"
                      ? "End year is required"
                      : false,
                }}
                type="date"
                variant="bordered"
                inputClassName="w-full rounded-xl"
                value={education[index]?.endYear || ""}
              />
            </div>
            {/**Status */}
            <div>
              <div className="col-span-2">
                <Controller
                  name={`status_${index}`}
                  control={control}
                  rules={{ required: "Status is required" }}
                  render={({ field }) => (
                    <Select
                      label="Status"
                      variant="bordered"
                      selectedKeys={field.value ? [field.value] : []}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);

                        // Keep local formData in sync
                        setFormData((prev) => {
                          // Ensure education array exists
                          const updated = Array.isArray(prev.education)
                            ? [...prev.education]
                            : degrees.map(() => ({}));

                          // Ensure the element at index exists
                          updated[index] = {
                            ...updated[index],
                            status: value,
                          };
                          return { ...prev, education: updated };
                        });
                      }}
                      className="w-full"
                      isInvalid={!!errors[`status_${index}`]}
                      errorMessage={errors[`status_${index}`]?.message}>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              </div>
            </div>
            {/**Files */}
            <div>
              <div className="col-span-2">
                <Controller
                  name={`files_${index}`}
                  control={control}
                  rules={{
                    validate: {
                      requiredIfCompleted: (files) => {
                        const currentStatus = getValues(`status_${index}`);
                        if (currentStatus === "COMPLETED") {
                          if (!files || files.length === 0)
                            return "File is required.";
                        }
                        return true;
                      },
                      type: (files) => {
                        if (!files || files.length === 0) return true;
                        const file = files[0];
                        const allowedTypes = ["image/png", "image/jpg"];
                        return (
                          allowedTypes.includes(file.type) ||
                          "Invalid file type. Only PNG or JPG."
                        );
                      },
                      size: (files) => {
                        if (!files || files.length === 0) return true;
                        const file = files[0];
                        return (
                          file.size <= MAX_FILE_SIZE ||
                          "File size must be less than 5MB."
                        );
                      },
                    },
                  }}
                  render={({ field: { onChange, value, ref } }) => (
                    <div>
                      <label
                        className={`relative flex items-center justify-left w-full h-14 border-2
            ${errors[`files_${index}`] ? "border-danger" : "border-gray-300"}
            rounded-xl cursor-pointer bg-white hover:bg-gray-200`}>
                        <span className="text-gray-600 px-4">
                          {value?.length > 0 ? (
                            <div className="flex gap-2">
                              <p>Selected: {value[0].name}</p>
                            </div>
                          ) : (
                            "Upload Education Certificate"
                          )}
                        </span>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          className="absolute inset-0 opacity-0 cursor-pointer focus:outline-none"
                          ref={ref}
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            onChange(files);
                            handleFileChange(index, files);
                          }}
                        />
                      </label>
                      {errors[`files_${index}`] && (
                        <p className="text-danger text-sm mt-1">
                          {errors[`files_${index}`].message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <div className="flex gap-x-4 mt-2">
                  <label className="text-xs text-gray-500 mt-1">
                    Please upload the image of type either PNG or JPG
                  </label>

                  {educationalDocument &&
                    education &&
                    education[index] &&
                    (education[index]?.file ? (
                      <a
                        href={education[index].file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 underline flex items-center gap-x-2">
                        <FaRegEye />
                        View Uploaded Document
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
        </div>
      ))}

      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isCurrentlyStudying}
            onChange={(e) => {
              const checked = e.target.checked;
              setIsCurrentlyStudying(checked);
              setFormData((prev) => ({
                ...prev,
                currentlyStudying: checked,
              }));
            }}
          />
          Are you currently a student?
        </label>
        {isCurrentlyStudying && (
          <TimeInput
            label="Expected Checking Time"
            value={selectedTime}
            onChange={setSelectedTime}
            minValue={new Time(10)}
            maxValue={new Time(16)}
          />
        )}
      </div>

      <div className="form-navigation flex justify-between mt-6">
        <Button onPress={handleBack} className="px-4 py-2 bg-gray-300 rounded">
          Back
        </Button>
        <button
          onClick={handleSubmit(onSubmit)}
          className="px-4 py-2 bg-green-500 text-white rounded"
          disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default EducationalDetails;
