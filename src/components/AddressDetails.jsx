import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios-Instance";
import { Input } from "@nextui-org/react";

const AddressDetails = ({ formData, handleChange, handleNestedChange }) => {
  const provinces = [
    "Province 1",
    "Province 2",
    "Bagmati",
    "Gandaki",
    "Lumbini",
    "Karnali",
    "Sudurpashchim",
  ];
  const districts = ["District A", "District B", "District C"];
  const municipalities = ["Municipality X", "Municipality Y", "Municipality Z"];
  const handleSameAsPermanent = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      handleChange("address", "temporary", formData.address.permanent);
    } else {
      handleChange("address", "temporary", {
        province: "",
        district: "",
        municipality: "",
        ward: "",
        pincode: "",
        area: "",
      });
    }
    handleChange("address", "sameAsPermanent", isChecked);
  };
  const [isLoading, setIsLoading] = useState(false);

  // const onSubmit = async (e) => {
  //   e.prevetDefault();
  //   setIsLoading(true);
  //   const newData = {
  //     data: {
  //       permanentAddress: {
  //         province: formData.address.permanent.province,
  //         district: formData.address.permanent.district,
  //         municipality: formData.address.permanent.municipality,
  //         wardNumber: formData.address.permanent.ward,
  //         pinCode: formData.address.permanent.pincode,
  //         tole: formData.address.permanent.area,
  //       },
  //       temporaryAddress: {
  //         province: formData.address.temporary.province,
  //         district: formData.address.temporary.district,
  //         municipality: formData.address.temporary.municipality,
  //         ward: formData.address.temporary.ward,
  //         pincode: formData.address.temporary.pincode,
  //         area: formData.address.temporary.area,
  //       },
  //     },
  //   };
  //   try {
  //     const response = await axiosInstance.post(
  //       "api/user-addresses/register",
  //       newData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (response.data.responseCode === "201") {
  //       toast.success("Data added successfully!");
  //     } else {
  //       toast.error("Failed to add employee!");
  //     }
  //   } catch (error) {
  //     console.error("Error adding employee:", error);
  //     toast.error("Error adding employee.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // const handleAddress = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   const newData = {
  //     data: {
  //       uadId: "0",
  //       usersId: "0",
  //       permanentAddress: {
  //         province: formData.address.permanent.province,
  //         district: formData.address.permanent.district,
  //         municipality: formData.address.permanent.municipality,
  //         ward: formData.address.permanent.ward,
  //         pincode: formData.address.permanent.pincode,
  //         area: formData.address.permanent.area,
  //       },
  //       temporaryAddress: {
  //         province: formData.address.temporary.province,
  //         district: formData.address.temporary.district,
  //         municipality: formData.address.temporary.municipality,
  //         ward: formData.address.temporary.ward,
  //         pincode: formData.address.temporary.pincode,
  //         area: formData.address.temporary.area,
  //       },
  //     },
  //   };
  //   try {
  //     const response = await axiosInstance.post(
  //       "/user-addresses/register",
  //       newData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (response.data.responseCode === "201") {
  //       toast.success("Employee added successfully!");
  //     } else {
  //       toast.error("Failed to add employee.");
  //     }
  //   } catch (error) {
  //     console.error("Error adding employee:", error);
  //     toast.error("Error adding employee.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-700">Address Details</h2>

      {/* Permanent Address */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-600">
          Permanent Address
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <select
            className="border border-gray-300 p-2 rounded-md w-full"
            // value={formData.address.permanent.permanent}
            onChange={(e) =>
              handleNestedChange(
                "address",
                "permanent",
                "province",
                e.target.value
              )
            }>
            <option value="">Select Province</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 p-2 rounded-md w-full"
            // value={formData.address.permanent.district}
            onChange={(e) =>
              handleNestedChange(
                "address",
                "permanent",
                "district",
                e.target.value
              )
            }>
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 p-2 rounded-md w-full"
            // value={formData.address.permanent.municipality}
            onChange={(e) =>
              handleNestedChange(
                "address",
                "permanent",
                "municipality",
                e.target.value
              )
            }>
            <option value="">Select Municipality</option>
            {municipalities.map((municipality) => (
              <option key={municipality} value={municipality}>
                {municipality}
              </option>
            ))}
          </select>
          <Input
            type="text"
            placeholder="Ward No."
            // value={formData.address.permanent.ward}
            onChange={(e) =>
              handleNestedChange("address", "permanent", "ward", e.target.value)
            }
          />
          <Input
            type="text"
            placeholder="Pincode"
            // value={formData.address.permanent.pincode}
            onChange={(e) =>
              handleNestedChange(
                "address",
                "permanent",
                "pincode",
                e.target.value
              )
            }
          />
          <Input
            type="text"
            placeholder="Tole/Area"
            // value={formData.address.permanent.area}
            onChange={(e) =>
              handleNestedChange("address", "permanent", "area", e.target.value)
            }
          />
        </div>
      </div>

      {/* Temporary Address */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-600">
          Temporary Address
        </h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            // checked={formData.address.sameAsPermanent}
            onChange={handleSameAsPermanent}
          />
          <span className="text-gray-600">Same as Permanent Address</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <select
            className="border border-gray-300 p-2 rounded-md w-full"
            // value={formData.address.temporary.province}
            onChange={(e) =>
              handleNestedChange(
                "address",
                "temporary",
                "province",
                e.target.value
              )
            }>
            <option value="">Select Province</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 p-2 rounded-md w-full"
            // value={formData.address.temporary.district}
            onChange={(e) =>
              handleNestedChange(
                "address",
                "temporary",
                "district",
                e.target.value
              )
            }>
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 p-2 rounded-md w-full"
            // value={formData.address.temporary.municipality}
            onChange={(e) =>
              handleNestedChange(
                "address",
                "temporary",
                "municipality",
                e.target.value
              )
            }>
            <option value="">Select Municipality</option>
            {municipalities.map((municipality) => (
              <option key={municipality} value={municipality}>
                {municipality}
              </option>
            ))}
          </select>
          <Input
            type="text"
            placeholder="Ward No."
            // value={formData.address.temporary.ward}
            onChange={(e) =>
              handleNestedChange("address", "temporary", "ward", e.target.value)
            }
          />
          <Input
            type="text"
            placeholder="Pincode"
            // value={formData.address.temporary.pincode}
            onChange={(e) =>
              handleNestedChange(
                "address",
                "temporary",
                "pincode",
                e.target.value
              )
            }
          />
          <Input
            type="text"
            placeholder="Tole/Area"
            // value={formData.address.temporary.area}
            onChange={(e) =>
              handleNestedChange("address", "temporary", "area", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AddressDetails;
