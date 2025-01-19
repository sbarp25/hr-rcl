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

  const genderOptions = ["Male", "Female"];
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
    handleNext();
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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Personal Information</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Inputcomp
            variant="bordered"
            type="email"
            id="email"
            label="Personal Email"
            value={formData?.personalInfo?.email}
            onChange={(e) =>
              handleNestedChange("personalInfo", null, "email", e.target.value)
            }
          />

          {/* Gender Dropdown */}
          <div className="flex items-center">
            <Select
              scrollShadowProps={{
                isEnabled: true,
              }}
              variant="bordered"
              className="w-full rounded-lg shadow-lg shadow-gray-300"
              label="Gender"
              selectedKeys={[formData?.personalInfo?.gender]}
              onSelectionChange={(keys) =>
                handleNestedChange("personalInfo", null, "gender", [...keys][0])
              }>
              {genderOptions.map((g) => (
                <SelectItem key={g}>{g}</SelectItem>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex  gap-x-4">
          <Inputcomp
            variant="bordered"
            type="date"
            label="Date of Birth"
            value={formData?.personalInfo?.dob}
            onChange={(e) =>
              handleNestedChange("personalInfo", null, "dob", e.target.value)
            }
          />

          {/* Blood Group Dropdown */}
          <div className="flex items-center  w-full">
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
          </div>
        </div>
      </div>
      {/* Guardian Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Guardian Details</h3>
        <div className="flex gap-x-4 w-full">
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
        </div>

        {/* Guardian Relation Dropdown */}
        <div className="flex items-center max-w-[49.5%]">
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
        </div>
      </div>

      {/* Emergency Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Emergency Details</h3>
        <div className="flex gap-x-4 w-full">
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
        </div>
        <Inputcomp
          className="max-w-[49.5%]"
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
