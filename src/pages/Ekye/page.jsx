import { useState } from "react";
import { IoIosPeople } from "react-icons/io";
import PersonalInformation from "../../components/PersonalInformation";
import DocumentDetails from "../../components/DocumentDetails";
import AddressDetails from "../../components/AddressDetails";
import EducationDetails from "../../components/EducationDetails.jsx";

const Ekye = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {},
    addressDetails: {},
    documentDetails: {},
    educationDetails: {},
  });
  const [personalInfo, setPersonalInfo] = useState({});
  const handleStepClick = (step) => {
    setStep(step);
  };

  return (
    <div className="container">
      <div className="page-title">
        <IoIosPeople className="text-4xl" />
        <p className="mt-1">PerForm EKYE</p>
      </div>
      <div className="bg-white rounded-md p-2">
        <div className="mb-4 flex justify-between items-center">
          {[
            "Personal Info",
            "Address Details",
            "Document Details",
            "Educational Details",
          ].map((label, index) => {
            const stepIndex = index + 1;
            return (
              <div
                key={label}
                onClick={() => handleStepClick(stepIndex)}
                className={`flex-1 text-center relative cursor-pointer ${
                  step >= stepIndex ? "text-green-500" : "text-gray-500"
                }`}>
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                    step >= stepIndex
                      ? "bg-green-500 text-white"
                      : "bg-gray-300"
                  }`}>
                  {stepIndex}
                </div>
                <div className="mt-2 text-xs">{label}</div>
              </div>
            );
          })}
        </div>
        {step === 1 && (
          <PersonalInformation
            formData={personalInfo}
            setFormData={setPersonalInfo}
          />
        )}
        {step === 2 && (
          <AddressDetails formData={formData} setFormData={setFormData} />
        )}
        {step === 3 && (
          <DocumentDetails formData={formData} setFormData={setFormData} />
        )}
        {step === 4 && (
          <EducationDetails formData={formData} setFormData={setFormData} />
        )}
      </div>
    </div>
  );
};

export default Ekye;
