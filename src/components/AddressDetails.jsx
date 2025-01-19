import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios-Instance";
import { Button, Input, Select, SelectItem, Checkbox } from "@nextui-org/react";
import ValidationComponent from "./ValidationComponent";
import Loader from "./Loader";
import Inputcomp from "./Inputcomp";

const AddressDetails = ({
  formData,
  handleChange,
  handleNestedChange,
  handleNext,
  handleBack,
  setFormData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  //Fetch provience data
  useEffect(() => {
    // Fetch Province Data
    const fetchProvinces = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/v1/province/get/all");
        if (response.data.responseCode === "200") {
          setProvinces(response.data.datalist);
        }
      } catch (error) {
        console.error("Failed to fetch Province Data.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  //Get Address Data
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const fetchAddressDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/v1/address/getById", {
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

          setFormData((prev) => ({
            ...prev,
            address: {
              permanent: {
                provinceId: permanentAddress?.provinceId || "",
                districtId: permanentAddress?.districtId || "",
                municipality: permanentAddress?.municipality || "",
                wardNumber: permanentAddress?.wardNumber || "",
                pinCode: permanentAddress?.pinCode || "",
                tole: permanentAddress?.tole || "",
              },
              temporary: {
                provinceId: temporaryAddress?.provinceId || "",
                districtId: temporaryAddress?.districtId || "",
                municipality: temporaryAddress?.municipality || "",
                wardNumber: temporaryAddress?.wardNumber || "",
                pinCode: temporaryAddress?.pinCode || "",
                tole: temporaryAddress?.tole || "",
              },
              sameAsPermanent: false,
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
    fetchAddressDetails();
  }, []);

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
  const fetchDistrictsByProvince = async (provinceId) => {
    if (!provinceId) return;

    setIsLoading(true);
    try {
      const sanitizedProvinceId = provinceId.replace(/[^0-9]/g, "");
      const response = await axiosInstance.get(
        `/api/v1/district/districts/${sanitizedProvinceId}`
      );
      if (response.data.responseCode === "200") {
        setDistricts(response.data.datalist);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch District Data.", error);
      toast.error("Failed to fetch District Data.", error);
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmit = async () => {
    setIsLoading(true);
    const sanitizedProvinceId = formData.address.permanent.provinceId.replace(
      /[^0-9]/g,
      ""
    );
    const sanitizedTemporaryProvinceId =
      formData.address.temporary.provinceId.replace(/[^0-9]/g, "");
    const sanitizedDistrictId = formData.address.permanent.districtId.replace(
      /[^0-9]/g,
      ""
    );
    const sanitizedtemporaryDistrictId =
      formData.address.temporary.districtId.replace(/[^0-9]/g, "");
    const newData = {
      data: [
        {
          provinceId: sanitizedProvinceId,
          districtId: sanitizedDistrictId,
          municipality: formData.address.permanent.municipality,
          wardNumber: formData.address.permanent.wardNumber,
          pinCode: formData.address.permanent.pinCode,
          tole: formData.address.permanent.tole,
          addressType: "PERMANENT",
        },
        {
          provinceId: sanitizedTemporaryProvinceId,
          districtId: sanitizedtemporaryDistrictId,
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
        "/api/v1/address/save",
        newData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data.responseCode === "201") {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to save address data", error);
      console.error("Error saving address data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlenextsubmit = () => {
    onSubmit();
    handleNext();
  };

  return (
    <>
      {/* {isLoading && <Loader />} */}
      <ValidationComponent>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">
            Address Details
          </h2>
          <form className="w-full">
            {/* Permanent Address */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-600">
                Permanent Address
              </h3>

              <div className="grid grid-cols-2 gap-4  ">
                {/* NextUI Dropdown for Province */}

                <Select
                  scrollShadowProps={{
                    isEnabled: true, // Enable the scroll shadow
                  }}
                  variant="bordered"
                  className="w-full rounded-lg shadow-lg shadow-gray-300"
                  label="Select A Province"
                  items={formData.address?.permanent?.provinceId}
                  selectedKeys={
                    new Set([String(formData.address?.permanent?.provinceId)])
                  }
                  onSelectionChange={(keys) => {
                    const provinceId = Array.from(keys)[0]; // Extract the first value from the Set
                    handleNestedChange(
                      "address",
                      "permanent",
                      "provinceId",
                      provinceId
                    );

                    fetchDistrictsByProvince(provinceId);
                  }}>
                  {provinces.map((province) => (
                    <SelectItem key={province.id} value={province.id}>
                      {province.name}
                    </SelectItem>
                  ))}
                </Select>

                {/* NextUI Dropdown for District */}

                <Select
                  scrollShadowProps={{
                    isEnabled: true, // Enable the scroll shadow
                  }}
                  className="rounded-lg shadow-lg shadow-gray-300"
                  variant="bordered"
                  label="Select A District"
                  selectedKeys={[formData.address?.permanent?.districtId]}
                  onChange={(value) => {
                    const districtId = Array.from(value)[0];
                    handleNestedChange(
                      "address",
                      "permanent",
                      "districtId",
                      districtId
                    );
                  }}>
                  {districts.map((district) => (
                    <SelectItem key={district.districtId} value={district.name}>
                      {district.name}
                    </SelectItem>
                  ))}
                </Select>

                {/* Other Address Fields */}
                <Inputcomp
                  id=""
                  variant="bordered"
                  type="text"
                  label="Municipality"
                  value={formData.address?.permanent?.municipality}
                  onChange={(e) =>
                    handleNestedChange(
                      "address",
                      "permanent",
                      "municipality",
                      e.target.value
                    )
                  }
                />
                <Inputcomp
                  value={formData.address?.permanent?.wardNumber}
                  onChange={(e) =>
                    handleNestedChange(
                      "address",
                      "permanent",
                      "wardNumber",
                      e.target.value
                    )
                  }
                  label="Ward No"
                  variant="bordered"
                  type="text"
                  id="ward"
                />
                <Inputcomp
                  value={formData.address?.permanent?.pinCode}
                  onChange={(e) =>
                    handleNestedChange(
                      "address",
                      "permanent",
                      "pinCode",
                      e.target.value
                    )
                  }
                  label="Pin Code"
                  variant="bordered"
                  type="text"
                  id="pincode"
                />

                <Inputcomp
                  variant="bordered"
                  type="text"
                  label="Tole/Area"
                  value={formData.address?.permanent?.tole}
                  onChange={(e) =>
                    handleNestedChange(
                      "address",
                      "permanent",
                      "tole",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* Temporary Address */}
            <div className="space-y-4">
              <div className="flex justify-start gap-x-4 my-4 ">
                <h3 className="text-xl font-semibold text-gray-600">
                  Temporary Address
                </h3>
                <Checkbox
                  isSelected={formData.address?.sameAsPermanent}
                  onChange={(e) => handleSameAsPermanent(e)}>
                  Same as Permanent Address
                </Checkbox>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* NextUI Dropdown for Temporary Province */}
                <Select
                  scrollShadowProps={{
                    isEnabled: true, // Enable the scroll shadow
                  }}
                  variant="bordered"
                  className="w-full rounded-lg shadow-lg shadow-gray-300"
                  label="Select A Province"
                  selectedKeys={[formData.address?.temporary?.provinceId]}
                  onSelectionChange={(keys) => {
                    const provinceId = Array.from(keys)[0]; // Extract the first value from the Set
                    handleNestedChange(
                      "address",
                      "temporary",
                      "provinceId",
                      provinceId
                    );

                    // Fetch districts for the selected province
                    fetchDistrictsByProvince(provinceId);
                  }}>
                  {provinces.map((province) => (
                    <SelectItem key={province.id} value={province.id}>
                      {province.name}
                    </SelectItem>
                  ))}
                </Select>
                {/* NextUI Dropdown for Temporary District */}
                <Select
                  scrollShadowProps={{
                    isEnabled: true, // Enable the scroll shadow
                  }}
                  variant="bordered"
                  className=" rounded-lg shadow-lg shadow-gray-300"
                  label="Select A District"
                  selectedKeys={[formData.address?.temporary?.districtId]}
                  onSelectionChange={(value) => {
                    const districtId = Array.from(value)[0];
                    handleNestedChange(
                      "address",
                      "temporary",
                      "districtId",
                      districtId
                    );
                  }}>
                  {districts.map((district) => (
                    <SelectItem
                      key={district.districtId}
                      value={district.districtId}>
                      {district.name}
                    </SelectItem>
                  ))}
                </Select>

                {/* Additional Fields */}
                <Inputcomp
                  variant="bordered"
                  type="text"
                  label="Municipality"
                  value={formData.address?.temporary?.municipality}
                  onChange={(e) =>
                    handleNestedChange(
                      "address",
                      "temporary",
                      "municipality",
                      e.target.value
                    )
                  }
                />
                <Inputcomp
                  id="ward"
                  variant="bordered"
                  type="text"
                  label="Ward No."
                  value={formData.address?.temporary?.wardNumber}
                  onChange={(e) =>
                    handleNestedChange(
                      "address",
                      "temporary",
                      "wardNumber",
                      e.target.value
                    )
                  }
                />
                <Inputcomp
                  id="pincode"
                  variant="bordered"
                  type="text"
                  label="pinCode"
                  value={formData.address?.temporary?.pinCode}
                  onChange={(e) =>
                    handleNestedChange(
                      "address",
                      "temporary",
                      "pinCode",
                      e.target.value
                    )
                  }
                />

                <Inputcomp
                  variant="bordered"
                  type="text"
                  label="Tole/Area"
                  value={formData.address?.temporary?.tole}
                  onChange={(e) =>
                    handleNestedChange(
                      "address",
                      "temporary",
                      "tole",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-navigation flex justify-between mt-6">
                <Button
                  onPress={handleBack}
                  className="px-4 py-2 bg-gray-300 rounded">
                  Back
                </Button>
                <button
                  onClick={handlenextsubmit}
                  className="px-4 py-2 bg-green-500 text-white rounded">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </ValidationComponent>
    </>
  );
};

export default AddressDetails;
