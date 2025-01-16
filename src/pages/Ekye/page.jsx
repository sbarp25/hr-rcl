import { useEffect, useState } from "react";
import { IoIosPeople } from "react-icons/io";
import DocumentDetails from "../../components/DocumentDetails";
import AddressDetails from "../../components/AddressDetails";
import EducationDetails from "../../components/EducationDetails.jsx";
import axiosInstance from "../../lib/axios-Instance.js";
import PersonalDetails from "../../components/PersonalDetails.jsx";
import Loader from "../../components/Loader.jsx";
import ValidationComponent from "../../components/ValidationComponent.jsx";

const Ekye = () => {
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
              ...prev[section]?.[subSection],
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
      <div className="container h-screen bg-gray-200 pb-6">
        <div className="page-title">
          <IoIosPeople className="text-4xl" />
          <p className="mt-1">Perform EKYE</p>
        </div>
        <div>
          <div className="rounded-md p-2 relative">
            <div className="mb-4 flex items-center justify-between relative">
              {[
                "Personal Info",
                "Address Details",
                "Document Details",
                "Educational Details",
              ].map((label, index) => {
                const stepIndex = index;

                return (
                  <div
                    key={label}
                    className={`flex-1 text-center relative cursor-pointer ${
                      step >= stepIndex
                        ? "text-bgprimaryhover"
                        : "text-gray-500"
                    }`}>
                    {/* Circle */}
                    <div
                      className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                        step >= stepIndex
                          ? "bg-green-500 text-white"
                          : "bg-gray-300"
                      }`}>
                      {index + 1}
                    </div>
                    {/* Label */}
                    <div className="mt-2 text-xs">{label}</div>

                    {/* Connecting Line */}
                    {stepIndex < 3 && (
                      <div
                        className={`absolute top-1/2 -z-10 h-px w-full transform -translate-y-1/2 ${
                          step > stepIndex ? "bg-green-500" : "bg-gray-300"
                        }`}
                        style={{
                          left: `${(100 / (stepIndex + 1)) * (stepIndex + 1)}%`,
                          right: `${
                            100 - (100 / stepIndex) * (stepIndex + 2)
                          }%`, // Adjusted based on the number of steps
                        }}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <ValidationComponent>
            <div className="bg-white pb-4 container rounded-3xl max-h-[80vh] overflow-x-auto">
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
          </ValidationComponent>
        </div>
        {/* <div className="form-navigation flex justify-between mt-6">
          {step > 0 && (
            <Button
              onPress={handleBack}
              className="px-4 py-2 bg-gray-300 rounded">
              Back
            </Button>
          )}
          {step < 4 && (
            <Button
              onPress={() => {
                handleNext();
              }}
              className="px-4 py-2 bg-bgprimary text-white rounded">
              Next
            </Button>
          )}
        </div> */}
      </div>
    </>
  );
};

export default Ekye;
