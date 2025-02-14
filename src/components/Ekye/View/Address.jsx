import { Divider, Form } from "@nextui-org/react";
import { FaDiamond } from "react-icons/fa6";
import EkyeDetailsComponent from "../../EkyeDetailsComponent";

const EkyeAdreess = ({ employeeData }) => {
  const addresses = employeeData?.addresses || [];

  const permanentAddress =
    addresses.find((item) => item?.addressType === "PERMANENT") || {};
  const temporaryAddress =
    addresses.find((item) => item?.addressType === "TEMPORARY") || {};
  return (
    <div>
      <div className="flex flex-col items-center justify-center rounded-md space-y-3 ">
        <div className="bg-white text-lg w-full p-6 rounded-xl">
          <div className="flex justify-between items-center">
            <h1 className="py-2 text-left text-xl font-semibold font-Poppins flex underline underline-offset-4 decoration-red-500 px-6">
              <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
              Permanent Address Details
            </h1>
            <div className="flex gap-1 items-end justify-end text-right">
              <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
              <div className="flex w-2 h-2 rounded-full bg-black"></div>
              <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>
          {/**Permanent Address */}
          <Form className="space-y-4 w-full p-6">
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
          </Form>
        </div>
        <div className="bg-white text-lg w-full p-6 rounded-xl">
          <div className="flex justify-between items-center">
            <h1 className="py-2 text-left text-xl font-semibold flex underline underline-offset-4 decoration-red-500 px-8">
              <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
              Temporary Address Details
            </h1>
            <div className="flex justify-center items-center gap-4">
              <div className="flex gap-1 items-end justify-end text-right">
                <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
                <div className="flex w-2 h-2 rounded-full bg-black"></div>
                <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
              </div>
            </div>
          </div>
          <Form className="space-y-4 w-full p-6">
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
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EkyeAdreess;
