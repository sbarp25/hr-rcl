import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "sonner";
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { TimeInput } from "@heroui/react";
import { getLocalTimeZone, Time } from "@internationalized/date";
import { useForm } from "react-hook-form";
import InputComponent from "./ui/InputComponent.jsx";
import { Controller } from "react-hook-form";
import DatepickerComponent, { formatDate } from "./ui/DatepickerComponent.jsx";
import { CiImageOn } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import Loader from "../components/Loader/Loader.jsx";
import {
  useEducationDetails,
  useSubmitEducationDetails,
} from "../hooks/useAuth.js";

const MAX_FILE_SIZE = 1024 * 1024;

const degrees = ["SEE/SLC", "+2", "Bachelor's", "Master's", "PhD"];

const statusOptions = ["COMPLETED", "IN_PROGRESS"];

const EducationalDetails = ({
  formData,
  setFormData,
  handleBack,
  dateOfBirth,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedDegree, setSelectedDegree] = useState(degrees[0]);
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  const [educationalDocument, setEducationalDocument] = useState(false);
  const [numberOfItems, setNumberOfItems] = useState(1);
  const [hasInProgressDegree, setHasInProgressDegree] = useState(false);
  const [inProgressDegreeIndex, setInProgressDegreeIndex] = useState(-1);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  // Custom hooks
  const {
    data: educationData,
    isLoading: isLoadingEducation,
    error: educationError,
  } = useEducationDetails();

  const submitMutation = useSubmitEducationDetails((data) => {
    navigate("/dashboard");
    // localStorage.setItem("ekeyStep", "");
  });

  // Watch all status fields to check for IN_PROGRESS
  const statusValues = degrees.map((_, index) => watch(`status_${index}`));

  // Watch the currently studying checkbox to conditionally require time input
  const watchIsCurrentlyStudying = watch("isCurrentlyStudying", false);

  const handleDegreeSelection = (selected) => {
    // Check if there's an IN_PROGRESS degree and if the selected degree is higher
    if (
      hasInProgressDegree &&
      degrees.indexOf(selected) > inProgressDegreeIndex
    ) {
      toast.error(
        `You cannot add higher education levels while ${degrees[inProgressDegreeIndex]} is in progress`
      );
      return;
    }

    setSelectedDegree(selected);
  };

  // Check for IN_PROGRESS status whenever status values change
  useEffect(() => {
    let foundInProgress = false;
    let progressIndex = -1;

    statusValues.forEach((status, index) => {
      if (status === "IN_PROGRESS") {
        foundInProgress = true;
        progressIndex = index;
      }
    });

    setHasInProgressDegree(foundInProgress);
    setInProgressDegreeIndex(progressIndex);

    // If we have an IN_PROGRESS degree and the selected degree is higher,
    // reset the selected degree to the IN_PROGRESS one
    if (foundInProgress && degrees.indexOf(selectedDegree) > progressIndex) {
      setSelectedDegree(degrees[progressIndex]);
      setNumberOfItems(progressIndex + 1);
    }
  }, [statusValues, selectedDegree]);

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

  // Process education data when it's loaded
  useEffect(() => {
    if (educationData) {
      const data = educationData.datalist || [];

      // Check if user is currently studying
      if (educationData.data?.expectedCheckingTime) {
        setIsCurrentlyStudying(true);
        setValue("isCurrentlyStudying", true);

        // Parse the time from string if needed
        const timeParts = educationData.data.expectedCheckingTime.split(":");
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

      // Group data by degree and get the most recent entry for each degree
      const degreeMap = {};

      data.forEach((edu) => {
        const degree = edu.degree;

        // The API returns exact degree names, so we don't need normalization
        if (degrees.includes(degree)) {
          // If we haven't seen this degree before, or if this entry is more recent
          if (
            !degreeMap[degree] ||
            new Date(edu.startYear) > new Date(degreeMap[degree].startYear)
          ) {
            degreeMap[degree] = edu;
          }
        } else {
          console.warn(`Degree "${degree}" not found in degrees array`);
        }
      });

      // Map each degree to its corresponding position
      let hasInProgressItem = false;
      let inProgressIndex = -1;

      Object.entries(degreeMap).forEach(([degree, edu]) => {
        const degreeIndex = degrees.indexOf(degree);

        if (degreeIndex !== -1) {
          // Parse dates - handle different date formats
          let startYear, endYear;

          try {
            startYear = edu.startYear ? formatDate(edu.startYear) : "";
            endYear = edu.endYear ? formatDate(edu.endYear) : "";
          } catch (error) {
            startYear = edu.startYear || "";
            endYear = edu.endYear || "";
          }

          initialEducation[degreeIndex] = {
            degree: edu.degree || "",
            institution: edu.institution || "",
            faculty: edu.faculty || "",
            startYear: startYear,
            endYear: endYear,
            status: edu.status || "",
            file: edu.documentUrl || "",
            files: [],
          };

          // Check if any education is in progress
          if (edu.status === "IN_PROGRESS") {
            hasInProgressItem = true;
            inProgressIndex = degreeIndex;
          }
        }
      });

      // Set IN_PROGRESS flags
      setHasInProgressDegree(hasInProgressItem);
      setInProgressDegreeIndex(inProgressIndex);

      setFormData((prev) => ({
        ...prev,
        education: initialEducation,
      }));

      // Update selected degree if we have education data
      if (Object.keys(degreeMap).length > 0) {
        let highestDegreeIndex = Object.keys(degreeMap).reduce(
          (highest, degree) => {
            const index = degrees.indexOf(degree);
            return index > highest ? index : highest;
          },
          0
        );

        // If there's an IN_PROGRESS degree, limit to that level
        if (hasInProgressItem && highestDegreeIndex > inProgressIndex) {
          highestDegreeIndex = inProgressIndex;
        }

        setSelectedDegree(degrees[highestDegreeIndex]);
        setNumberOfItems(highestDegreeIndex + 1);
      }

      setEducationalDocument(true);
    } else if (educationData === null || educationError) {
      // Initialize with empty education array if no data returned or error
      setFormData((prev) => ({
        ...prev,
        education: degrees.map(() => ({})),
      }));
      setEducationalDocument(true);
    }
  }, [educationData, educationError, setFormData, setValue]);

  // Set form values when education data is loaded
  useEffect(() => {
    if (formData?.education && Array.isArray(formData.education)) {
      formData.education.forEach((edu, index) => {
        if (edu.institution) {
          setValue(`institution_${index}`, edu.institution);
        }
        if (edu.faculty) {
          setValue(`faculty_${index}`, edu.faculty);
        }
        if (edu.startYear) {
          setValue(`startYear_${index}`, edu.startYear);
        }
        if (edu.endYear) {
          setValue(`endYear_${index}`, edu.endYear);
        }
        if (edu.status) {
          setValue(`status_${index}`, edu.status);
        }
        if (edu.file) {
          setValue(`files_${index}`, "existing_file");
        }
      });
    }
  }, [formData?.education, setValue]);

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
    const formDataToSend = new FormData();
    const educationData = degrees.slice(0, numberOfItems).map((deg, index) => ({
      level: deg,
      institution: data[`institution_${index}`],
      faculty: deg === "SEE/SLC" ? null : data[`faculty_${index}`],
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

    submitMutation.mutate(formDataToSend);
  };

  // Ensure formData has an education property and it's an array
  const education =
    formData?.education && Array.isArray(formData.education)
      ? formData.education
      : degrees.map(() => ({}));

  const shouldShowFaculty = (degreeIndex) => {
    const degree = degrees[degreeIndex];
    return degree !== "SEE/SLC";
  };

  const validateStartDate = (value, index) => {
    // Skip validation for the first education level (SEE/SLC) as it has no previous level
    if (index === 0) return true;

    // Get the end date of the previous level
    const previousLevelEndDate = getValues(`endYear_${index - 1}`);

    // If previous level's end date isn't available or status is IN_PROGRESS, skip validation
    const previousLevelStatus = getValues(`status_${index - 1}`);
    if (!previousLevelEndDate || previousLevelStatus === "IN_PROGRESS")
      return true;

    try {
      // Convert dates to comparable format - handle different date formats
      let previousEndDateObj;
      let currentStartDateObj;

      // Handle previousLevelEndDate conversion
      if (typeof previousLevelEndDate?.toDate === "function") {
        // If it has toDate method (likely from a date picker library)
        previousEndDateObj = previousLevelEndDate.toDate(getLocalTimeZone());
      } else if (previousLevelEndDate instanceof Date) {
        // If it's already a Date object
        previousEndDateObj = previousLevelEndDate;
      } else if (typeof previousLevelEndDate === "string") {
        // If it's a string, parse it
        previousEndDateObj = new Date(previousLevelEndDate);
      } else {
        // If we can't determine the format, skip validation
        return true;
      }

      // Handle current value conversion
      if (typeof value?.toDate === "function") {
        // If it has toDate method (likely from a date picker library)
        currentStartDateObj = value.toDate(getLocalTimeZone());
      } else if (value instanceof Date) {
        // If it's already a Date object
        currentStartDateObj = value;
      } else if (typeof value === "string") {
        // If it's a string, parse it
        currentStartDateObj = new Date(value);
      } else {
        // If we can't determine the format, skip validation
        return true;
      }

      // Check if dates are valid
      if (
        isNaN(previousEndDateObj.getTime()) ||
        isNaN(currentStartDateObj.getTime())
      ) {
        // If either date is invalid, skip validation
        return true;
      }

      // Check if current start date is after previous end date
      return (
        currentStartDateObj >= previousEndDateObj ||
        `Start date must be after the end date of your ${
          degrees[index - 1]
        } education`
      );
    } catch (error) {
      // If there's any error in date conversion, skip validation
      return true;
    }
  };

  // Handle status change
  const handleStatusChange = (index, value) => {
    // Update the status in the form
    setValue(`status_${index}`, value);

    // If the status is IN_PROGRESS, make sure we can't select higher degrees
    if (value === "IN_PROGRESS") {
      // If selected degree is higher than the IN_PROGRESS degree, reset it
      if (degrees.indexOf(selectedDegree) > index) {
        setSelectedDegree(degrees[index]);
        setNumberOfItems(index + 1);
      }

      setHasInProgressDegree(true);
      setInProgressDegreeIndex(index);
    } else {
      // If this was the IN_PROGRESS degree and now it's not, update the flags
      if (index === inProgressDegreeIndex) {
        // Check if any other degree is still IN_PROGRESS
        const otherInProgressIndex = statusValues.findIndex(
          (status, i) => i !== index && status === "IN_PROGRESS"
        );

        if (otherInProgressIndex === -1) {
          setHasInProgressDegree(false);
          setInProgressDegreeIndex(-1);
        } else {
          setInProgressDegreeIndex(otherInProgressIndex);
        }
      }
    }

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
  };

  if (isLoadingEducation || submitMutation.isPending) {
    return <Loader />;
  }
  return (
    <div className="space-y-4 py-4">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-white">
        Educational Details
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white">
          Level
        </label>

        <Select
          variant="bordered"
          className="w-full"
          label="Select A Level"
          selectedKeys={[selectedDegree]}
          onChange={(e) => handleDegreeSelection(e.target.value)}
          isDisabled={hasInProgressDegree}>
          {degrees.map((degree, index) => (
            <SelectItem
              key={degree}
              value={degree}
              isDisabled={hasInProgressDegree && index > inProgressDegreeIndex}>
              {degree}
            </SelectItem>
          ))}
        </Select>

        {hasInProgressDegree && (
          <p className="text-sm text-danger mt-1">
            You cannot add higher education levels while
            {" " + degrees[inProgressDegreeIndex]} is in progress.
          </p>
        )}
      </div>

      {Array.from({ length: numberOfItems }).map((_, index) => (
        <div key={index} className="space-y-4 border p-4 rounded-md">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-white">
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
                  pattern: {
                    value: /^[^\s]/,
                    message: "Institution cannot start with a space",
                  },
                }}
                variant="bordered"
                type="text"
                inputClassName="w-full rounded-xl"
                value={education[index]?.institution || ""}
              />
            </div>
            {/**Faculty */}
            {shouldShowFaculty(index) && (
              <div>
                <InputComponent
                  name={`faculty_${index}`}
                  control={control}
                  label="Faculty"
                  rules={{
                    required: "Faculty is required",
                    minLength: {
                      value: 3,
                      message: "Faculty must be atleast 3 character long",
                    },
                    pattern: {
                      value: /^[^\s]/,
                      message: "Faculty cannot start with a space",
                    },
                  }}
                  variant="bordered"
                  type="text"
                  inputClassName="w-full rounded-xl"
                  value={education[index]?.faculty || ""}
                />
              </div>
            )}
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
                        handleStatusChange(index, value);
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
            {/**Start Year */}
            <div>
              <DatepickerComponent
                name={`startYear_${index}`}
                label="Start Year(A.D)"
                control={control}
                rules={{
                  required: "Start year is required",
                  validate: (value) => {
                    const futureCheck =
                      new Date(value) <= new Date() ||
                      "Start year cannot be in the future";

                    const birthCheck = dateOfBirth
                      ? new Date(value) >= new Date(dateOfBirth) ||
                        "Start year cannot be before date of birth"
                      : true;

                    if (futureCheck !== true) return futureCheck;
                    if (birthCheck !== true) return birthCheck;

                    return validateStartDate(value, index);
                  },
                }}
              />
            </div>
            {/**End Year */}
            {education[index]?.status !== "IN_PROGRESS" ? (
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

                      try {
                        // Check if startDate has toDate method, if not it might already be a Date object
                        const startDateObj =
                          typeof startDate?.toDate === "function"
                            ? startDate.toDate(getLocalTimeZone())
                            : new Date(startDate);

                        const endDateObj =
                          typeof value?.toDate === "function"
                            ? value.toDate(getLocalTimeZone())
                            : new Date(value);

                        return (
                          endDateObj >= startDateObj ||
                          "End date cannot be before start date"
                        );
                      } catch (error) {
                        return true; // Skip validation if there's an error
                      }
                    },
                  }}
                />
              </div>
            ) : (
              ""
            )}

            {/**Files */}
            {education[index]?.status !== "IN_PROGRESS" ? (
              <div className="">
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
                            ? "border-gray-300"
                            : "border-gray-300"
                        } border-2 rounded-xl p-1 overflow-hidden`}>
                        {/* Left icon */}
                        <div className="pl-3 flex items-center">
                          <CiImageOn className="text-3xl text-gray-400" />
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
                              ? `Document uploaded (${degrees[index]} Certificate)` // Show friendly message instead of URL
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
                        <p className="text-xs text-gray-500 dark:text-white">
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
                                  <FaEye />
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
            ) : (
              ""
            )}
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
        <Button
          onPress={handleBack}
          className="px-6 py-3 bg-gray-300 dark:bg-slate-500 text-gray-700 dark:text-white rounded-lg">
          Back
        </Button>
        <button
          onClick={handleSubmit(onSubmit)}
          className="px-4 py-2 bg-green-500 text-white rounded"
          disabled={isLoadingEducation}>
          {isLoadingEducation ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default EducationalDetails;
