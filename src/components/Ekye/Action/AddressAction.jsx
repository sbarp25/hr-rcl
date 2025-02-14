import { Divider, Form } from "@nextui-org/react";
import { FaDiamond } from "react-icons/fa6";
import EkyeDetailsComponent from "../../EkyeDetailsComponent";

const AddressAction = ({ employeeData }) => {
  const addresses = employeeData?.addresses || [];

  const permanentAddress =
    addresses.find((item) => item.addressType === "PERMANENT") || {};
  const temporaryAddress =
    addresses.find((item) => item.addressType === "TEMPORARY") || {};

  return (
    <div className="relative flex flex-col bg-white mt-16 border-2 rounded-md shadow-lg p-8">
      {/* Header Section */}
      <div className="absolute bg-black w-auto rounded-t-2xl -top-12 left-1 px-6 py-2">
        <h1 className="text-2xl font-bold text-white">Address Detail</h1>
      </div>

      {/* Address Form */}
      <Form className="grid grid-cols-1 gap-12">
        {/* Permanent Address Section */}
        <div className="bg-white text-lg px-6 rounded-lg">
          <h1 className="text-xl font-semibold flex underline underline-offset-4 decoration-red-500 mb-6">
            <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-2" />
            Permanent Address Details
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
        <div className="bg-white text-lg px-6 rounded-lg">
          <h1 className="text-xl font-semibold flex underline underline-offset-4 decoration-red-500 mb-6">
            <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-2" />
            Temporary Address Details
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
