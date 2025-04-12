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
        setStep(0); // Default to the first step if no match is found
    }
  }, []);

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

  // const navigate = useNavigate();
  // const hasaccess = false;

  // useEffect(() => {
  //   if (!hasaccess) {
  //     navigate("/login");
  //   }
  // }, []);

  return (
    <>
      {isLoading && <Loader />}
      <div className=" h-screen overflow-auto bg-gray-200 pb-1">
        <div className="page-title justify-center items-center p-3">
          <IoIosPeople className="text-3xl" />
          <p className="">Perform EKYE</p>
        </div>
        <div>
          <div className="rounded-md  relative">
            <div className="mb-2 flex items-center justify-between relative">
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
                    className={`flex-1 flex flex-col items-center relative cursor-pointer ${
                      step >= stepIndex ? "text-white" : "text-bgprimaryhover"
                    }`}>
                    {/* Step Container */}
                    <div className="relative flex items-center">
                      {/* Step Image */}
                      <div className="relative">
                        <img
                          src={step >= stepIndex ? After : Before}
                          alt={
                            step >= stepIndex
                              ? "after complete"
                              : "before complete"
                          }
                          className="w-16 h-16"
                        />
                        {/* Index Number */}
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                      </div>
                      {/* Connecting Line */}
                      {stepIndex < 3 && (
                        <div
                          className={`absolute top-1/2 transform -translate-y-1/2 h-1 rounded-lg ${
                            step > stepIndex ? "bg-sky-900" : "bg-gray-300"
                          }`}
                          style={{
                            left: "90%", // Start from the end of the current step
                            width: "700%", // Start from the end of the current step
                          }}></div>
                      )}
                    </div>
                    {/* Label */}
                    <div className="mt-2 text-xs text-bgprimaryhover">
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <ValidationComponent>
            <div className="bg-white pb-4 container rounded-3xl max-h-[80vh] w-[85vw] overflow-x-auto border border-gray-300">
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
        {/* <div className="form-navigation flex justify-center gap-6 mt-6">
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
