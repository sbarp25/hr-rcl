import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios-Instance";
import {
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Checkbox,
} from "@nextui-org/react";

const AddressDetails = ({
  formData,
  handleChange,
  handleNestedChange,
  handleNext,
  handleBack,
  setFormData,
}) => {
  const handleSameAsPermanent = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      handleChange("address", "temporary", formData.address.permanent);
    } else {
      handleChange("address", "temporary", {
        provinceId: "",
        districtId: "",
        municipality: "",
        wardNumber: "",
        pinCode: "",
        tole: "",
      });
    }
    handleChange("address", "sameAsPermanent", isChecked);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [filteredDistricts, setFilteredDistricts] = useState([]);

  const onSubmit = async (e) => {
    // e.prevetDefault();
    setIsLoading(true);
    const newData = {
      data: [
        {
          provinceId: formData.address.permanent.provinceId,
          districtId: formData.address.permanent.districtId,
          municipality: formData.address.permanent.municipality,
          wardNumber: formData.address.permanent.wardNumber,
          pinCode: formData.address.permanent.pinCode,
          tole: formData.address.permanent.tole,
          addressType: "PERMANENT",
        },
        {
          provinceId: formData.address.temporary.provinceId,
          districtId: formData.address.temporary.districtId,
          municipality: formData.address.temporary.municipality,
          wardNumber: formData.address.temporary.wardNumber,
          pinCode: formData.address.temporary.pinCode,
          tole: formData.address.temporary.tole,
          addressType: "TEMPORARY",
          isSameAsPermanent: formData.address.sameAsPermanent,
        },
      ],
    };

    try {
      const response = await axiosInstance.post(
        "/api/userAddresses/save",
        newData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.responseCode === "201") {
        toast.success("Data added successfully!");
      } else {
        toast.error("Failed to add employee!");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Error adding employee.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlenextsubmit = () => {
    onSubmit();
    handleNext();
  };
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const fetchAddressDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/userAddresses/address", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (response.data.responseCode === "200") {
          const dataList = response.data.datalist || [];

          // Safely extract permanent and temporary addresses
          const permanentAddress = dataList.find(
            (item) => item.addressType === "PERMANENT"
          ) || {
            provinceId: "",
            districtId: "",
            municipality: "",
            wardNumber: "",
            pinCode: "",
            tole: "",
          };

          const temporaryAddress = dataList.find(
            (item) => item.addressType === "TEMPORARY"
          ) || {
            provinceId: "",
            districtId: "",
            municipality: "",
            wardNumber: "",
            pinCode: "",
            tole: "",
          };

          // Update formData with safe defaults
          setFormData((prev) => ({
            ...prev,
            address: {
              permanent: {
                provinceId: permanentAddress.provinceId || "",
                districtId: permanentAddress.districtId || "",
                municipality: permanentAddress.municipality || "",
                wardNumber: permanentAddress.wardNumber || "",
                pinCode: permanentAddress.pinCode || "",
                tole: permanentAddress.tole || "",
              },
              temporary: {
                provinceId: temporaryAddress.provinceId || "",
                districtId: temporaryAddress.districtId || "",
                municipality: temporaryAddress.municipality || "",
                wardNumber: temporaryAddress.wardNumber || "",
                pinCode: temporaryAddress.pinCode || "",
                tole: temporaryAddress.tole || "",
              },
              sameAsPermanent: false, // Explicitly set "same as permanent"
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching address details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddressDetails();
  }, []);

  //UseEffect to get Province Data
  useEffect(() => {
    const fetchProvince = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/province");
        if (response.data.responseCode === "200") {
          setProvinces(response.data.datalist);
        } else {
          toast.error("Failed to fetch Province Data.");
        }
      } catch (error) {
        console.error("Failed to fetch Province Data.", error);
        toast.error("Failed to fetch Province Data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProvince();
  }, []);

  //UseEffect to get District Data
  useEffect(() => {
    const fetchDistrict = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/district");
        if (response.data.responseCode === "200") {
          setDistricts(response.data.datalist);
        } else {
          toast.error("Failed to fetch District Data.");
        }
      } catch (error) {
        console.error("Failed to fetch District Data.", error);
        toast.error("Failed to fetch District Data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDistrict();
  }, []);
  useEffect(() => {
    if (selectedProvince === "") {
      setFilteredDistricts(districts); // Reset to all districts if no province is selected
    } else {
      const filtered = districts.filter(
        (d) => d.provinceId === selectedProvince
      );
      setFilteredDistricts(filtered);
    }
  }, [selectedProvince, districts]);

  // Update the handleNestedChange function to update the selected province
  const handleNesteChange = (section, subSection, field, value) => {
    if (field === "province") {
      setSelectedProvince(value);
    } else if (field === "district") {
      // ... rest of your existing logic for district change...
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-700">Address Details</h2>

      {/* Permanent Address */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-600">
          Permanent Address
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* NextUI Dropdown for Province */}
          <Dropdown>
            <DropdownTrigger>
              <Input readOnly label="Select Province">
                {provinces.find(
                  (p) => p.id === formData.address.permanent.provinceId
                )?.name || "Select Province"}
              </Input>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Select Province"
              onAction={(value) =>
                handleNestedChange("address", "permanent", "provinceId", value)
              }
            >
              {provinces.map((province) => (
                <DropdownItem key={province.id} value={province.id}>
                  {province.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* NextUI Dropdown for District */}
          <Dropdown>
            <DropdownTrigger>
              <Input readOnly label="Select District">
                {filteredDistricts.find(
                  (d) => d.id === formData.address.permanent.districtId
                )?.name || "Select District"}
              </Input>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Select District"
              onAction={(value) =>
                handleNestedChange("address", "permanent", "districtId", value)
              }
            >
              {filteredDistricts.map((district) => (
                <DropdownItem key={district.id} value={district.id}>
                  {district.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Other Address Fields */}
          <Input
            type="text"
            label="Municipality"
            value={formData.address.permanent.municipality}
            onChange={(e) =>
              handleNestedChange(
                "address",
                "permanent",
                "municipality",
                e.target.value
              )
            }
          />
          <Input
            type="text"
            label="Ward No."
            value={formData.address.permanent.wardNumber}
            onChange={(e) =>
              handleNestedChange(
                "address",
                "permanent",
                "wardNumber",
                e.target.value
              )
            }
          />
          <Input
            type="text"
            label="pinCode"
            value={formData.address.permanent.pinCode}
            onChange={(e) =>
              handleNestedChange(
                "address",
                "permanent",
                "pinCode",
                e.target.value
              )
            }
          />
          <Input
            type="text"
            label="Tole/Area"
            value={formData.address.permanent.tole}
            onChange={(e) =>
              handleNestedChange("address", "permanent", "tole", e.target.value)
            }
          />
        </div>
      </div>

      {/* Temporary Address */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-600">
          Temporary Address
        </h3>
        <Checkbox
          isSelected={formData.address.sameAsPermanent}
          onChange={(e) => handleSameAsPermanent(e)}
        >
          Same as Permanent Address
        </Checkbox>
        <div className="grid grid-cols-2 gap-4">
          {/* NextUI Dropdown for Temporary Province */}
          <Dropdown>
            <DropdownTrigger>
              <Input readOnly label="Select Province">
                {provinces.find(
                  (p) => p.id === formData.address.permanent.provinceId
                )?.name || "Select Province"}
              </Input>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Select Province"
              onAction={(value) =>
                handleNestedChange("address", "temporary", "provinceId", value)
              }
            >
              {provinces.map((province) => (
                <DropdownItem key={province.id} value={province.id}>
                  {province.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* NextUI Dropdown for Temporary District */}
          <Dropdown>
            <DropdownTrigger>
              <Input readOnly label="Select District">
                {filteredDistricts.find(
                  (d) => d.id === formData.address.permanent.districtId
                )?.name || "Select District"}
              </Input>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Select District"
              onAction={(value) =>
                handleNestedChange("address", "temporary", "districtId", value)
              }
            >
              {filteredDistricts.map((district) => (
                <DropdownItem key={district.id} value={district.id}>
                  {district.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Additional Fields */}
          <Input
            type="text"
            label="Municipality"
            value={formData.address.temporary.municipality}
            onChange={(e) =>
              handleNestedChange(
                "address",
                "temporary",
                "municipality",
                e.target.value
              )
            }
          />
          <Input
            type="text"
            label="Ward No."
            value={formData.address.temporary.wardNumber}
            onChange={(e) =>
              handleNestedChange(
                "address",
                "temporary",
                "wardNumber",
                e.target.value
              )
            }
          />
          <Input
            type="text"
            label="pinCode"
            value={formData.address.temporary.pinCode}
            onChange={(e) =>
              handleNestedChange(
                "address",
                "temporary",
                "pinCode",
                e.target.value
              )
            }
          />
          <Input
            type="text"
            label="Tole/Area"
            value={formData.address.temporary.tole}
            onChange={(e) =>
              handleNestedChange("address", "temporary", "tole", e.target.value)
            }
          />
        </div>
        <div className="form-navigation flex justify-between mt-6">
          <Button
            onPress={handleBack}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Back
          </Button>
          <button
            onClick={handlenextsubmit}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressDetails;
