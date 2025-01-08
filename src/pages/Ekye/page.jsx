import { useEffect, useState } from "react";
import { IoIosPeople } from "react-icons/io";
import DocumentDetails from "../../components/DocumentDetails";
import AddressDetails from "../../components/AddressDetails";
import EducationDetails from "../../components/EducationDetails.jsx";
import axiosInstance from "../../lib/axios-Instance.js";
import { toast } from "react-toastify";
import { Button, Input } from "@nextui-org/react";
import PersonalDetails from "../../components/PersonalDetails.jsx";
import Loader from "../../components/Loader.jsx";

const Ekye = () => {
  const provinces = [
    "Province 1",
    "Province 2",
    "Bagmati",
    "Gandaki",
    "Lumbini",
    "Karnali",
    "Sudurpashchim",
  ];
  const relations = ["Father", "Mother", "Brother", "Sister"];
  const BloodGroup = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  const gender = ["Male", "Female"];

  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      email: "",
      dob: "",
      gender: "",
      bloodType: "",
      emergencyNumber: "",
      emergencyName: "",
      emergencyRelation: "",
      guardianName: "",
      guardianType: "",
      guardianNumber: "",
    },
    address: {
      permanent: {
        province: "",
        district: "",
        municipality: "",
        ward: "",
        pincode: "",
        area: "",
      },
      temporary: {
        province: "",
        district: "",
        municipality: "",
        ward: "",
        pincode: "",
        area: "",
      },
      sameAsPermanent: false,
    },
    education: {
      degree: "",
      startYear: "",
      endYear: "",
      status: "",
      files: [],
    },
    documents: {
      pan: { number: "", issuedPlace: "", file: null },
      citizenship: { number: "", issuedDate: "", issuedPlace: "", file: null },
    },
  });
  const [personalData, setPersonalData] = useState("");

  const onSubmit = async (e) => {
    // e.preventDefault();
    // setIsLoading(true);
    const newData = {
      data: {
        email: formData.personalInfo.email,
        dateOfBirthAd: formData.personalInfo.dob,
        gender: formData.personalInfo.gender,
        bloodGroup: formData.personalInfo.bloodType,
        emergencyNumber: formData.personalInfo.emergencyNumber,
        emergencyName: formData.personalInfo.emergencyName,
        emergencyRelation: formData.personalInfo.emergencyRelation,
        guardianName: formData.personalInfo.guardianName,
        guardianType: formData.personalInfo.guardianRelation,
        guardianNumber: formData.personalInfo.guardianPhone,
      },
    };
    console.log(newData);
    try {
      const response = await axiosInstance.post(
        "/api/v1/personal-detail",
        newData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.responseCode === "201") {
        // Reset the form
        setFormData({
          email: "",
          dob: "",
          bloodType: "",
          emergencyNumber: "",
          emergencyName: "",
          guardianName: "",
          guardianType: "",
          guardianNumber: "",
        });
        toast.success(response.data.message);
      } else {
        toast.error("Failed to add employee.");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Error adding employee.");
    } finally {
      setIsLoading(false);
    }
  };

  //Code to have the Steps Implemented
  // const onSubmit = async (e) => {
  //   if (step === 0) {
  //     setIsLoading(true);
  //     const newPersonalData = {
  //       data: {
  //         email: formData.personalInfo.email,
  //         dateOfBirthAd: formData.personalInfo.dob,
  //         gender: formData.personalInfo.gender,
  //         bloodGroup: formData.personalInfo.bloodType,
  //         emergencyNumber: formData.personalInfo.emergency.name,
  //         emergencyName: formData.personalInfo.emergency.name,
  //         guardianName: formData.personalInfo.guardian.name,
  //         guardianType: formData.personalInfo.guardian.relation,
  //         guardianNumber: formData.personalInfo.guardian.phone,
  //         // id: 0,
  //         // usersId: 0,
  //       },
  //     };
  //     try {
  //       const response = await axiosInstance.post(
  //         "/v1/personal-detail",
  //         newPersonalData,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       if (response.data.responseCode === "201") {
  //         // Reset the form
  //         setFormData({
  //           email: "",
  //           dob: "",
  //           bloodType: "",
  //           emergencyNumber: "",
  //           emergencyName: "",
  //           guardianName: "",
  //           guardianType: "",
  //           guardianNumber: "",
  //         });
  //         toast.success("Personal Details Added Successfully");
  //       } else {
  //         toast.error("Failed to add Personal details.");
  //       }
  //     } catch (error) {
  //       console.error("Failed to add Personal details.", error);
  //       toast.error("Failed to add Personal details.", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   if (step === 1) {
  //     setIsLoading(true);
  //     const newAddressData = {
  //       data: {
  //         uadId: "0",
  //         usersId: "0",
  //         permanentAddress: {
  //           province: formData.address.permanent.province,
  //           district: formData.address.permanent.district,
  //           municipality: formData.address.permanent.municipality,
  //           ward: formData.address.permanent.ward,
  //           pincode: formData.address.permanent.pincode,
  //           area: formData.address.permanent.area,
  //         },
  //         temporaryAddress: {
  //           province: formData.address.temporary.province,
  //           district: formData.address.temporary.district,
  //           municipality: formData.address.temporary.municipality,
  //           ward: formData.address.temporary.ward,
  //           pincode: formData.address.temporary.pincode,
  //           area: formData.address.temporary.area,
  //         },
  //       },
  //     };
  //     try {
  //       const response = await axiosInstance.post(
  //         "/v1/personal-detail",
  //         newAddressData,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       if (response.data.responseCode === "201") {
  //         // Reset the form
  //         setFormData({
  //           email: "",
  //           dob: "",
  //           bloodType: "",
  //           emergencyNumber: "",
  //           emergencyName: "",
  //           guardianName: "",
  //           guardianType: "",
  //           guardianNumber: "",
  //         });
  //         toast.success("Personal Details Added Successfully");
  //       } else {
  //         toast.error("Failed to add Personal details.");
  //       }
  //     } catch (error) {
  //       console.error("Failed to add Personal details.", error);
  //       toast.error("Failed to add Personal details.", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // };
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const fetchPersonalDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          "/api/v1/personal-detail/get/userDetails",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
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

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNestedChange = (section, subSection, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: subSection
        ? {
            ...prev[section],
            [subSection]: {
              ...prev[section][subSection],
              [field]: value,
            },
          }
        : {
            ...prev[section],
            [field]: value,
          },
    }));
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  return (
    <>
      {isLoading && <Loader />}
      <div className="container ">
        <div className="page-title">
          <IoIosPeople className="text-4xl" />
          <p className="mt-1">Perform EKYE</p>
        </div>
        <div>
          <div className="bg-white rounded-md p-2 max-h-[80vh] overflow-x-auto">
            <div className="mb-4 flex justify-between items-center">
              {[
                "Personal Info",
                "Address Details",
                "Document Details",
                "Educational Details",
              ].map((label, index) => {
                const stepIndex = index;
                const nextstepIndex = index + 1;
                return (
                  <div
                    key={label}
                    // onClick={() => handleStepClick(stepIndex)}
                    className={`flex-1 text-center relative cursor-pointer ${
                      step >= stepIndex ? "text-green-500" : "text-gray-500"
                    }`}>
                    <div
                      className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                        step >= stepIndex
                          ? "bg-green-500 text-white"
                          : "bg-gray-300"
                      }`}>
                      {nextstepIndex}
                    </div>
                    <div className="mt-2 text-xs">{label}</div>
                  </div>
                );
              })}
            </div>
            {step === 0 && !isLoading && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Personal Information</h2>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={formData.personalInfo.email}
                      onChange={(e) =>
                        handleNestedChange(
                          "personalInfo",
                          null,
                          "email",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded"
                    />
                    <select
                      value={formData.personalInfo.gender}
                      onChange={(e) =>
                        handleNestedChange(
                          "personalInfo",
                          null,
                          "gender",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded">
                      <option value="">Select Gender</option>
                      {gender.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex w-full gap-x-4">
                    <Input
                      type="date"
                      placeholder="Date of Birth"
                      value={formData.personalInfo.dob}
                      onChange={(e) =>
                        handleNestedChange(
                          "personalInfo",
                          null,
                          "dob",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded"
                    />
                    <select
                      value={formData.personalInfo.bloodType}
                      onChange={(e) =>
                        handleNestedChange(
                          "personalInfo",
                          null,
                          "bloodType",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded">
                      <option value="">Select Blood Group</option>
                      {BloodGroup.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Guardian Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Guardian Details</h3>
                  <div className="flex gap-x-4 w-full">
                    <Input
                      type="text"
                      placeholder="Guardian Name"
                      value={formData.personalInfo.guardianName}
                      onChange={(e) =>
                        handleNestedChange(
                          "personalInfo",
                          null,
                          "guardianName",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded"
                    />

                    <Input
                      type="text"
                      placeholder="Guardian Phone"
                      value={formData.personalInfo.guardianPhone}
                      onChange={(e) =>
                        handleNestedChange(
                          "personalInfo",
                          null,
                          "guardianPhone",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <select
                    value={formData.personalInfo.guardianRelation}
                    onChange={(e) =>
                      handleNestedChange(
                        "personalInfo",
                        null,
                        "guardianRelation",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded">
                    <option value="">Select Relation</option>
                    {relations.map((relation) => (
                      <option key={relation} value={relation}>
                        {relation}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Emergency Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Emergency Details</h3>
                  <div className="flex gap-x-4 w-full">
                    <Input
                      type="text"
                      placeholder="Emergency Name"
                      value={formData.personalInfo.emergencyName}
                      onChange={(e) =>
                        handleNestedChange(
                          "personalInfo",
                          null,
                          "emergencyName",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded"
                    />
                    <Input
                      type="text"
                      placeholder="Emergency Phone"
                      value={formData.personalInfo.emergencyNumber}
                      onChange={(e) =>
                        handleNestedChange(
                          "personalInfo",
                          null,
                          "emergencyNumber",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="Emergency Relation"
                    value={formData.personalInfo.emergencyRelation}
                    onChange={(e) =>
                      handleNestedChange(
                        "personalInfo",
                        null,
                        "emergencyRelation",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            )}
            {step === 1 && (
              <AddressDetails
                formData={formData}
                handleChange={handleChange}
                handleNestedChange={handleNestedChange}
              />
            )}
            {step === 2 && (
              <DocumentDetails
                formData={formData}
                handleNestedChange={handleNestedChange}
              />
            )}

            {step === 3 && (
              <EducationDetails
                formData={formData}
                handleNestedChange={handleNestedChange}
              />
            )}
          </div>
          <div className="form-navigation flex justify-between mt-6">
            {step > 0 && (
              <Button
                onPress={handleBack}
                className="px-4 py-2 bg-gray-300 rounded">
                Back
              </Button>
            )}
            {step < 3 && (
              <Button
                onPress={() => {
                  onSubmit();
                  handleNext();
                }}
                className="px-4 py-2 bg-bgprimary text-white rounded">
                Next
              </Button>
            )}
            {step === 3 && (
              <Button
                onPress={onSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded">
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Ekye;
