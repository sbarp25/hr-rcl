import { useState } from "react";
import { IoIosPeople } from "react-icons/io";
import PersonalInformation from "../../components/PersonalInformation";
import DocumentDetails from "../../components/DocumentDetails";
import AddressDetails from "../../components/AddressDetails";
import EducationDetails from "../../components/EducationDetails.jsx";
const Ekye = () => {
  const [step, setStep] = useState(1);
  const handleStepClick = (step) => {
    setStep(step);
  };
  return (
    <div className="container">
      {" "}
      <div className="page-title">
        <IoIosPeople className="text-4xl" />
        <p className="mt-1 ">PerForm EKYE</p>
      </div>
      <div className="bg-white  rounded-md mt-8 ">
        <form className="">
          {" "}
          <div className="mb-4 flex justify-between items-center">
            <div
              onClick={() => handleStepClick(1)}
              className={`flex-1 text-center relative cursor-pointer ${
                step >= 1 ? "text-green-500" : "text-gray-500"
              }`}>
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-green-500 text-white" : "bg-gray-300"
                }`}>
                1
              </div>
              <div className="mt-2 text-xs">Personal Info</div>
            </div>
            <div
              onClick={() => handleStepClick(2)}
              className={`flex-1 text-center relative cursor-pointer ${
                step >= 2 ? "text-green-500" : "text-gray-500"
              }`}>
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-green-500 text-white" : "bg-gray-300"
                }`}>
                2
              </div>
              <div className="mt-2 text-xs">Documents Details</div>
            </div>
            <div
              onClick={() => handleStepClick(3)}
              className={`flex-1 text-center relative cursor-pointer ${
                step >= 3 ? "text-green-500" : "text-gray-500"
              }`}>
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                  step >= 3 ? "bg-green-500 text-white" : "bg-gray-300"
                }`}>
                3
              </div>
              <div className="mt-2 text-xs">Address Details</div>
            </div>

            <div
              onClick={() => handleStepClick(4)}
              className={`flex-1 text-center ${
                step === 4 ? "text-green-500" : "text-gray-500"
              } cursor-pointer`}>
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                  step === 4 ? "bg-green-500 text-white" : "bg-gray-300"
                }`}>
                4
              </div>
              <div className="mt-2 text-xs">Educational Details</div>
            </div>
          </div>
          {step === 1 && <PersonalInformation />}
          {step === 2 && <DocumentDetails />}
          {step === 3 && <AddressDetails />}
          {step === 4 && <EducationDetails />}
        </form>
      </div>
    </div>
  );
};

export default Ekye;
