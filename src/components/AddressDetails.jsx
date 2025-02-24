import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import axiosInstance from "../lib/axios-Instance";
import { Button, Input, Select, SelectItem, Checkbox } from "@nextui-org/react";
import ValidationComponent from "./ValidationComponent";
import InputComponent from "./InputComponent";

const AddressDetails = ({ handleNext, handleBack, setFormData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [touched, setTouched] = useState({});

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
        toast.error("Failed to fetch provinces");
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

    // First update the form data
    if (isChecked) {
      // Update temporary address with permanent address data
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          temporary: { ...prev.address.permanent },
          sameAsPermanent: true,
        },
      }));
    } else {
      // Reset temporary address
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
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
      }));
    }

    // Clear any existing errors for temporary address fields
    setErrors((prev) => {
      const newErrors = { ...prev };
      const temporaryFields = [
        "temporaryProvinceId",
        "temporaryDistrictId",
        "temporaryMunicipality",
        "temporaryWardNumber",
        "temporaryPinCode",
        "temporaryTole",
      ];

      temporaryFields.forEach((field) => {
        delete newErrors[field];
      });

      return newErrors;
    });

    // Reset touched state for temporary fields
    setTouched((prev) => {
      const newTouched = { ...prev };
      const temporaryFields = [
        "temporaryProvinceId",
        "temporaryDistrictId",
        "temporaryMunicipality",
        "temporaryWardNumber",
        "temporaryPinCode",
        "temporaryTole",
      ];

      temporaryFields.forEach((field) => {
        delete newTouched[field];
      });

      return newTouched;
    });
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
        if (addressType === "permanent") {
          setDistricts(response.data.datalist);
          // If same as permanent is checked, update temporary districts too
          if (watchSameAsPermanent) {
            setTemporaryDistricts(response.data.datalist);
          }
        } else {
          setTemporaryDistricts(response.data.datalist);
        }
      }
    } catch (error) {
      console.error("Failed to fetch District Data.", error);
      toast.error("Failed to fetch District Data.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateField = (field, value, addressType = "permanent") => {
    if (
      !value &&
      (!formData.address.sameAsPermanent || addressType === "permanent")
    ) {
      return `${addressType.charAt(0).toUpperCase() + addressType.slice(1)} ${
        field.charAt(0).toUpperCase() + field.slice(1)
      } is Required`;
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};

    const permanentFields = {
      provinceId: formData.address.permanent.provinceId,
      districtId: formData.address.permanent.districtId,
      municipality: formData.address.permanent.municipality,
      wardNumber: formData.address.permanent.wardNumber,
      pinCode: formData.address.permanent.pinCode,
      tole: formData.address.permanent.tole,
    };

    Object.entries(permanentFields).forEach(([field, value]) => {
      const error = validateField(field, value, "permanent");
      if (error)
        newErrors[
          `permanent${field.charAt(0).toUpperCase() + field.slice(1)}`
        ] = error;
    });

    if (!formData.address.sameAsPermanent) {
      const temporaryFields = {
        provinceId: formData.address.temporary.provinceId,
        districtId: formData.address.temporary.districtId,
        municipality: formData.address.temporary.municipality,
        wardNumber: formData.address.temporary.wardNumber,
        pinCode: formData.address.temporary.pinCode,
        tole: formData.address.temporary.tole,
      };

      Object.entries(temporaryFields).forEach(([field, value]) => {
        const error = validateField(field, value, "temporary");
        if (error)
          newErrors[
            `temporary${field.charAt(0).toUpperCase() + field.slice(1)}`
          ] = error;
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldBlur = (field, addressType) => {
    setTouched((prev) => ({
      ...prev,
      [`${addressType}${field.charAt(0).toUpperCase() + field.slice(1)}`]: true,
    }));
    validateForm();
  };

  const handleNestedChangeWithValidation = (
    section,
    subsection,
    field,
    value
  ) => {
    handleNestedChange(section, subsection, field, value);
    if (
      touched[`${subsection}${field.charAt(0).toUpperCase() + field.slice(1)}`]
    ) {
      setTimeout(() => validateForm(), 0);
    }
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
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
            provinceId: data.address.permanent.provinceId.replace(
              /[^0-9]/g,
              ""
            ),
            districtId: data.address.permanent.districtId.replace(
              /[^0-9]/g,
              ""
            ),
            municipality: data.address.permanent.municipality,
            wardNumber: data.address.permanent.wardNumber,
            pinCode: data.address.permanent.pinCode,
            tole: data.address.permanent.tole,
            addressType: "PERMANENT",
          },
          {
            provinceId: data.address.temporary.provinceId.replace(
              /[^0-9]/g,
              ""
            ),
            districtId: data.address.temporary.districtId.replace(
              /[^0-9]/g,
              ""
            ),
            municipality: data.address.temporary.municipality,
            wardNumber: data.address.temporary.wardNumber,
            pinCode: data.address.temporary.pinCode,
            tole: data.address.temporary.tole,
            addressType: "TEMPORARY",
            isSameAsPermanent: data.address.sameAsPermanent,
          },
        ],
      };

      const response = await axiosInstance.post(
        "/api/v1/address/save",
        sanitizedData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response?.data?.responseCode === "201") {
        toast.success(response?.data?.message);
        setFormData((prev) => ({
          ...prev,
          address: data.address,
        }));
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = [
      "provinceId",
      "districtId",
      "municipality",
      "wardNumber",
      "pinCode",
      "tole",
    ];
    const newTouched = {};
    allFields.forEach((field) => {
      newTouched[
        `permanent${field.charAt(0).toUpperCase() + field.slice(1)}`
      ] = true;
      newTouched[
        `temporary${field.charAt(0).toUpperCase() + field.slice(1)}`
      ] = true;
    });
    setTouched(newTouched);

    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <>
      <ValidationComponent>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 py-3">
            Address Details
          </h2>
          <form className="w-full">
            {/* Permanent Address */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-600">
                Permanent Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Province Select */}
                <div>
                  <Select
                    variant="bordered"
                    scrollShadowProps={{
                      isEnabled: true,
                    }}
                    className={`w-full rounded-xl ${
                      errors.permanentProvinceId
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                    label="Select A Province"
                    items={formData.address?.permanent?.provinceId}
                    placeholder={formData.address?.permanent?.provinceName}
                    onSelectionChange={(keys) => {
                      const provinceId = Array.from(keys)[0];
                      handleNestedChangeWithValidation(
                        "address",
                        "permanent",
                        "provinceId",
                        provinceId
                      );
                      setDistricts([]);
                      handleNestedChangeWithValidation(
                        "address",
                        "permanent",
                        "districtId",
                        ""
                      );
                      fetchDistrictsByProvince(provinceId);
                    }}
                    onBlur={() => handleFieldBlur("provinceId", "permanent")}>
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

                {/* District Select */}
                <div>
                  <Select
                    variant="bordered"
                    scrollShadowProps={{
                      isEnabled: true,
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
                      handleNestedChangeWithValidation(
                        "address",
                        "permanent",
                        "districtId",
                        districtId
                      );
                    }}
                    onBlur={() => handleFieldBlur("districtId", "permanent")}>
                    {districts.map((district) => (
                      <SelectItem
                        key={district.districtId}
                        textValue={district.name}>
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

                {/* Municipality */}
                <div>
                  <Input
                    variant="bordered"
                    className={`w-full rounded-xl ${
                      errors.permanentMunicipality
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                    type="text"
                    label="Municipality"
                    value={formData.address?.permanent?.municipality}
                    onChange={(e) =>
                      handleNestedChangeWithValidation(
                        "address",
                        "permanent",
                        "municipality",
                        e.target.value
                      )
                    }
                    onBlur={() => handleFieldBlur("municipality", "permanent")}
                  />
                  {errors.permanentMunicipality && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.permanentMunicipality}
                    </p>
                  )}
                </div>

                {/* Ward Number */}
                <div>
                  <Input
                    variant="bordered"
                    value={formData.address?.permanent?.wardNumber}
                    onChange={(e) =>
                      handleNestedChangeWithValidation(
                        "address",
                        "permanent",
                        "wardNumber",
                        e.target.value
                      )
                    }
                    onBlur={() => handleFieldBlur("wardNumber", "permanent")}
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

                {/* Pin Code */}
                <div>
                  <Input
                    variant="bordered"
                    value={formData.address?.permanent?.pinCode}
                    onChange={(e) =>
                      handleNestedChangeWithValidation(
                        "address",
                        "permanent",
                        "pinCode",
                        e.target.value
                      )
                    }
                    onBlur={() => handleFieldBlur("pinCode", "permanent")}
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

                {/* Tole/Area */}
                <div>
                  <Input
                    variant="bordered"
                    className={`w-full rounded-xl ${
                      errors.permanentTole ? "border-2 border-red-500" : ""
                    }`}
                    type="text"
                    label="Tole/Area"
                    value={formData.address?.permanent?.tole}
                    onChange={(e) =>
                      handleNestedChangeWithValidation(
                        "address",
                        "permanent",
                        "tole",
                        e.target.value
                      )
                    }
                    onBlur={() => handleFieldBlur("tole", "permanent")}
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
              <div className="flex flex-col justify-start gap-x-4 my-4">
                <h3 className="text-xl font-semibold text-gray-600">
                  Temporary Address
                </h3>
                <Checkbox
                  isSelected={formData.address?.sameAsPermanent}
                  onChange={handleSameAsPermanent}>
                  Same as Permanent Address
                </Checkbox>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Temporary Province Select */}
                <div>
                  <Select
                    variant="bordered"
                    scrollShadowProps={{
                      isEnabled: true,
                    }}
                    className={`w-full rounded-xl ${
                      errors.temporaryProvinceId
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                    label="Select A Province"
                    placeholder={formData.address?.temporary?.provinceName}
                    selectedKeys={[formData.address?.temporary?.provinceId]}
                    onSelectionChange={(keys) => {
                      const provinceId = Array.from(keys)[0];
                      handleNestedChangeWithValidation(
                        "address",
                        "temporary",
                        "provinceId",
                        provinceId
                      );
                      fetchDistrictsByProvince(provinceId);
                    }}
                    onBlur={() => handleFieldBlur("provinceId", "temporary")}
                    isDisabled={formData.address?.sameAsPermanent}>
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

                {/* Temporary District Select */}
                <div>
                  <Select
                    variant="bordered"
                    scrollShadowProps={{
                      isEnabled: true,
                    }}
                    className={`w-full rounded-xl ${
                      errors.temporaryDistrictId
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                    label="Select A District"
                    selectedKeys={[formData.address?.temporary?.districtId]}
                    placeholder={formData.address?.temporary?.districtId}
                    onSelectionChange={(value) => {
                      const districtId = Array.from(value)[0];
                      handleNestedChangeWithValidation(
                        "address",
                        "temporary",
                        "districtId",
                        districtId
                      );
                    }}
                    onBlur={() => handleFieldBlur("districtId", "temporary")}
                    isDisabled={formData.address?.sameAsPermanent}>
                    {districts.map((district) => (
                      <SelectItem
                        key={district.districtId}
                        textValue={district.name}>
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

                {/* Temporary Municipality */}
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
                      handleNestedChangeWithValidation(
                        "address",
                        "temporary",
                        "municipality",
                        e.target.value
                      )
                    }
                    onBlur={() => handleFieldBlur("municipality", "temporary")}
                    isDisabled={formData.address?.sameAsPermanent}
                  />
                  {errors.temporaryMunicipality && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.temporaryMunicipality}
                    </p>
                  )}
                </div>

                {/* Temporary Ward Number */}
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
                      handleNestedChangeWithValidation(
                        "address",
                        "temporary",
                        "wardNumber",
                        e.target.value
                      )
                    }
                    onBlur={() => handleFieldBlur("wardNumber", "temporary")}
                    isDisabled={formData.address?.sameAsPermanent}
                  />
                  {errors.temporaryWardNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.temporaryWardNumber}
                    </p>
                  )}
                </div>

                {/* Temporary Pin Code */}
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
                      handleNestedChangeWithValidation(
                        "address",
                        "temporary",
                        "pinCode",
                        e.target.value
                      )
                    }
                    onBlur={() => handleFieldBlur("pinCode", "temporary")}
                    isDisabled={formData.address?.sameAsPermanent}
                  />
                  {errors.temporaryPinCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.temporaryPinCode}
                    </p>
                  )}
                </div>

                {/* Temporary Tole/Area */}
                <div>
                  <Input
                    variant="bordered"
                    className={`w-full rounded-xl ${
                      errors.temporaryTole ? "border-2 border-red-500" : ""
                    }`}
                    type="text"
                    label="Tole/Area"
                    value={formData.address?.temporary?.tole}
                    onChange={(e) =>
                      handleNestedChangeWithValidation(
                        "address",
                        "temporary",
                        "tole",
                        e.target.value
                      )
                    }
                    onBlur={() => handleFieldBlur("tole", "temporary")}
                    isDisabled={formData.address?.sameAsPermanent}
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
                  className="px-4 py-2 bg-gray-300 rounded">
                  Back
                </Button>
                <button
                  onClick={handleSubmit}
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
