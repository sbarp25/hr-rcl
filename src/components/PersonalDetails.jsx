import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "react-toastify";
import Loader from "./Loader";
import InputComponent from "./InputComponent";
import { FaUser, FaPhone, FaEnvelope, FaCalendar } from "react-icons/fa";
import SelectComp from "./Select";
import DatepickerComponent, { formatDate } from "./DatepickerComponent";

const PersonalDetails = ({ handleNext, handleBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const genderOptions = [
    { key: "Male", label: "Male" },
    { key: "Female", label: "Female" },
  ];
  const maritalOptions = [
    { key: false, label: "Unmarried" },
    { key: true, label: "Married" },
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
  const {
    control,
    handleSubmit,
    reset,
    // formState: { errors },
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
    // const marriedstatus = Boolean(data.married);
    const formattedData = {
      data: {
        email: data.email,
        dateOfBirthAd: formatDate(data.dob),
        // dateOfBirthAd: data.dob,
        gender: data.gender,
        // married: marriedstatus,
        married: Boolean(data.married),
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
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
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
            married: Boolean(data.married) || "",
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
                    return age > 18 || "You must be 18 or older";
                  },
                }}
              />

              <div>
                <SelectComp
                  control={control}
                  name="bloodType"
                  rules={{ required: "Blood Type is required" }}
                  label="Blood Group"
                  data={bloodGroupOptions}
                  valueKey="key"
                  labelKey="label"
                />
              </div>

              {/* Gender */}
              <div>
                <SelectComp
                  control={control}
                  name="gender"
                  rules={{ required: "Gender is required" }}
                  label="Gender"
                  data={genderOptions}
                  valueKey="key"
                  labelKey="label"
                />
              </div>

              {/* Marital Status */}
              <div>
                <SelectComp
                  name="married"
                  label="Maritial Status"
                  control={control}
                  rules={{ required: "Maritial Status is required" }}
                  data={maritalOptions}
                  valueKey="key"
                  labelKey="label"
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
                <SelectComp
                  name="guardianRelation"
                  label="Relation"
                  control={control}
                  rules={{ required: "Guardian Relation is required" }}
                  data={relationOptions}
                  valueKey="key"
                  labelKey="label"
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
