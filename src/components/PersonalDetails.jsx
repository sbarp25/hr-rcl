import { Button, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "react-toastify";
import Loader from "./Loader";
import InputComponent from "./InputComponent"; // Import your custom component
import { FaUser, FaPhone, FaEnvelope, FaCalendar } from "react-icons/fa"; // Import icons if needed

const PersonalDetails = ({ handleNext, handleBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const genderOptions = ["Male", "Female"];
  const maritalOptions = [
    { key: false, label: "Unmarried" },
    { key: true, label: "Married" },
  ];
  const bloodGroupOptions = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  const relationOptions = ["Father", "Mother", "Brother", "Sister"];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
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
    mode: "onBlur", // This triggers validation on blur for better user experience
  });

  const onSubmit = async (data) => {
    const formattedData = {
      data: {
        email: data.email,
        dateOfBirthAd: data.dob,
        gender: data.gender,
        married: data.married,
        bloodGroup: data.bloodType,
        emergencyNumber: data.emergencyNumber,
        emergencyName: data.emergencyName,
        emergencyType: data.emergencyRelation,
        guardianName: data.guardianName,
        guardianType: data.guardianRelation,
        guardianNumber: data.guardianPhone,
      },
    };
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/v1/personal/save",
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.responseCode === "201") {
        reset();
        toast.success(response?.data?.message);
        handleNext();
      } else {
        toast.error(response.data.data.message);
      }
    } catch (error) {
      console.error("Error adding Personal Data", error);
      toast.error("Error adding personal Data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const fetchPersonalDetails = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/personal/getById", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response?.data?.responseCode === "200") {
          const data = response.data.data;
          reset({
            email: data.email || "",
            dob: data.dateOfBirthAd || "",
            gender: data.gender || "",
            married: data.married !== undefined ? data.married : "",
            bloodType: data.bloodGroup || "",
            emergencyNumber: data.emergencyNumber || "",
            emergencyName: data.emergencyName || "",
            emergencyRelation: data.emergencyType || "",
            guardianName: data.guardianName || "",
            guardianRelation: data.guardianType || "",
            guardianPhone: data.guardianNumber || "",
          });
        }
      } catch (error) {
        console.error("Error fetching personal details:", error);
      }
    };

    fetchPersonalDetails();
  }, [reset]);

  return (
    <>
      {isLoading && <Loader message="Loading please wait" />}
      <div className="space-y-8 bg-white rounded-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700 py-3">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Email */}
              <InputComponent
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                }}
                label="Personal Email"
                variant="bordered"
                type="email"
                inputClassName="w-full rounded-xl"
                icon={FaEnvelope}
              />

              {/* Date of Birth */}
              <InputComponent
                name="dob"
                control={control}
                rules={{ required: "Date of Birth is required" }}
                label="Date of Birth"
                variant="bordered"
                type="date"
                inputClassName="w-full rounded-xl"
                icon={FaCalendar}
              />

              {/* Blood Type */}
              <div>
                <Controller
                  name="bloodType"
                  control={control}
                  rules={{ required: "Blood Type is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      variant="bordered"
                      label="Blood Group"
                      isInvalid={!!errors.bloodType}
                      errorMessage={errors.bloodType?.message}
                      validationBehavior="aria"
                      className="rounded-xl w-full"
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0];
                        if (selectedKey) field.onChange(selectedKey);
                      }}>
                      {bloodGroupOptions.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              </div>

              {/* Gender */}
              <div>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      variant="bordered"
                      label="Gender"
                      isInvalid={!!errors.gender}
                      errorMessage={errors.gender?.message}
                      validationBehavior="aria"
                      className="rounded-xl w-full"
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0];
                        if (selectedKey) field.onChange(selectedKey);
                      }}>
                      {genderOptions.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              </div>

              {/* Marital Status */}
              <div>
                <Controller
                  name="married"
                  control={control}
                  rules={{ required: "Marital Status is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      variant="bordered"
                      label="Marital Status"
                      isInvalid={!!errors.married}
                      errorMessage={errors.married?.message}
                      validationBehavior="aria"
                      className="rounded-xl w-full"
                      selectedKeys={field.value !== "" ? [field.value] : []}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0];
                        if (selectedKey !== undefined)
                          field.onChange(selectedKey);
                      }}>
                      {maritalOptions.map((status) => (
                        <SelectItem key={status.key} value={status.key}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Guardian Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
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
                  pattern: {
                    value: /^9[0-9]{9}$/,
                    message: "Phone must start with 9 and be 10 digits long",
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
                <Controller
                  name="guardianRelation"
                  control={control}
                  rules={{ required: "Guardian Relation is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      variant="bordered"
                      label="Guardian Relation"
                      isInvalid={!!errors.guardianRelation}
                      errorMessage={errors.guardianRelation?.message}
                      validationBehavior="aria"
                      className="rounded-xl w-full"
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0];
                        if (selectedKey) field.onChange(selectedKey);
                      }}>
                      {relationOptions.map((relation) => (
                        <SelectItem key={relation} value={relation}>
                          {relation}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Emergency Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Emergency Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Emergency Name */}
              <InputComponent
                name="emergencyName"
                control={control}
                rules={{
                  required: "Emergency Name is required",
                  minLength: {
                    value: 3,
                    message: "Emergency Name must atleast be 3 character long",
                  },
                }}
                label="Emergency Name"
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
                  required: "Emergency Number is required",
                  pattern: {
                    value: /^9[0-9]{9}$/,
                    message: "Phone must start with 9 and be 10 digits long",
                  },
                }}
                label="Emergency Phone"
                variant="bordered"
                type="text"
                inputClassName="w-full rounded-xl"
                icon={FaPhone}
              />

              {/* Emergency Relation */}
              <InputComponent
                name="emergencyRelation"
                control={control}
                rules={{ required: "Emergency Relation is required" }}
                label="Emergency Relationship"
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
              className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PersonalDetails;
