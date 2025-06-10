import UnderlineComponent from "../../../../../../components/ui/UnderlineComponent";
import { Divider, Form } from "@heroui/react";
import EkyeDetailsComponent from "../../../../../../components/ui/EkyeDetailsComponent";

const EkyeAddress = ({ employeeData }) => {
  const userCompleteDetails =
    employeeData?.userCompleteDetailsResponseDto || {};
  const addresses = userCompleteDetails?.addresses || [];

  const permanentAddress =
    addresses.find((item) => item?.addressType === "PERMANENT") || {};
  const temporaryAddress =
    addresses.find((item) => item?.addressType === "TEMPORARY") || {};
  return (
    <div className="bg-gray-50  h-[75vh] overflow-auto  rounded-lg  px-4 py-10 border border-gray-300">
      <div className="flex flex-col items-center justify-center rounded-md space-y-8 ">
        <div className="bg-white text-lg w-full p-6 rounded-xl mx-5 ">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold flex mb-6">
              <span className="relative">
                Permanent Address Details
                <UnderlineComponent />
              </span>
            </h1>

            <div className="flex gap-1 items-end justify-end text-right">
              <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
              <div className="flex w-2 h-2 rounded-full bg-black"></div>
              <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>
          {/**Permanent Address */}
          <div className="space-y-4 w-full p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 w-full px-20">
              <EkyeDetailsComponent
                label="Provinces"
                placeholder={permanentAddress?.provinceName || "N/A"}
              />
              <EkyeDetailsComponent
                label="District"
                placeholder={permanentAddress?.districtName || "N/A"}
              />
              <EkyeDetailsComponent
                label="Municipality"
                placeholder={permanentAddress?.municipality || "N/A"}
              />
            </div>
            <Divider />
            <div className="grid grid-cols-1 md:grid-cols-3 w-full px-20">
              <EkyeDetailsComponent
                label="Ward No"
                placeholder={permanentAddress?.wardNumber || "N/A"}
              />
              <EkyeDetailsComponent
                label="Pincode"
                placeholder={permanentAddress?.pinCode || "N/A"}
              />
              <EkyeDetailsComponent
                label="Tole/Area"
                placeholder={permanentAddress?.tole || "N/A"}
              />
            </div>
            <Divider />
          </div>
        </div>
        <div className="bg-white  text-lg w-full p-6 rounded-xl ">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold flex mb-6">
              <span className="relative">
                Temporary Address Details
                <UnderlineComponent />
              </span>
            </h1>

            <div className="flex justify-center items-center gap-4">
              <div className="flex gap-1 items-end justify-end text-right">
                <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
                <div className="flex w-2 h-2 rounded-full bg-black"></div>
                <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
              </div>
            </div>
          </div>
          <fiv className="space-y-4 w-full p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-20">
              <EkyeDetailsComponent
                label="Provinces"
                placeholder={temporaryAddress?.provinceName || "N/A"}
              />
              <EkyeDetailsComponent
                label="District"
                placeholder={temporaryAddress?.districtName || "N/A"}
              />
              <EkyeDetailsComponent
                label="Municipality"
                placeholder={temporaryAddress?.municipality || "N/A"}
              />
            </div>
            <Divider />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-20">
              <EkyeDetailsComponent
                label="Ward No"
                placeholder={temporaryAddress?.wardNumber || "N/A"}
              />
              <EkyeDetailsComponent
                label="Pin code"
                placeholder={temporaryAddress?.pinCode || "N/A"}
              />
              <EkyeDetailsComponent
                label={temporaryAddress?.provinceName || "N/A"}
                placeholder={temporaryAddress?.tole || "N/A"}
              />
            </div>
          </fiv>
        </div>
      </div>
    </div>
  );
};

export default EkyeAddress;
