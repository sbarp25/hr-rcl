import { useEffect, useState } from "react";
import { IoIosPeople } from "react-icons/io";
import DocumentDetails from "../../components/DocumentDetails";
import AddressDetails from "../../components/AddressDetails";
import EducationDetails from "../../components/EducationDetails.jsx";
import PersonalDetails from "../../components/PersonalDetails.jsx";
import Loader from "../../components/Loader.jsx";
import ValidationComponent from "../../components/ValidationComponent.jsx";
import After from "../../assets/svgs/After.svg";
import Before from "../../assets/svgs/Before.svg";
import { Button } from "@nextui-org/react";
import FormStepper from "../../components/FormStepIndicator.jsx";

const Ekye = () => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      email: "",
      dob: "",
      gender: "",
      married: "",
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

    education: [],
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

  const getValidationSchema = (step) => {
    switch (step) {
      case 1:
        return step1Schema;
      case 2:
        return step2Schema;
      case 3:
        return step3Schema;
      default:
        return step1Schema;
    }
  };

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

  useEffect(() => {
    const ekeyStep = localStorage.getItem("ekeyStep");
    switch (ekeyStep) {
      case "Personal_Details":
        setStep(0);
        break;
      case "Address_Details":
        setStep(1);
        break;
      case "Document_Details":
        setStep(2);
        break;
      case "Education_Details":
        setStep(3);
        break;
      default:
        setStep(0);
    }
  }, []);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const steps = [
    "Personal Info",
    "Address Details",
    "Document Details",
    "Educational Details",
  ];
  return (
    <>
      {isLoading && <Loader />}
      <div className="min-h-screen overflow-y-auto bg-gray-200 p-4">
        {/* <a href="/">GO home</a> */}
        {/* Header */}
        <div className="page-title flex flex-col sm:flex-row justify-center items-center gap-2 text-center sm:text-left mb-4">
          <IoIosPeople className="text-3xl" />
          <p className="text-lg font-semibold">Perform EKYE</p>
        </div>

        {/* Stepper */}
        <FormStepper steps={steps} currentStep={step} />

        {/* Form Container */}
        <ValidationComponent>
          <div className="bg-white p-4 sm:p-6 rounded-2xl w-full max-w-[95vw] sm:max-w-[85vw] mx-auto border border-gray-300 overflow-x-auto max-h-[80vh]">
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

        {/* Navigation Buttons */}
        <div className="form-navigation flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          {step > 0 && (
            <Button
              onPress={handleBack}
              className="px-4 py-2 bg-gray-300 text-black rounded">
              Back
            </Button>
          )}
          {step < 3 && (
            <Button
              onPress={handleNext}
              className="px-4 py-2 bg-bgprimary text-white rounded">
              Next
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Ekye;
