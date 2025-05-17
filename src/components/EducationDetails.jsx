import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "react-toastify";
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { TimeInput } from "@nextui-org/react";
import { getLocalTimeZone, Time } from "@internationalized/date";
import { useForm } from "react-hook-form";
import InputComponent from "./InputComponent";
import { Controller } from "react-hook-form";
import DatepickerComponent from "./DatepickerComponent";
import { CiImageOn } from "react-icons/ci";

const MAX_FILE_SIZE = 1024 * 1024;

const degrees = ["SEE/SLC", "+2", "Bachelor's", "Master's", "PhD"];

const statusOptions = ["COMPLETED", "IN_PROGRESS"];

const EducationalDetails = ({ formData, setFormData, handleBack }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedDegree, setSelectedDegree] = useState(degrees[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  const [educationalDocument, setEducationalDocument] = useState(false);
  const [numberOfItems, setNumberOfItems] = useState(1);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  // Watch the currently studying checkbox to conditionally require time input
  const watchIsCurrentlyStudying = watch("isCurrentlyStudying", false);

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

          // Check if user is currently studying
          if (response.data.data?.expectedCheckingTime) {
            setIsCurrentlyStudying(true);
            setValue("isCurrentlyStudying", true);

            // Parse the time from string if needed
            const timeParts =
              response.data.data.expectedCheckingTime.split(":");
            if (timeParts.length >= 3) {
              const timeObj = new Time(
                parseInt(timeParts[0]),
                parseInt(timeParts[1]),
                parseInt(timeParts[2])
              );
              setValue("expectedCheckingTime", timeObj);
            }
          }

          // Create an empty education array based on degrees
          const initialEducation = degrees.map(() => ({}));

          // Map each fetched education item to its corresponding degree position
          data.forEach((edu) => {
            const degreeIndex = degrees.indexOf(edu.degree);
            const startyear = formatDate(edu.startYear);
            const endyear = formatDate(edu.endYear);
            if (degreeIndex !== -1) {
              initialEducation[degreeIndex] = {
                degree: edu.degree || "",
                institution: edu.institution || "",
                faculty: edu.faculty || "",
                startYear: startyear,
                endYear: endyear,
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
  }, [setFormData, setValue]);

  // Set form values when education data is loaded
  useEffect(() => {
    if (formData?.education && Array.isArray(formData.education)) {
      formData.education.forEach((edu, index) => {
        if (edu.institution) setValue(`institution_${index}`, edu.institution);
        if (edu.faculty) setValue(`faculty_${index}`, edu.faculty);
        if (edu.startYear) setValue(`startYear_${index}`, edu.startYear);
        if (edu.endYear) setValue(`endYear_${index}`, edu.endYear);
        if (edu.status) setValue(`status_${index}`, edu.status);
        if (edu.file) setValue(`files_${index}`, "existing_file");
      });
    }
  }, [formData.education, setValue]);

  const validateFile = (file, existingUrl) => {
    // If we already have a file URL from the API, skip validation
    if (existingUrl) return true;

    // If no file is selected, it will be handled by the required validator
    if (!file) return true;

    // Check file type
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      return "Only PNG or JPG allowed";
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 1MB";
    }

    return true;
  };

  const handleFileChange = (index, files) => {
    if (files.length > 0) {
      const file = files[0];

      // Skip validation if there's an existing file URL from API
      if (!education[index]?.file) {
        const fileErrors = validateFile(file);

        if (fileErrors.length > 0) {
          toast.error(fileErrors.join(" "));
          return;
        }
      }

      setFormData((prev) => {
        // Ensure education array exists
        const updatedEducation = Array.isArray(prev.education)
          ? [...prev.education]
          : degrees.map(() => ({}));

        // Update the element at index with new file info
        // If there was an existing file URL, retain it but add the new files as well
        updatedEducation[index] = {
          ...updatedEducation[index],
          files,
          fileName: files[0].name,
          // Keep the existing file reference if it exists
          file: updatedEducation[index]?.file || null,
        };

        return { ...prev, education: updatedEducation };
      });

      // Also update the react-hook-form value
      setValue(`files_${index}`, files);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    const formDataToSend = new FormData();
    const educationData = degrees.slice(0, numberOfItems).map((deg, index) => ({
      level: deg,
      institution: data[`institution_${index}`],
      faculty: data[`faculty_${index}`],
      startYear: formatDate(data[`startYear_${index}`]),
      endYear: formatDate(data[`endYear_${index}`]),
      status: data[`status_${index}`],
      imageIndex: index + 1,
    }));

    formDataToSend.append("educationData", JSON.stringify(educationData));

    // Check if formData.education exists before iterating
    let hasFiles = false;
    if (formData?.education && Array.isArray(formData.education)) {
      formData.education.forEach((edu, index) => {
        if (edu?.files?.length) {
          edu.files.forEach((file) => {
            formDataToSend.append("files", file);
            hasFiles = true;
          });
        }
      });
    }

    if (!hasFiles) {
      formDataToSend.append(
        "files",
        new Blob([], { type: "application/octet-stream" })
      );
    }

    formDataToSend.append("isCurrentlyStudying", data.isCurrentlyStudying);
    if (data.isCurrentlyStudying && data.expectedCheckingTime) {
      const timeValue = data.expectedCheckingTime;
      const formattedTime = `${timeValue.hour}:${timeValue.minute}:10`;
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
        navigate("/dashboard");
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while saving educational details.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Ensure formData has an education property and it's an array
  const education =
    formData?.education && Array.isArray(formData.education)
      ? formData.education
      : degrees.map(() => ({}));

  const formatDate = (date) =>
    date ? date?.toDate(getLocalTimeZone()).toISOString().split("T")[0] : null;
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <DatepickerComponent
                name={`startYear_${index}`}
                label="Start Year(A.D)"
                control={control}
                rules={{ required: "Start year is required" }}
              />
            </div>
            {/**End Year */}
            <div>
              <DatepickerComponent
                name={`endYear_${index}`}
                label="End Year (A.D)"
                control={control}
                rules={{
                  required:
                    education[index]?.status !== "IN_PROGRESS"
                      ? "End year is required"
                      : false,
                  validate: (value) => {
                    const startDate = getValues(`startYear_${index}`);
                    if (!startDate || !value) return true;
                    const startDateObj = startDate.toDate(getLocalTimeZone());
                    const endDateObj = value.toDate(getLocalTimeZone());
                    return (
                      endDateObj >= startDateObj ||
                      "End date cannot be before start date"
                    );
                  },
                }}
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
                      required: (files) => {
                        const currentStatus = getValues(`status_${index}`);
                        // Skip validation if we already have a file URL from the API
                        if (education[index]?.file) return true;

                        // Otherwise check if file is required for COMPLETED status
                        if (currentStatus === "COMPLETED") {
                          return files && files.length > 0
                            ? true
                            : "File is required.";
                        }
                        return true;
                      },
                      fileValidation: (files) => {
                        // Use the validateFile function to validate the file
                        if (
                          !files ||
                          files === "existing_file" ||
                          files.length === 0
                        )
                          return true;
                        return validateFile(files[0], education[index]?.file);
                      },
                    },
                  }}
                  render={({ field: { onChange, value, ref } }) => (
                    <div className="space-y-2">
                      {/* Input styled like text input */}
                      <div
                        className={`relative flex items-center w-full ${
                          errors[`files_${index}`]
                            ? "border-danger"
                            : education[index]?.file ||
                              (value?.length > 0 && value !== "existing_file")
                        } border-2 rounded-xl p-1 overflow-hidden `}>
                        {/* Left icon */}
                        <div className="pl-3 flex items-center">
                          {education[index]?.file || (
                            <CiImageOn className="text-3xl text-gray-400" />
                          )}
                        </div>

                        {/* Text area (fake input) */}
                        <div className="flex-1 px-2 py-2.5">
                          <span
                            className={`text-sm ${
                              education[index]?.file ||
                              (value?.length > 0 && value !== "existing_file")
                                ? "text-gray-700 font-medium"
                                : "text-gray-500"
                            } truncate block`}>
                            {education[index]?.file
                              ? "Document already uploaded"
                              : value?.length > 0 && value !== "existing_file"
                              ? value[0].name
                              : "Upload Education Certificate"}
                          </span>
                        </div>

                        {/* Browse button */}
                        <div className="pr-1">
                          <button
                            type="button"
                            className="bg-gray-100 py-1.5 px-3 border-l text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none"
                            onClick={() => {
                              // This is just for visual feedback, the actual input is below
                            }}>
                            Browse
                          </button>
                        </div>

                        {/* Hidden file input */}
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer focus:outline-none"
                          ref={ref}
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            onChange(files);
                            handleFileChange(index, files);
                          }}
                        />
                      </div>

                      {/* Error message */}
                      {errors[`files_${index}`] && (
                        <p className="text-danger text-sm">
                          {errors[`files_${index}`].message}
                        </p>
                      )}

                      {/* Help text and view document section */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <p className="text-xs text-gray-500">
                          Please upload the image of type either PNG or JPG
                          under 1 MB
                        </p>

                        {educationalDocument &&
                          education &&
                          education[index] && (
                            <div className="mt-1 sm:mt-0">
                              {education[index]?.file && (
                                <div
                                  onClick={onOpen}
                                  className="flex items-center text-green-500 hover:text-green-700 text-sm cursor-pointer">
                                  <svg
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                  </svg>
                                  View Certificate
                                </div>
                              )}
                            </div>
                          )}
                      </div>

                      <Modal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        isDismissable={true}
                        isKeyboardDismissDisabled={false}>
                        <ModalContent>
                          {() => (
                            <>
                              <ModalBody>
                                <div className="h-96 w-96">
                                  <img
                                    src={education[index].file}
                                    alt="Education Certificate"
                                  />
                                </div>
                              </ModalBody>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-3">
        <Controller
          name="isCurrentlyStudying"
          control={control}
          defaultValue={isCurrentlyStudying}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => {
                const checked = e.target.checked;
                field.onChange(checked);
                setIsCurrentlyStudying(checked);
                setFormData((prev) => ({
                  ...prev,
                  currentlyStudying: checked,
                }));
              }}>
              {" "}
              Are you currently a student?
            </Checkbox>
          )}
        />

        {watchIsCurrentlyStudying && (
          <Controller
            name="expectedCheckingTime"
            control={control}
            rules={{
              required: watchIsCurrentlyStudying
                ? "Please select a time"
                : false,
              validate: (value) => {
                if (!watchIsCurrentlyStudying) return true;
                if (!value) return "Please select a valid time";

                // Additional time validation if needed
                if (
                  value.hour < 10 ||
                  (value.hour === 18 && value.minute > 30) ||
                  value.hour > 18
                ) {
                  return "Time must be between 10:00 AM and 6:30 PM";
                }

                return true;
              },
            }}
            defaultValue={new Time(10, 10, 10)}
            render={({ field }) => (
              <div>
                <TimeInput
                  label="Expected Checking Time"
                  value={field.value}
                  variant="bordered"
                  onChange={(time) => {
                    field.onChange(time);
                  }}
                  minValue={new Time(10, 10, 10)}
                  maxValue={new Time(18, 30, 0)}
                  isInvalid={!!errors.expectedCheckingTime}
                  errorMessage={errors.expectedCheckingTime?.message}
                />
              </div>
            )}
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
