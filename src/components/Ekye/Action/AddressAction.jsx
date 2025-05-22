import { Divider, Form } from "@nextui-org/react";
import EkyeDetailsComponent from "../../ui/EkyeDetailsComponent.jsx";
import Underlinecomponent from "../../ui/UnderlineComponent.jsx";

const AddressAction = ({ employeeData }) => {
  const addresses = employeeData?.addresses || [];

  const permanentAddress =
    addresses.find((item) => item.addressType === "PERMANENT") || {};
  const temporaryAddress =
    addresses.find((item) => item.addressType === "TEMPORARY") || {};

  return (
    <div className="relative flex flex-col bg-white mt-16 border border-black rounded-b-lg shadow-lg px-8 py-4">
      {/* Header Section */}
      <div className="absolute bg-black w-auto rounded-t-2xl -top-12 -left-0.5 px-6 py-2">
        <h1 className="text-2xl font-semibold text-white">Address Details</h1>
      </div>

      {/* Address Form */}
      <Form className="grid grid-cols-1 gap-12">
        {/* Permanent Address Section */}
        <div className="bg-white text-lg px-6 rounded-lg ">
          <h1 className="relative text-xl font-semibold flex items-center mb-6 pb-2">
            <span className="relative">
              Permanent Address Details
              <Underlinecomponent />
            </span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 mb-6">
            <EkyeDetailsComponent
              label="Province"
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
          <Divider className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
            <EkyeDetailsComponent
              label="Pincode"
              placeholder={permanentAddress?.pinCode || "N/A"}
            />
            <EkyeDetailsComponent
              label="Ward No"
              placeholder={permanentAddress?.wardNumber || "N/A"}
            />
            <EkyeDetailsComponent
              label="Tole/Area"
              placeholder={permanentAddress?.tole || "N/A"}
            />
          </div>
          <Divider className="mt-6" />
        </div>

        {/* Temporary Address Section */}
        <div className="bg-white text-lg px-6 rounded-lg ">
          <h1 className="text-xl font-semibold flex mb-6">
            <span className="relative">
              Temporary Address Details
              <Underlinecomponent />
            </span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 mb-6">
            <EkyeDetailsComponent
              label="Province"
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
          <Divider className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
            <EkyeDetailsComponent
              label="Pincode"
              placeholder={temporaryAddress?.pinCode || "N/A"}
            />
            <EkyeDetailsComponent
              label="Ward No"
              placeholder={temporaryAddress?.wardNumber || "N/A"}
            />
            <EkyeDetailsComponent
              label="Tole/Area"
              placeholder={temporaryAddress?.tole || "N/A"}
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddressAction;
