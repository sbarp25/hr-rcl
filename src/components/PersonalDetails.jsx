import {
  Button,
  Input,
  DropdownItem,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "react-toastify";
import Inputcomp from "./Inputcomp";

const PersonalDetails = ({
  formData,
  handleNestedChange,
  handleNext,
  setFormData,
  handleBack,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const genderOptions = ["Male", "Female"];
  const Married = ["Unmarried", "Married"];
  const bloodGroupOptions = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  const relationOptions = ["Father", "Mother", "Brother", "Sister"];

  const onSubmit = async () => {
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

      if (response?.data?.responseCode === "201") {
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
        toast.success(response?.data?.message);
        handleNext(); // Move to the next step
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

  const validateFormData = () => {
    const newErrors = {};
    const {
      email,
      dob,
      gender,
      bloodType,
      emergencyNumber,
      emergencyName,
      emergencyRelation,
      guardianName,
      guardianPhone,
      guardianRelation,
    } = formData.personalInfo;

    if (!email) newErrors.email = "Email is required.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!dob) newErrors.dob = "Date of Birth is required.";
    if (!gender) newErrors.gender = "Gender is required.";
    if (!bloodType) newErrors.bloodType = "Blood Type is required.";
    if (!emergencyNumber)
      newErrors.emergencyNumber = "Emergency Phone is required.";
    if (emergencyNumber && emergencyNumber.length !== 10) {
      newErrors.emergencyNumber = "Emergency Phone must be 10 digits.";
    }
    if (emergencyNumber && !/^[0-9]{10,10}$/.test(emergencyNumber)) {
      newErrors.emergencyNumber = "Invalid emergencyNumber format.";
    }
    if (!emergencyRelation)
      newErrors.emergencyRelation = "Emergency Relation is Required ";
    if (!emergencyName) newErrors.emergencyName = "Emergency Name is required.";
    if (!guardianName) newErrors.guardianName = "Guardian Name is required.";
    if (!guardianPhone) newErrors.guardianPhone = "Guardian Phone is required.";

    if (guardianPhone && !/^[0-9]{10,10}$/.test(guardianPhone)) {
      newErrors.guardianPhone = "Invalid guardianPhone format.";
    }
    if (!guardianRelation)
      newErrors.guardianRelation = "Guardain Relation is Required ";

    setErrors(newErrors); // Update errors state

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handlenextsubmit = () => {
    if (validateFormData()) {
      onSubmit(); // Submit the form if valid
      // handleNext(); // Move to the next step
    }
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
        if (response?.data?.responseCode === "200") {
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
    <div className="space-y-8 bg-white rounded-2xl mx-auto">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700 py-3">
          Personal Information
        </h2>
        {/**Personal Detials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Personal Email */}
          <div>
            <Input
              type="email"
              id="email"
              variant="bordered"
              label="Personal Email"
              className={`w-full rounded-xl ${
                errors.email ? "border-2 border-red-500" : ""
              }`}
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
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/**DOB */}
          <div>
            <Input
              type="date"
              variant="bordered"
              label="Date of Birth"
              className={`w-full   rounded-xl ${
                errors.dob ? "border-2 border-red-500" : ""
              }`}
              value={formData?.personalInfo?.dob}
              onChange={(e) =>
                handleNestedChange("personalInfo", null, "dob", e.target.value)
              }
            />
            {errors.dob && (
              <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
            )}
          </div>
          {/**Blood type */}
          <div>
            <Select
              variant="bordered"
              classNames={{ inputWrapper: "shadow-md" }}
              className={`w-full   rounded-xl ${
                errors.bloodType ? "border-2 border-red-500" : ""
              }`}
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
            {errors.bloodType && (
              <p className="text-red-500 text-sm mt-1">{errors.bloodType}</p>
            )}
          </div>
          {/* Gender Dropdown */}
          <div>
            <Select
              variant="bordered"
              scrollShadowProps={{ isEnabled: true }}
              className={`w-full   rounded-xl ${
                errors.gender ? "border-2 border-red-500" : ""
              }`}
              label="Gender"
              selectedKeys={[formData?.personalInfo?.gender]}
              onSelectionChange={(keys) =>
                handleNestedChange("personalInfo", null, "gender", [...keys][0])
              }>
              {genderOptions.map((g) => (
                <SelectItem key={g}>{g}</SelectItem>
              ))}
            </Select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </div>
          {/* Marital status Dropdown */}
          <div>
            <Select
              variant="bordered"
              classNames={{ inputWrapper: "shadow-md" }}
              className={`w-full   rounded-xl ${
                errors.bloodType ? "border-2 border-red-500" : ""
              }`}
              label="Marital status"
              selectedKeys={[formData?.personalInfo?.married]}
              onSelectionChange={(keys) =>
                handleNestedChange(
                  "personalInfo",
                  null,
                  "married",
                  [...keys][0]
                )
              }>
              {Married.map((group) => (
                <SelectItem key={group}>{group}</SelectItem>
              ))}
            </Select>
            {errors.bloodType && (
              <p className="text-red-500 text-sm mt-1">{errors.bloodType}</p>
            )}
          </div>
        </div>
      </div>

      {/* Guardian Details */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Guardian Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/** Guardian Name */}
          <div>
            <Input
              variant="bordered"
              id="guardianName"
              type="text"
              label="Guardian Name"
              value={formData?.personalInfo?.guardianName}
              className={`w-full  rounded-xl ${
                errors.guardianName ? "  border-2 border-red-500" : ""
              }`}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  null,
                  "guardianName",
                  e.target.value
                )
              }
            />
            {errors.guardianName && (
              <p className="text-red-500 text-sm mt-1">{errors.guardianName}</p>
            )}
          </div>
          {/**Guardian Phone */}
          <div>
            <Input
              variant="bordered"
              type="text"
              id="guardianPhone"
              label="Guardian Phone"
              className={`w-full rounded-xl ${
                errors.guardianPhone ? "border-2 border-red-500" : ""
              }`}
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
            {errors.guardianPhone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.guardianPhone}
              </p>
            )}
          </div>
          {/** Guardian Relation */}
          <div>
            <Select
              variant="bordered"
              className={`w-full rounded-xl ${
                errors.guardianRelation ? "border-2 border-red-500" : ""
              }`}
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
            {errors.guardianRelation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.guardianRelation}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Details */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Emergency Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-8">
          {/** Emergency Name */}
          <div>
            <Input
              variant="bordered"
              id="emergencyName"
              className={`w-full rounded-xl ${
                errors.emergencyName ? " border-2 border-red-500" : ""
              }`}
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
            {errors.emergencyName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.emergencyName}
              </p>
            )}
          </div>
          {/** Emergency Phone */}
          <div>
            <Input
              id="emergencyPhone"
              variant="bordered"
              type="text"
              className={`w-full rounded-xl ${
                errors.emergencyNumber ? " border-2 border-red-500" : ""
              }`}
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
            {errors.emergencyNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.emergencyNumber}
              </p>
            )}
          </div>
          {/** Emergency Relation */}
          <div>
            <Input
              variant="bordered"
              type="text"
              className={`w-full rounded-xl ${
                errors.emergencyRelation ? "border-2 border-red-500" : ""
              }`}
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
            {errors.emergencyRelation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.emergencyRelation}
              </p>
            )}
          </div>
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
          onPress={handlenextsubmit}
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default PersonalDetails;
