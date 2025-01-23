import {
  Button,
  Input,
  DropdownItem,
  Select,
  SelectItem,
  Form,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "react-toastify";
import Inputcomp from "./Inputcomp";

const PersonalDetails = ({
  formData,
  // handleNestedChange,
  handleNext,
  setFormData,
  handleBack,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const genderOptions = ["Male", "Female"];
  const bloodGroupOptions = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  const relationOptions = ["Father", "Mother", "Brother", "Sister"];
  const [error, setError] = useState(false);

  const handleNestedChange = (section, subSection, field, value) => {
    // Define validation rules
    const validateField = (field, value) => {
      const errors = {};
      if (field === "email" && !value) {
        errors[field] = "Email is required";
      }
      if (field === "gender" && !value) {
        errors[field] = "Gender is required";
      }
      if (field === "dob" && !value) {
        errors[field] = "Date Of Birth is required ";
      }
      if (field === "bloodType" && !value) {
        errors[field] = "Blood Group is required.";
      }
      if (field === "guardianName" && !value) {
        errors[field] = "GuardianName is required.";
      }
      if (field === "guardianPhone" && (!value || value.length !== 10)) {
        errors[field] =
          "Phone Number is required and it must be 10 digit long.";
      }
      if (field === "guardianRelation" && !value) {
        errors[field] = "Guardian Relation  is required";
      }
      if (field === "emergencyName" && !value) {
        errors[field] = "Emergency Contact is required.";
      }
      if (field === "emergencyNumber" && (!value || value.length !== 10)) {
        errors[field] =
          "Phone Number is required and it must be 10 digit long.";
      }
      if (field === "emergencyRelation" && !value) {
        errors[field] = "Guardian Relation  is required";
      }

      return errors;
    };

    // Perform validation
    const fieldErrors = validateField(field, value);

    // Update errors
    setError((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (!fieldErrors[field]) {
        // Clear the error if validation passes
        delete newErrors[field];
      } else {
        // Update the error if validation fails
        newErrors[field] = fieldErrors[field];
      }
      return newErrors;
    });

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };
  const validateAllFields = () => {
    const errors = {};
    const docs = formData?.documents || {};

    if (!docs.email) {
      errors.email = "Email is required.";
    }
    if (!docs.gender) {
      errors.gender = "Gender is required.";
    }
    if (!docs.dob) {
      errors.dob = "Date of birth is required.";
    }
    if (!docs.bloodType) {
      errors.bloodType = "Blood Group is required.";
    }
    if (!docs.guardianName) {
      errors.guardianName = "Guardian Name is required.";
    }
    if (!docs.guardianPhone || docs.guardianPhone.length != 10) {
      errors.guardianPhone =
        "Phone number is required and it must be 10 digit long.";
    }
    if (!docs.guardianRelation) {
      errors.guardianRelation = "Guardian Relation  is required";
    }
    if (!docs.emergencyName) {
      errors.emergencyName = "Guardian Name is required";
    }
    if (!docs.emergencyNumber) {
      errors.emergencyNumber = "Phone Number  is required";
    }
    if (!docs.emergencyRelation) {
      errors.emergencyRelation = "Guardian Relation is required";
    }
    setError(errors);
    return Object.keys(errors).length === 0;
  };
  const onSubmit = async () => {
    if (!validateAllFields()) {
      return;
    }
    const newData = {
      data: {
        email: formData.personalInfo.email,
        dateOfBirthAd: formData.personalInfo.dob,
        gender: formData.personalInfo.gender,
        bloodGroup: formData.personalInfo.bloodType,
        emergencyNumber: formData.personalInfo.emergencyNumber,
        emergencyName: formData.personalInfo.emergencyName,
        emergencyType: formData.personalInfo.emergencyRelation,
        guardianName: formData.personalInfo.guardianName,
        guardianType: formData.personalInfo.guardianRelation,
        guardianNumber: formData.personalInfo.guardianPhone,
      },
    };

    try {
      const response = await axiosInstance.post(
        "/api/v1/personal/save",
        newData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.responseCode === "201") {
        setFormData({
          email: "",
          dob: "",
          bloodType: "",
          emergencyNumber: "",
          emergencyName: "",
          emergencyType: "",
          guardianName: "",
          guardianType: "",
          guardianNumber: "",
        });
        handleNext();
        toast.success(response.data.data.message);
      } else {
        toast.error(response.data.data.message);
      }
    } catch (error) {
      console.error("Error adding Personal Data", error);
      toast.error("Error add personal Data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlenextsubmit = () => {
    // handleNext();
    onSubmit();
  };
  useEffect(() => {
    setIsLoading(true);
    const authToken = localStorage.getItem("authToken");
    const fetchPersonalDetails = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/personal/getById", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.data.responseCode === "200") {
          const data = response.data.data;

          setFormData((prev) => ({
            ...prev,
            personalInfo: {
              email: data.email || "",
              dob: data.dateOfBirthAd || "",
              gender: data.gender || "",
              bloodType: data.bloodGroup || "",
              emergencyNumber: data.emergencyNumber || "",
              emergencyName: data.emergencyName || "",
              emergencyRelation: data.emergencyType || "",
              guardianName: data.guardianName || "",
              guardianRelation: data.guardianType || "",
              guardianPhone: data.guardianNumber || "",
            },
            // Update other sections if needed (address, education, documents)
          }));
        } else {
          // toast.error("Failed to fetch data.");
        }
      } catch (error) {
        console.error("Error fetching personal details:", error);
        // toast.error("Error fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonalDetails();
  }, []);

  return (
    <div className="space-y-4 ">
      <h2 className="text-2xl font-bold">Personal Information</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center flex-col">
            <Inputcomp
              variant="bordered"
              type="email"
              id="email"
              label="Personal Email"
              value={formData?.personalInfo?.email}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  null,
                  "email",
                  e.target.value
                )
              }
            />
            {error.email && (
              <span className="text-red-500 text-xs mt-1">{error.email}</span>
            )}
          </div>

          {/* Gender Dropdown */}
          <div>
            <div className="flex items-center flex-col">
              <Select
                scrollShadowProps={{
                  isEnabled: true,
                }}
                variant="bordered"
                className="w-full rounded-lg shadow-lg shadow-gray-300"
                label="Gender"
                selectedKeys={[formData?.personalInfo?.gender]}
                onSelectionChange={(keys) =>
                  handleNestedChange(
                    "personalInfo",
                    null,
                    "gender",
                    [...keys][0]
                  )
                }>
                {genderOptions.map((g) => (
                  <SelectItem key={g}>{g}</SelectItem>
                ))}
              </Select>
              {error.gender && (
                <span className="text-red-500 text-xs mt-1">
                  {error.gender}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex  gap-x-4">
          {/**Date of Birth */}
          <div className="flex w-full flex-col items-center">
            <Inputcomp
              variant="bordered"
              type="date"
              label="Date of Birth"
              value={formData?.personalInfo?.dob}
              onChange={(e) =>
                handleNestedChange("personalInfo", null, "dob", e.target.value)
              }
            />
            {error.dob && (
              <span className="text-red-500 text-xs">{error.dob}</span>
            )}
          </div>

          {/* Blood Group Dropdown */}
          <div className="flex items-center  w-full flex-col">
            <Select
              classNames={{
                inputWrapper: "shadow-lg",
              }}
              variant="bordered"
              className="w-full rounded-lg shadow-lg shadow-gray-300"
              label="Blood Group"
              selectedKeys={[formData?.personalInfo?.bloodType]}
              onSelectionChange={(keys) =>
                handleNestedChange(
                  "personalInfo",
                  null,
                  "bloodType",
                  [...keys][0]
                )
              }>
              {bloodGroupOptions.map((group) => (
                <SelectItem key={group}>{group}</SelectItem>
              ))}
            </Select>
            {error.bloodType && (
              <span className="text-red-500 text-xs">{error.bloodType}</span>
            )}
          </div>
        </div>
      </div>
      {/* Guardian Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Guardian Details</h3>
        <div className="flex gap-x-4 w-full">
          <div className="w-full items-center flex flex-col">
            <Inputcomp
              id="username"
              type="text"
              label="Guardian Name"
              value={formData?.personalInfo?.guardianName}
              variant="bordered"
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  null,
                  "guardianName",
                  e.target.value
                )
              }
            />
            {error.guardianName && (
              <span className="text-red-500 text-xs">{error.guardianName}</span>
            )}
          </div>
          <div className="w-full items-center flex flex-col">
            <Inputcomp
              type="text"
              id="phone"
              label="Guardian Phone"
              variant="bordered"
              value={formData?.personalInfo?.guardianPhone}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  null,
                  "guardianPhone",
                  e.target.value
                )
              }
            />
            {error.guardianPhone && (
              <span className="text-red-500 text-xs">
                {error.guardianPhone}
              </span>
            )}
          </div>
        </div>

        {/* Guardian Relation Dropdown */}
        <div className="flex items-center flex-col max-w-[49.5%]">
          <Select
            classNames={{
              inputWrapper: "shadow-lg",
            }}
            variant="bordered"
            className="w-full rounded-lg shadow-lg shadow-gray-300"
            label="Guardian Relation"
            selectedKeys={[formData?.personalInfo?.guardianRelation]}
            onSelectionChange={(keys) =>
              handleNestedChange(
                "personalInfo",
                null,
                "guardianRelation",
                [...keys][0]
              )
            }>
            {relationOptions.map((relation) => (
              <DropdownItem key={relation}>{relation}</DropdownItem>
            ))}
          </Select>
          {error.guardianRelation && (
            <span className="text-red-500 text-xs">
              {error.guardianRelation}
            </span>
          )}
        </div>
      </div>

      {/* Emergency Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Emergency Details</h3>
        <div className="flex gap-x-4 w-full">
          <div className="w-full items-center flex flex-col">
            <Inputcomp
              id="username"
              variant="bordered"
              type="text"
              label="Emergency Name"
              value={formData?.personalInfo?.emergencyName}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  null,
                  "emergencyName",
                  e.target.value
                )
              }
            />
            {error.emergencyName && (
              <span className="text-red-500 text-xs">
                {error.emergencyName}
              </span>
            )}
          </div>
          <div className="w-full items-center flex flex-col">
            <Inputcomp
              id="phone"
              type="text"
              variant="bordered"
              label="Emergency Phone"
              value={formData?.personalInfo?.emergencyNumber}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  null,
                  "emergencyNumber",
                  e.target.value
                )
              }
            />
            {error.emergencyNumber && (
              <span className="text-red-500 text-xs">
                {error.emergencyNumber}
              </span>
            )}
          </div>
        </div>
        <div className="max-w-[49.5%] items-center flex flex-col">
          <Inputcomp
            type="text"
            variant="bordered"
            label="Emergency Relation"
            value={formData?.personalInfo?.emergencyRelation}
            onChange={(e) =>
              handleNestedChange(
                "personalInfo",
                null,
                "emergencyRelation",
                e.target.value
              )
            }
          />
          {error.emergencyRelation && (
            <span className="text-red-500 text-xs">
              {error.emergencyRelation}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button
          onPress={handleBack}
          isDisabled
          className="px-4 py-2 bg-gray-300 rounded">
          Back
        </Button>
        <Button
          onPress={handlenextsubmit}
          className="px-4 py-2 bg-green-500 text-white rounded">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default PersonalDetails;
