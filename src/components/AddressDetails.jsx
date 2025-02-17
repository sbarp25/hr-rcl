import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios-Instance";
import { Button, Input, Select, SelectItem, Checkbox } from "@nextui-org/react";
import ValidationComponent from "./ValidationComponent";

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
  const [errors, setErrors] = useState({});
  const [districts, setDistricts] = useState([]);

  // Fetch Province Data
  useEffect(() => {
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

  // Get Address Data
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
            provinceName: "",
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
            provinceName: "",
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
                provinceId: permanentAddress.provinceId || "",
                provinceName: permanentAddress.provinceName || "",
                districtId: permanentAddress.districtName || "",
                municipality: permanentAddress.municipality || "",
                wardNumber: permanentAddress.wardNumber || "",
                pinCode: permanentAddress.pinCode || "",
                tole: permanentAddress.tole || "",
              },
              temporary: {
                provinceId: temporaryAddress.provinceId || "",
                provinceName: temporaryAddress.provinceName || "",
                districtId: temporaryAddress.districtName || "",
                municipality: temporaryAddress.municipality || "",
                wardNumber: temporaryAddress.wardNumber || "",
                pinCode: temporaryAddress.pinCode || "",
                tole: temporaryAddress.tole || "",
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

  const handleProvinceChange = (keys) => {
    const provinceId = Array.from(keys)[0]; // Extract the first value from the Set
    handleNestedChange("address", "permanent", "provinceId", provinceId);

    // Reset districts and districtId
    setDistricts([]);
    handleNestedChange("address", "permanent", "districtId", "");

    // Fetch districts for the selected province
    fetchDistrictsByProvince(provinceId);
  };

  const handleTemporaryProvinceChange = (keys) => {
    const provinceId = Array.from(keys)[0]; // Extract the first value from the Set
    handleNestedChange("address", "temporary", "provinceId", provinceId);

    // Reset districts and districtId
    setDistricts([]);
    handleNestedChange("address", "temporary", "districtId", "");

    // Fetch districts for the selected province
    fetchDistrictsByProvince(provinceId);
  };
  const onSubmit = async () => {
    setIsLoading(true);

    try {
      // Ensure IDs exist before calling .replace()
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

      const response = await axiosInstance.post(
        "/api/v1/address/save",
        newData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response?.data?.responseCode === "201") {
        toast.success(response?.data?.message);
        handleNext();
      } else {
        toast.error(response.data.message || "Failed to save address data");
      }
    } catch (error) {
      toast.error("Failed to save address data");
      console.error(
        "Error saving address data:",
        error?.response?.data || error
      );
    } finally {
      setIsLoading(false);
      setErrors({});
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    // Destructure permanent and temporary address fields
    const {
      provinceId: permanentProvinceId,
      districtId: permanentDistrictId,
      municipality: permanentMunicipality,
      wardNumber: permanentWardNumber,
      pinCode: permanentPinCode,
      tole: permanentTole,
    } = formData.address.permanent;

    const {
      provinceId: temporaryProvinceId,
      districtId: temporaryDistrictId,
      municipality: temporaryMunicipality,
      wardNumber: temporaryWardNumber,
      pinCode: temporaryPinCode,
      tole: temporaryTole,
      isSameAsPermanent,
    } = formData.address.temporary;

    // Validate Permanent Address
    if (!permanentProvinceId)
      newErrors.permanentProvinceId = "Permanent Province is Required";
    if (!permanentDistrictId)
      newErrors.permanentDistrictId = "Permanent District is Required";
    if (!permanentMunicipality)
      newErrors.permanentMunicipality = "Permanent Municipality is Required";
    if (!permanentWardNumber)
      newErrors.permanentWardNumber = "Permanent Ward Number is Required";
    if (!permanentPinCode)
      newErrors.permanentPinCode = "Permanent Pin Code is Required";
    if (!permanentTole) newErrors.permanentTole = "Permanent Tole is Required";

    // Validate Temporary Address ONLY if it is NOT the same as Permanent
    if (!isSameAsPermanent) {
      if (!temporaryProvinceId)
        newErrors.temporaryProvinceId = "Temporary Province is Required";
      if (!temporaryDistrictId)
        newErrors.temporaryDistrictId = "Temporary District is Required";
      if (!temporaryMunicipality)
        newErrors.temporaryMunicipality = "Temporary Municipality is Required";
      if (!temporaryWardNumber)
        newErrors.temporaryWardNumber = "Temporary Ward Number is Required";
      if (!temporaryPinCode)
        newErrors.temporaryPinCode = "Temporary Pin Code is Required";
      if (!temporaryTole)
        newErrors.temporaryTole = "Temporary Tole is Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleNextSubmit();
      console.log("submitdata");
      // handleNext();
    }
  };

  return (
    <>
      {/* {isLoading && <Loader />} */}
      <ValidationComponent>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 py-3">
            Address Details
          </h2>
          <form className="w-full">
            {/* Permanent Address */}
            <div className="space-y-4 ">
              <h3 className="text-xl font-semibold text-gray-600">
                Permanent Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  ">
                {/* NextUI Dropdown for Province */}
                <div>
                  <Select
                    variant="bordered"
                    scrollShadowProps={{
                      isEnabled: true, // Enable the scroll shadow
                    }}
                    className={`w-full   rounded-xl ${
                      errors.permanentProvinceId
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                    label="Select A Province"
                    items={formData.address?.permanent?.provinceId}
                    placeholder={formData.address?.permanent?.provinceName}
                    onSelectionChange={handleProvinceChange}
                  >
                    {provinces.map((province) => (
                      <SelectItem key={province.id} textValue={province.name}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </Select>
                  {errors.permanentProvinceId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.permanentProvinceId}
                    </p>
                  )}
                </div>

                {/* NextUI Dropdown for District */}
                <div>
                  <Select
                    variant="bordered"
                    scrollShadowProps={{
                      isEnabled: true, // Enable the scroll shadow
                    }}
                    className={`w-full rounded-xl ${
                      errors.permanentDistrictId
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                    label="Select A District"
                    selectedKeys={[formData.address?.permanent?.districtId]}
                    placeholder={formData.address?.permanent?.districtId}
                    onSelectionChange={(value) => {
                      const districtId = Array.from(value)[0];
                      handleNestedChange(
                        "address",
                        "permanent",
                        "districtId",
                        districtId
                      );
                    }}
                  >
                    {districts.map((district) => (
                      <SelectItem
                        key={district.districtId}
                        textValue={district.name}
                      >
                        {district.name}
                      </SelectItem>
                    ))}
                  </Select>
                  {errors.permanentDistrictId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.permanentDistrictId}
                    </p>
                  )}
                </div>

                {/* Municipality Fields */}
                <div>
                  <Input
                    variant="bordered"
                    id=""
                    className={`w-full rounded-xl ${
                      errors.permanentMunicipality
                        ? "border-2 border-red-500"
                        : ""
                    }`}
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
                  {errors.permanentMunicipality && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.permanentMunicipality}
                    </p>
                  )}
                </div>
                {/**Ward Number */}
                <div>
                  <Input
                    variant="bordered"
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
                    className={`w-full rounded-xl ${
                      errors.permanentWardNumber
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                    type="text"
                    id="ward"
                  />
                  {errors.permanentWardNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.permanentWardNumber}
                    </p>
                  )}
                </div>
                {/**Pin Code */}
                <div>
                  <Input
                    variant="bordered"
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
                    className={`w-full rounded-xl ${
                      errors.permanentPinCode ? "border-2 border-red-500" : ""
                    }`}
                    type="text"
                    id="pincode"
                  />
                  {errors.permanentPinCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.permanentPinCode}
                    </p>
                  )}
                </div>
                {/**Tole/Area */}
                <div>
                  <Input
                    variant="bordered"
                    className={`w-full rounded-xl ${
                      errors.permanentTole ? "  border-2 border-red-500" : ""
                    }`}
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
                  {errors.permanentTole && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.permanentTole}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Temporary Address */}
            <div className="space-y-4">
              <div className="flex flex-col justify-start gap-x-4 my-4 ">
                <h3 className="text-xl font-semibold text-gray-600">
                  Temporary Address
                </h3>
                <Checkbox
                  isSelected={formData.address?.sameAsPermanent}
                  onChange={(e) => handleSameAsPermanent(e)}
                >
                  Same as Permanent Address
                </Checkbox>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Dropdown for Temporary Province */}
                <div>
                  <Select
                    variant="bordered"
                    scrollShadowProps={{
                      isEnabled: true, // Enable the scroll shadow
                    }}
                    className={`w-full rounded-xl ${
                      errors.temporaryProvinceId
                        ? "  border-2 border-red-500"
                        : ""
                    }`}
                    label="Select A Province"
                    placeholder={formData.address?.temporary?.provinceName}
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
                    }}
                  >
                    {provinces.map((province) => (
                      <SelectItem key={province.id} textValue={province.name}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </Select>
                  {errors.temporaryProvinceId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.temporaryProvinceId}
                    </p>
                  )}
                </div>
                {/* Dropdown for Temporary District */}
                <div>
                  <Select
                    variant="bordered"
                    scrollShadowProps={{
                      isEnabled: true, // Enable the scroll shadow
                    }}
                    className={`w-full  rounded-xl ${
                      errors.temporaryDistrictId
                        ? "  border-2 border-red-500"
                        : ""
                    }`}
                    label="Select A District"
                    selectedKeys={[formData.address?.temporary?.districtId]}
                    placeholder={formData.address?.temporary?.districtId}
                    onSelectionChange={(value) => {
                      const districtId = Array.from(value)[0];
                      handleNestedChange(
                        "address",
                        "temporary",
                        "districtId",
                        districtId
                      );
                    }}
                  >
                    {districts.map((district) => (
                      <SelectItem
                        key={district.districtId}
                        textValue={district.name}
                      >
                        {district.name}
                      </SelectItem>
                    ))}
                  </Select>
                  {errors.temporaryDistrictId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.temporaryDistrictId}
                    </p>
                  )}
                </div>

                {/* Municipality Fields */}
                <div>
                  <Input
                    variant="bordered"
                    className={`w-full rounded-xl ${
                      errors.temporaryMunicipality
                        ? "border-2 border-red-500"
                        : ""
                    }`}
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
                  {errors.temporaryMunicipality && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.temporaryMunicipality}
                    </p>
                  )}
                </div>
                {/**Ward Number */}
                <div>
                  <Input
                    variant="bordered"
                    id="ward"
                    className={`w-full rounded-xl ${
                      errors.temporaryWardNumber
                        ? "border-2 border-red-500"
                        : ""
                    }`}
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
                  {errors.temporaryWardNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.temporaryWardNumber}
                    </p>
                  )}
                </div>
                {/**Pin Code */}
                <div>
                  <Input
                    variant="bordered"
                    id="pincode"
                    className={`w-full rounded-xl ${
                      errors.temporaryPinCode ? "border-2 border-red-500" : ""
                    }`}
                    type="text"
                    label="Pin Code"
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
                  {errors.temporaryPinCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.temporaryPinCode}
                    </p>
                  )}
                </div>
                {/**Tole/Area */}
                <div>
                  <Input
                    variant="bordered"
                    className={`w-full rounded-xl ${
                      errors.temporaryTole ? "  border-2 border-red-500" : ""
                    }`}
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
                  {errors.temporaryTole && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.temporaryTole}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-navigation flex justify-between mt-6">
                <Button
                  onPress={handleBack}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Back
                </Button>
                <button
                  onClick={handlesubmit}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
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
