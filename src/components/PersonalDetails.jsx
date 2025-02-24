import {
  Button,
  Input,
  DropdownItem,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "react-toastify";
import Loader from "./Loader";

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
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                }}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      type="email"
                      variant="bordered"
                      label="Personal Email"
                      className={`w-full rounded-xl ${
                        errors.email ? "border-2 border-red-500" : ""
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Date of Birth */}
              <Controller
                name="dob"
                control={control}
                rules={{ required: "Date of Birth is required" }}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      type="date"
                      variant="bordered"
                      label="Date of Birth"
                      className={`w-full rounded-xl ${
                        errors.dob ? "border-2 border-red-500" : ""
                      }`}
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dob.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Blood Type */}
              <Controller
                name="bloodType"
                control={control}
                rules={{ required: "Blood Type is required" }}
                render={({ field }) => (
                  <div>
                    <Select
                      {...field}
                      variant="bordered"
                      label="Blood Group"
                      className={`w-full rounded-xl ${
                        errors.bloodType ? "border-2 border-red-500" : ""
                      }`}
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) =>
                        field.onChange([...keys][0])
                      }>
                      {bloodGroupOptions.map((group) => (
                        <SelectItem key={group}>{group}</SelectItem>
                      ))}
                    </Select>
                    {errors.bloodType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.bloodType.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Gender */}
              <Controller
                name="gender"
                control={control}
                rules={{ required: "Gender is required" }}
                render={({ field }) => (
                  <div>
                    <Select
                      {...field}
                      variant="bordered"
                      label="Gender"
                      className={`w-full rounded-xl ${
                        errors.gender ? "border-2 border-red-500" : ""
                      }`}
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) =>
                        field.onChange([...keys][0])
                      }>
                      {genderOptions.map((gender) => (
                        <SelectItem key={gender}>{gender}</SelectItem>
                      ))}
                    </Select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Marital Status */}
              <Controller
                name="married"
                control={control}
                rules={{ required: "Marital Status is required" }}
                render={({ field }) => (
                  <div>
                    <Select
                      {...field}
                      variant="bordered"
                      label="Marital Status"
                      className={`w-full rounded-xl ${
                        errors.married ? "border-2 border-red-500" : ""
                      }
                    }`}
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) =>
                        field.onChange([...keys][0])
                      }>
                      {maritalOptions.map((status) => (
                        <SelectItem key={status.key} textValue={status.label}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </Select>
                    {errors.married && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.married?.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Guardian Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Guardian Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Guardian Name */}
              <Controller
                name="guardianName"
                control={control}
                rules={{ required: "Guardian Name is required" }}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      variant="bordered"
                      type="text"
                      label="Guardian Name"
                      className={`w-full rounded-xl ${
                        errors.guardianName ? "border-2 border-red-500" : ""
                      }`}
                    />
                    {errors.guardianName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.guardianName.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Guardian Phone */}
              <Controller
                name="guardianPhone"
                control={control}
                rules={{
                  required: "Guardian Phone is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone must be 10 digits",
                  },
                }}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      variant="bordered"
                      type="text"
                      label="Guardian Phone"
                      className={`w-full rounded-xl ${
                        errors.guardianPhone ? "border-2 border-red-500" : ""
                      }`}
                    />
                    {errors.guardianPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.guardianPhone.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Guardian Relation */}
              <Controller
                name="guardianRelation"
                control={control}
                rules={{ required: "Guardian Relation is required" }}
                render={({ field }) => (
                  <div>
                    <Select
                      {...field}
                      variant="bordered"
                      label="Guardian Relation"
                      className={`w-full rounded-xl ${
                        errors.guardianRelation ? "border-2 border-red-500" : ""
                      }`}
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) =>
                        field.onChange([...keys][0])
                      }>
                      {relationOptions.map((relation) => (
                        <SelectItem key={relation}>{relation}</SelectItem>
                      ))}
                    </Select>
                    {errors.guardianRelation && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.guardianRelation.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Emergency Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Emergency Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Emergency Name */}
              <Controller
                name="emergencyName"
                control={control}
                rules={{ required: "Emergency Name is required" }}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      variant="bordered"
                      type="text"
                      label="Emergency Name"
                      className={`w-full rounded-xl ${
                        errors.emergencyName ? "border-2 border-red-500" : ""
                      }`}
                    />
                    {errors.emergencyName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.emergencyName.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Emergency Number */}
              <Controller
                name="emergencyNumber"
                control={control}
                rules={{
                  required: "Emergency Number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone must be 10 digits",
                  },
                }}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      variant="bordered"
                      type="text"
                      label="Emergency Phone"
                      className={`w-full rounded-xl ${
                        errors.emergencyNumber ? "border-2 border-red-500" : ""
                      }`}
                    />
                    {errors.emergencyNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.emergencyNumber.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Emergency Relation */}
              <Controller
                name="emergencyRelation"
                control={control}
                rules={{ required: "Emergency Relation is required" }}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      variant="bordered"
                      type="text"
                      label="Emergency Relationship"
                      className={`w-full rounded-xl ${
                        errors.emergencyRelation
                          ? "border-2 border-red-500"
                          : ""
                      }`}
                    />
                    {errors.emergencyRelation && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.emergencyRelation.message}
                      </p>
                    )}
                  </div>
                )}
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
