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
      emergencyType: "",
      guardianName: "",
      guardianType: "",
      guardianNumber: "",
    },
    address: {
      permanent: {
        provinceId: "",
        districtId: "",
        municipality: "",
        wardNumber: "",
        pinCode: "",
        tole: "",
      },
      temporary: {
        provinceId: "",
        districtId: "",
        municipality: "",
        wardNumber: "",
        pinCode: "",
        tole: "",
      },
      sameAsPermanent: false,
    },

    education: [
      {
        degree: "",
        startYear: "",
        endYear: "",
        status: "",
        files: [],
      },
    ],
    documents: {
      documentType: "",
      panNumber: "",
      citizenshipNumber: "",
      issueDate: "",
      issuedPlace: "",
      isIssuedPlaceDistrict: "",
      panCardDocumentFile: "",
      citizenshipFrontDocumentFile: "",
      citizenshipBackDocumentFile: "",
    },
  });
  const [personalData, setPersonalData] = useState("");

  const onSubmit = async (e) => {
    // e.preventDefault();
    setIsLoading(true);
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

  useEffect(() => {
    setIsLoading(true);
    const authToken = localStorage.getItem("authToken");
    const fetchPersonalDetails = async () => {
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
      <div className="container bg-gray-100 pb-6">
        <div className="page-title">
          <IoIosPeople className="text-4xl" />
          <p className="mt-1">Perform EKYE</p>
        </div>
        <div>
          <div className="bg-gray-200 rounded-md p-2 max-h-[90vh] overflow-x-auto">
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
                    }`}
                  >
                    <div
                      className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                        step >= stepIndex
                          ? "bg-green-500 text-white"
                          : "bg-gray-300"
                      }`}
                    >
                      {nextstepIndex}
                    </div>
                    <div className="mt-2 text-xs">{label}</div>
                  </div>
                );
              })}
            </div>
            {step === 0 && !isLoading && (
              <PersonalDetails
                handleNext={handleNext}
                formData={formData}
                handleBack={handleBack}
                handleNestedChange={handleNestedChange}
                setFormData={setFormData}
              />
            )}
            {step === 1 && (
              <AddressDetails
                handleNext={handleNext}
                handleBack={handleBack}
                setFormData={setFormData}
                formData={formData}
                handleChange={handleChange}
                handleNestedChange={handleNestedChange}
              />
            )}
            {step === 2 && (
              <DocumentDetails
                handleNext={handleNext}
                handleBack={handleBack}
                setFormData={setFormData}
                formData={formData}
                handleNestedChange={handleNestedChange}
              />
            )}

            {step === 3 && (
              <EducationDetails
                handleNext={handleNext}
                handleBack={handleBack}
                setFormData={setFormData}
                formData={formData}
                handleNestedChange={handleNestedChange}
              />
            )}
          </div>
          <div className="form-navigation flex justify-between mt-6">
            {step > 0 && (
              <Button
                onPress={handleBack}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Back
              </Button>
            )}
            {step < 3 && (
              <Button
                onPress={() => {
                  // onSubmit();
                  handleNext();
                }}
                className="px-4 py-2 bg-bgprimary text-white rounded"
              >
                Next
              </Button>
            )}
            {step === 3 && (
              <Button
                onPress={onSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
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
