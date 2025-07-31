import { Button } from "@heroui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import InputComponent from "./ui/InputComponent.jsx";
import { FaUser, FaPhone } from "react-icons/fa";
import DatepickerComponent, { formatDate } from "./ui/DatepickerComponent.jsx";
import ReusableAutocomplete from "./ui/SearableDropdown";
import Loader from "./Loader/Loader.jsx";
import {
  usePersonalDetails,
  useSavePersonalDetails,
} from "../hooks/useAuth.js";

const PersonalDetails = ({ handleNext, handleBack, setDateOfBirth }) => {
  // Form options
  const genderOptions = [
    { key: "Male", label: "Male" },
    { key: "Female", label: "Female" },
  ];
  const maritalOptions = [
    { key: "false", label: "Unmarried" },
    { key: "true", label: "Married" },
  ];
  const bloodGroupOptions = [
    { key: "O+", label: "O+" },
    { key: "O-", label: "O-" },
    { key: "A+", label: "A+" },
    { key: "A-", label: "A-" },
    { key: "B+", label: "B+" },
    { key: "B-", label: "B-" },
    { key: "AB+", label: "AB+" },
    { key: "AB-", label: "AB-" },
  ];
  const relationOptions = [
    { key: "Father", label: "Father" },
    { key: "Mother", label: "Mother" },
    { key: "Brother", label: "Brother" },
    { key: "Sister", label: "Sister" },
  ];

  // Form setup
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      email: "",
      dob: "",
      gender: "",
      married: "",
      bloodType: "",
      emergencyNumber: "",
      emergencyName: "",
      emergencyRelation: "",
      guardianName: "",
      guardianRelation: "",
      guardianPhone: "",
    },
    mode: "onChange",
  });

  // React Query hooks
  const {
    data: personalDetailsData,
    isLoading: isLoadingDetails,
    error: fetchError,
  } = usePersonalDetails();

  const savePersonalDetailsMutation = useSavePersonalDetails(() => {
    reset();
    handleNext();
  });

  // Handle form submission
  const onSubmit = async (data) => {
    const formattedData = {
      data: {
        email: data.email,
        dateOfBirthAd: formatDate(data.dob),
        gender: data.gender,
        married: data.married === "true",
        bloodGroup: data.bloodType,
        emergencyNumber: data.emergencyNumber,
        emergencyName: data.emergencyName,
        emergencyType: data.emergencyRelation,
        guardianName: data.guardianName,
        guardianType: data.guardianRelation,
        guardianNumber: data.guardianPhone,
      },
    };

    setDateOfBirth(formatDate(data.dob));
    savePersonalDetailsMutation.mutate(formattedData);
  };

  // Reset form with fetched data
  useEffect(() => {
    if (personalDetailsData?.responseCode === "200") {
      const data = personalDetailsData.data;
      setValue("married", data.married);
      reset({
        email: data.email || "",
        dob: data.dateOfBirthAd || "",
        gender: data.gender || "",
        married: data.married?.toString(),
        bloodType: data.bloodGroup || "",
        emergencyNumber: data.emergencyNumber || "",
        emergencyName: data.emergencyName || "",
        emergencyRelation: data.emergencyType || "",
        guardianName: data.guardianName || "",
        guardianRelation: data.guardianType || "",
        guardianPhone: data.guardianNumber || "",
      });
    }
  }, [personalDetailsData, reset]);

  // Loading state
  const isLoading = isLoadingDetails || savePersonalDetailsMutation.isPending;

  return (
    <>
      {isLoading && <Loader message="Loading please wait" />}
      <div className="space-y-8 rounded-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-white py-3">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Email */}
              <InputComponent
                name="email"
                control={control}
                variant="bordered"
                label="Personal Email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Enter a valid email address",
                  },
                }}
              />

              {/* Date of Birth */}
              <DatepickerComponent
                name="dob"
                label="Date of birth(A.D)"
                control={control}
                rules={{
                  required: "Date of Birth is required",
                  validate: (value) => {
                    const birthdate = new Date(value);
                    const today = new Date();
                    const age = today.getFullYear() - birthdate.getFullYear();
                    if (age < 18) {
                      return "You must be at least 18 years old";
                    }
                    if (age >= 100) {
                      return "Age must be less than 100 years";
                    }
                    return true;
                  },
                }}
              />

              <div>
                <ReusableAutocomplete
                  name="bloodType"
                  control={control}
                  label="Blood Group"
                  items={bloodGroupOptions}
                  rules={{ required: "Blood Type is required" }}
                />
              </div>

              {/* Gender */}
              <div>
                <ReusableAutocomplete
                  name="gender"
                  control={control}
                  label="Gender"
                  items={genderOptions}
                  rules={{ required: "Gender is required" }}
                />
              </div>

              {/* Marital Status */}
              <div>
                <ReusableAutocomplete
                  name="married"
                  control={control}
                  label="Maritial Status"
                  items={maritalOptions}
                  rules={{ required: "Maritial Status is required" }}
                />
              </div>
            </div>
          </div>

          {/* Guardian Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Guardian Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Guardian Name */}
              <InputComponent
                name="guardianName"
                control={control}
                rules={{
                  required: "Guardian Name is required",
                  minLength: {
                    value: 3,
                    message: "Guardian Name must atleast be 3 character long",
                  },
                  validate: {
                    onlyLettersAndSpaces: (value) =>
                      /^[A-Za-z\s]+$/.test(value) ||
                      "Name must not contain numbers or special characters",
                    noLeadingSpace: (value) =>
                      !/^\s/.test(value) || "Name must not start with a space",
                  },
                }}
                label="Guardian Name"
                variant="bordered"
                type="text"
                inputClassName="w-full rounded-xl"
                icon={FaUser}
              />

              {/* Guardian Phone */}
              <InputComponent
                name="guardianPhone"
                control={control}
                rules={{
                  required: "Guardian Phone is required",
                  validate: {
                    only9and8: (value) =>
                      /^9[0-9]{9}$/.test(value) ||
                      "Phone must start with 9 and be 10 digits long",
                    noLeadingSpace: (value) =>
                      !/^\s/.test(value) || "Name must not start with a space",
                  },
                }}
                label="Guardian Phone"
                variant="bordered"
                type="text"
                inputClassName="w-full rounded-xl"
                icon={FaPhone}
              />

              {/* Guardian Relation */}
              <div>
                <ReusableAutocomplete
                  name="guardianRelation"
                  control={control}
                  label="Relation"
                  items={relationOptions}
                  rules={{ required: "Guardian Relation is required" }}
                />
              </div>
            </div>
          </div>

          {/* Emergency Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Emergency Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Emergency Name */}
              <InputComponent
                name="emergencyName"
                control={control}
                rules={{
                  required: " Name is required",
                  minLength: {
                    value: 3,
                    message: " Name must atleast be 3 character long",
                  },
                  validate: {
                    onlyLettersAndSpaces: (value) =>
                      /^[A-Za-z\s]+$/.test(value) ||
                      "Name must not contain numbers or special characters",
                    noLeadingSpace: (value) =>
                      !/^\s/.test(value) || "Name must not start with a space",
                  },
                }}
                label="Full Name"
                variant="bordered"
                type="text"
                inputClassName="w-full rounded-xl"
                icon={FaUser}
              />

              {/* Emergency Number */}
              <InputComponent
                name="emergencyNumber"
                control={control}
                rules={{
                  required: " Number is required",
                  pattern: {
                    value: /^9[0-9]{9}$/,
                    message: "Phone must start with 9 and be 10 digits long",
                  },
                }}
                label=" Phone Number"
                variant="bordered"
                type="text"
                inputClassName="w-full rounded-xl"
                icon={FaPhone}
              />

              {/* Emergency Relation */}
              <InputComponent
                name="emergencyRelation"
                control={control}
                rules={{
                  required: "Relation is required",
                  minLength: {
                    value: 3,
                    message: "Relation must atleast be 3 character long",
                  },
                  pattern: {
                    value: /^[^\s]/,
                    message: "Relation cannot start with a space",
                  },
                }}
                label=" Relation"
                variant="bordered"
                type="text"
                inputClassName="w-full rounded-xl"
                icon={FaUser}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-8">
            <Button
              onPress={handleBack}
              isDisabled
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg">
              Back
            </Button>
            <Button
              type="submit"
              isDisabled={savePersonalDetailsMutation.isLoading}
              className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
              {savePersonalDetailsMutation.isLoading
                ? "Submitting..."
                : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PersonalDetails;
