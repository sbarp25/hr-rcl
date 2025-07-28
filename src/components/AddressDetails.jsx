import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "../lib/axios-Instance";
import { Button, Select, SelectItem, Checkbox } from "@heroui/react";
import ValidationComponent from "./ValidationComponent";

import { useForm, Controller } from "react-hook-form";
import InputComponent from "./ui/InputComponent.jsx";
import Loader from "./Loader/Loader.jsx";

const AddressDetails = ({ formData, handleNext, handleBack, setFormData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [permanentDistrictName, setPermanentDistrictName] = useState("");
  const [temporaryDistrictName, setTemporaryDistrictName] = useState("");
  const [permanentProvinceName, setPermanentProvinceName] = useState("");
  const [temporaryProvinceName, setTemporaryProvinceName] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    clearErrors,
  } = useForm({
    defaultValues: {
      permanent: {
        provinceId: "",
        districtId: "",
        municipality: "",
        wardNumber: "",
        pinCode: "",
        tole: "",
      },
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
    mode: "onChange",
  });

  const watchedPermanent = watch("permanent");
  const watchedSameAsPermanent = watch("sameAsPermanent");

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
        const errorMessage =
          error.response?.data?.error?.errorList?.[0]?.errorMessage ||
          error.response?.data?.error;
        toast.error(errorMessage);
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
            districtName: "",
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
            districtName: "",
            municipality: "",
            wardNumber: "",
            pinCode: "",
            tole: "",
          };

          // Store district and province names
          setPermanentDistrictName(permanentAddress.districtName || "");
          setTemporaryDistrictName(temporaryAddress.districtName || "");
          setPermanentProvinceName(permanentAddress.provinceName || "");
          setTemporaryProvinceName(temporaryAddress.provinceName || "");

          // Set values in the form
          setValue("permanent.provinceId", permanentAddress.provinceId || "");
          setValue("permanent.districtId", permanentAddress.districtId || "");
          setValue(
            "permanent.municipality",
            permanentAddress.municipality || ""
          );
          setValue("permanent.wardNumber", permanentAddress.wardNumber || "");
          setValue("permanent.pinCode", permanentAddress.pinCode || "");
          setValue("permanent.tole", permanentAddress.tole || "");

          setValue("temporary.provinceId", temporaryAddress.provinceId || "");
          setValue("temporary.districtId", temporaryAddress.districtId || "");
          setValue(
            "temporary.municipality",
            temporaryAddress.municipality || ""
          );
          setValue("temporary.wardNumber", temporaryAddress.wardNumber || "");
          setValue("temporary.pinCode", temporaryAddress.pinCode || "");
          setValue("temporary.tole", temporaryAddress.tole || "");

          const isSameAsPermanent = dataList.some(
            (item) => item.addressType === "TEMPORARY" && item.isSameAsPermanent
          );

          setValue("sameAsPermanent", isSameAsPermanent);
          setSameAsPermanent(isSameAsPermanent);

          // If we have data from the API, fetch the districts for the saved province
          if (permanentAddress.provinceId) {
            fetchDistrictsByProvince(permanentAddress.provinceId);
          }

          // Also update the parent state to keep it in sync
          setFormData((prev) => ({
            ...prev,
            address: {
              permanent: {
                provinceId: permanentAddress.provinceId || "",
                provinceName: permanentAddress.provinceName || "",
                districtId: permanentAddress.districtId || "",
                districtName: permanentAddress.districtName || "",
                municipality: permanentAddress.municipality || "",
                wardNumber: permanentAddress.wardNumber || "",
                pinCode: permanentAddress.pinCode || "",
                tole: permanentAddress.tole || "",
              },
              temporary: {
                provinceId: temporaryAddress.provinceId || "",
                provinceName: temporaryAddress.provinceName || "",
                districtId: temporaryAddress.districtId || "",
                districtName: temporaryAddress.districtName || "",
                municipality: temporaryAddress.municipality || "",
                wardNumber: temporaryAddress.wardNumber || "",
                pinCode: temporaryAddress.pinCode || "",
                tole: temporaryAddress.tole || "",
              },
              sameAsPermanent: isSameAsPermanent,
            },
          }));

          // Mark data as loaded and clear any existing errors
          setDataLoaded(true);
          clearErrors();
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error?.errorList?.[0]?.errorMessage ||
          error.response?.data?.error;
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddressDetails();
  }, [setValue, setFormData, clearErrors]);

  // Sync form data changes to parent component
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      address: {
        permanent: {
          ...watchedPermanent,
          districtName: permanentDistrictName,
          provinceName: permanentProvinceName,
        },
        temporary: watchedSameAsPermanent
          ? {
              ...watchedPermanent,
              districtName: permanentDistrictName,
              provinceName: permanentProvinceName,
            }
          : {
              ...watch("temporary"),
              districtName: temporaryDistrictName,
              provinceName: temporaryProvinceName,
            },
        sameAsPermanent: watchedSameAsPermanent,
      },
    }));
  }, [
    watch,
    setFormData,
    watchedPermanent,
    watchedSameAsPermanent,
    permanentDistrictName,
    temporaryDistrictName,
    permanentProvinceName,
    temporaryProvinceName,
    setValue,
  ]);

  // Handle Same As Permanent checkbox
  useEffect(() => {
    if (watchedSameAsPermanent) {
      // Copy permanent address values to temporary
      setValue("temporary", { ...watchedPermanent });
      setTemporaryDistrictName(permanentDistrictName);
      setTemporaryProvinceName(permanentProvinceName);

      // Clear any temporary field errors when using same as permanent
      if (errors.temporary) {
        clearErrors("temporary");
      }
    }
  }, [
    watchedSameAsPermanent,
    watchedPermanent,
    setValue,
    clearErrors,
    errors.temporary,
    permanentDistrictName,
    permanentProvinceName,
  ]);

  const fetchDistrictsByProvince = async (provinceId) => {
    if (!provinceId) return;

    setIsLoading(true);
    try {
      // Clear existing districts before fetching new ones
      setDistricts([]);

      const sanitizedProvinceId = String(provinceId).replace(/[^0-9]/g, "");
      const response = await axiosInstance.get(
        `/api/v1/district/districts/${sanitizedProvinceId}`
      );
      if (response.data.responseCode === "200") {
        setDistricts(response.data.datalist);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Update district name when district ID changes
  const updateDistrictName = (districtId, type) => {
    if (!districtId) return;

    const district = districts.find(
      (d) => String(d.districtId) === String(districtId)
    );

    if (district) {
      if (type === "permanent") {
        setPermanentDistrictName(district.name);
      } else {
        setTemporaryDistrictName(district.name);
      }
    }
  };

  // Update province name when province ID changes
  const updateProvinceName = (provinceId, type) => {
    if (!provinceId) return;

    const province = provinces.find((p) => String(p.id) === String(provinceId));

    if (province) {
      if (type === "permanent") {
        setPermanentProvinceName(province.name);
      } else {
        setTemporaryProvinceName(province.name);
      }
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Helper function to safely sanitize IDs
      const sanitizeId = (id) => {
        if (!id) return "";
        // Convert to string first if it's not already a string
        const idString = String(id);
        return idString.replace(/[^0-9]/g, "");
      };

      // Safely handle provinceId and districtId values
      const permanentProvinceId = data.permanent?.provinceId
        ? sanitizeId(data.permanent.provinceId)
        : sanitizeId(formData.address?.permanent?.provinceId) || "";

      const permanentDistrictId = data.permanent?.districtId
        ? sanitizeId(data.permanent.districtId)
        : sanitizeId(formData.address?.permanent?.districtId) || "";

      const temporaryProvinceId = data.sameAsPermanent
        ? permanentProvinceId
        : data.temporary?.provinceId
        ? sanitizeId(data.temporary.provinceId)
        : sanitizeId(formData.address?.temporary?.provinceId) || "";

      const temporaryDistrictId = data.sameAsPermanent
        ? permanentDistrictId
        : data.temporary?.districtId
        ? sanitizeId(data.temporary.districtId)
        : sanitizeId(formData.address?.temporary?.districtId) || "";

      const newData = {
        data: [
          {
            provinceId: permanentProvinceId,
            districtId: permanentDistrictId,
            municipality: data.permanent?.municipality || "",
            wardNumber: data.permanent?.wardNumber || "",
            pinCode: data.permanent?.pinCode || "",
            tole: data.permanent?.tole || "",
            addressType: "PERMANENT",
          },
          {
            provinceId: temporaryProvinceId,
            districtId: temporaryDistrictId,
            municipality: data.sameAsPermanent
              ? data.permanent?.municipality || ""
              : data.temporary?.municipality || "",
            wardNumber: data.sameAsPermanent
              ? data.permanent?.wardNumber || ""
              : data.temporary?.wardNumber || "",
            pinCode: data.sameAsPermanent
              ? data.permanent?.pinCode || ""
              : data.temporary?.pinCode || "",
            tole: data.sameAsPermanent
              ? data.permanent?.tole || ""
              : data.temporary?.tole || "",
            addressType: "TEMPORARY",
            isSameAsPermanent: data.sameAsPermanent,
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
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Custom validation rules that respect pre-loaded data
  const getProvinceRules = (addressType) => {
    const existingValue =
      addressType === "permanent"
        ? formData.address?.permanent?.provinceId
        : formData.address?.temporary?.provinceId;

    return {
      validate: (value) => {
        // Skip validation if we already have data from API
        if (dataLoaded && existingValue) return true;
        // Otherwise require the field
        return (
          !!value ||
          `${
            addressType === "permanent" ? "Permanent" : "Temporary"
          } Province is required`
        );
      },
    };
  };

  const getDistrictRules = (addressType) => {
    const existingValue =
      addressType === "permanent"
        ? formData.address?.permanent?.districtId
        : formData.address?.temporary?.districtId;

    return {
      validate: (value) => {
        // Skip validation if we already have data from API
        if (dataLoaded && existingValue) return true;
        // Otherwise require the field
        return (
          !!value ||
          `${
            addressType === "permanent" ? "Permanent" : "Temporary"
          } District is required`
        );
      },
    };
  };
  useEffect(() => {
    if (watchedSameAsPermanent) {
      // Copy all permanent address values to temporary fields
      setValue("temporary.provinceId", watch("permanent.provinceId") || "");
      setValue("temporary.districtId", watch("permanent.districtId") || "");
      setValue("temporary.municipality", watch("permanent.municipality") || "");
      setValue("temporary.wardNumber", watch("permanent.wardNumber") || "");
      setValue("temporary.pinCode", watch("permanent.pinCode") || "");
      setValue("temporary.tole", watch("permanent.tole") || "");

      // Update display names
      setTemporaryDistrictName(permanentDistrictName);
      setTemporaryProvinceName(permanentProvinceName);

      // Clear any temporary field errors when using same as permanent
      if (errors.temporary) {
        clearErrors("temporary");
      }
    }
  }, [
    watch,
    watchedSameAsPermanent,
    watch("permanent.provinceId"),
    watch("permanent.districtId"),
    watch("permanent.municipality"),
    watch("permanent.wardNumber"),
    watch("permanent.pinCode"),
    watch("permanent.tole"),
    permanentDistrictName,
    permanentProvinceName,
    setValue,
    clearErrors,
    errors.temporary,
  ]);
  return (
    <>
      {isLoading && <Loader message="Loading please wait" />}
      <ValidationComponent>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 py-3">
            Address Details
          </h2>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            {/* Permanent Address */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-600">
                Permanent Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Province Select */}
                <div>
                  <Controller
                    name="permanent.provinceId"
                    control={control}
                    rules={getProvinceRules("permanent")}
                    render={({ field }) => (
                      <Select
                        variant="bordered"
                        scrollShadowProps={{ isEnabled: true }}
                        isInvalid={!!errors.permanent?.provinceId}
                        className={`w-full rounded-xl`}
                        label="Select A Province"
                        placeholder={
                          permanentProvinceName ||
                          formData.address?.permanent?.provinceName ||
                          "Select Province"
                        }
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0];
                          field.onChange(selectedKey);
                          // Update province name
                          updateProvinceName(selectedKey, "permanent");
                          // Reset district when province changes
                          setValue("permanent.districtId", "");
                          setPermanentDistrictName("");
                          // Fetch new districts for the selected province
                          fetchDistrictsByProvince(selectedKey);
                        }}>
                        {provinces.map((province) => (
                          <SelectItem key={province.id} value={province.id}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.permanent?.provinceId && (
                    <p className="text-danger text-sm mt-1">
                      {errors.permanent.provinceId.message}
                    </p>
                  )}
                </div>

                {/* District Select */}
                <div>
                  <Controller
                    name="permanent.districtId"
                    control={control}
                    rules={getDistrictRules("permanent")}
                    render={({ field }) => (
                      <Select
                        variant="bordered"
                        scrollShadowProps={{ isEnabled: true }}
                        isInvalid={!!errors.permanent?.districtId}
                        className={`w-full rounded-xl`}
                        label="Select A District"
                        selectedKeys={field.value ? [field.value] : []}
                        placeholder={
                          permanentDistrictName ||
                          formData.address?.permanent?.districtName ||
                          "Select District"
                        }
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0];
                          field.onChange(selectedKey);
                          updateDistrictName(selectedKey, "permanent");
                        }}>
                        {districts.map((district) => (
                          <SelectItem key={district.id} value={district.id}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.permanent?.districtId && (
                    <p className="text-danger text-sm mt-1">
                      {errors.permanent.districtId.message}
                    </p>
                  )}
                </div>

                {/* Municipality */}
                <div>
                  <InputComponent
                    name="permanent.municipality"
                    control={control}
                    rules={{ required: "Permanent Municipality is required" }}
                    label="Municipality"
                    variant="bordered"
                    type="text"
                    inputClassName="w-full rounded-xl"
                    value={formData.address?.permanent?.municipality || ""}
                  />
                </div>

                {/* Ward Number */}
                <div>
                  <InputComponent
                    name="permanent.wardNumber"
                    control={control}
                    rules={{
                      required: "Permanent Ward Number is required",
                      pattern: {
                        value: /^([1-9]|0[1-9]|[1-2][0-9]|3[0-2])$/,
                        message: "Ward Number must be between 1 and 32",
                      },
                    }}
                    label="Ward No"
                    variant="bordered"
                    type="text"
                    id="ward"
                    inputClassName="w-full rounded-xl"
                    value={formData.address?.permanent?.wardNumber || ""}
                  />
                </div>

                {/* Pin Code  */}
                <InputComponent
                  name="permanent.pinCode"
                  control={control}
                  rules={{
                    required: "Permanent Pin Code is required",
                    pattern: {
                      value: /^\d{5}$/,
                      message:
                        "Invalid pincode. Must be a 5-digit number starting with 1-9.",
                    },
                  }}
                  label="Pin Code"
                  variant="bordered"
                  type="text"
                  id="pincode"
                  inputClassName="w-full rounded-xl"
                  value={formData.address?.permanent?.pinCode || ""}
                />

                {/* Tole/Area  */}
                <InputComponent
                  name="permanent.tole"
                  control={control}
                  rules={{ required: "Permanent Tole/Area is required" }}
                  label="Tole/Area"
                  variant="bordered"
                  type="text"
                  inputClassName="w-full rounded-xl"
                  value={formData.address?.permanent?.tole || ""}
                />
              </div>
            </div>

            {/* Temporary Address */}
            <div className="space-y-4">
              <div className="flex flex-col justify-start gap-x-4 my-4">
                <h3 className="text-xl font-semibold text-gray-600">
                  Temporary Address
                </h3>
                <Controller
                  name="sameAsPermanent"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <Checkbox
                      {...field}
                      isSelected={value}
                      onChange={(e) => {
                        onChange(e.target.checked);
                        setSameAsPermanent(e.target.checked);

                        // If checked, copy province name as well
                        if (e.target.checked) {
                          setTemporaryProvinceName(permanentProvinceName);
                        }
                      }}>
                      Same as Permanent Address
                    </Checkbox>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Temporary Province Select */}
                <div>
                  <Controller
                    name="temporary.provinceId"
                    control={control}
                    rules={
                      !watchedSameAsPermanent
                        ? getProvinceRules("temporary")
                        : {}
                    }
                    render={({ field }) => (
                      <Select
                        variant="bordered"
                        scrollShadowProps={{ isEnabled: true }}
                        isInvalid={!!errors.temporary?.provinceId}
                        className={`w-full rounded-xl`}
                        label="Select A Province"
                        placeholder={
                          watchedSameAsPermanent
                            ? permanentProvinceName
                            : temporaryProvinceName || "Select Province"
                        }
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0];
                          field.onChange(selectedKey);
                          // Update province name
                          updateProvinceName(selectedKey, "temporary");
                          // Reset district when province changes
                          setValue("temporary.districtId", "");
                          setTemporaryDistrictName("");
                          // Fetch new districts for the selected province
                          fetchDistrictsByProvince(selectedKey);
                        }}
                        isDisabled={watchedSameAsPermanent}>
                        {provinces.map((province) => (
                          <SelectItem key={province.id} value={province.id}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.temporary?.provinceId && (
                    <p className="text-danger text-sm mt-1">
                      {errors.temporary.provinceId.message}
                    </p>
                  )}
                </div>

                {/* Temporary District Select */}
                <div>
                  <Controller
                    name="temporary.districtId"
                    control={control}
                    rules={
                      !watchedSameAsPermanent
                        ? getDistrictRules("temporary")
                        : {}
                    }
                    render={({ field }) => (
                      <Select
                        variant="bordered"
                        scrollShadowProps={{ isEnabled: true }}
                        isInvalid={!!errors.permanent?.districtId}
                        // isInvalid={!!errors.temporary?.id}
                        className={`w-full rounded-xl`}
                        label="Select A District"
                        selectedKeys={field.value ? [field.value] : []}
                        placeholder={
                          temporaryDistrictName ||
                          formData.address?.temporary?.districtName ||
                          "Select District"
                        }
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0];
                          field.onChange(selectedKey);
                          updateDistrictName(selectedKey, "temporary");
                        }}
                        isDisabled={watchedSameAsPermanent}>
                        {districts.map((district) => (
                          <SelectItem key={district.id} value={district.id}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.temporary?.districtId && (
                    <p className="text-danger text-sm mt-1">
                      {errors.temporary.districtId.message}
                    </p>
                  )}
                </div>

                {/* Temporary Municipality */}
                <InputComponent
                  name="temporary.municipality"
                  control={control}
                  rules={{
                    required: !watchedSameAsPermanent
                      ? "Temporary Municipality is required"
                      : false,
                  }}
                  label="Municipality"
                  variant="bordered"
                  type="text"
                  inputClassName="w-full rounded-xl"
                  isReadOnly={watchedSameAsPermanent}
                  value={formData.address?.temporary?.municipality || ""}
                />

                {/* Temporary Ward Number  */}
                <InputComponent
                  name="temporary.wardNumber"
                  control={control}
                  rules={{
                    required: !watchedSameAsPermanent
                      ? "Temporary Ward Number is required"
                      : false,
                    pattern: {
                      value: /^(?:[1-9]|[12][0-9]|3[0-2])$/,
                      message: "Ward Number must be between 1 and 32",
                    },
                  }}
                  label="Ward No."
                  variant="bordered"
                  type="text"
                  id="ward"
                  inputClassName="w-full rounded-xl"
                  isReadOnly={watchedSameAsPermanent}
                  value={formData.address?.temporary?.wardNumber || ""}
                />

                {/* Temporary Pin Code  */}
                <InputComponent
                  name="temporary.pinCode"
                  control={control}
                  rules={{
                    required: !watchedSameAsPermanent
                      ? "Temporary Pin Code is required"
                      : false,
                    pattern: {
                      value: /^\d{5}$/,
                      message:
                        "Invalid pincode. Must be a 5-digit number starting with 1-9.",
                    },
                  }}
                  label="Pin Code"
                  variant="bordered"
                  type="text"
                  id="pincode"
                  inputClassName="w-full rounded-xl"
                  isReadOnly={watchedSameAsPermanent}
                  value={formData.address?.temporary?.pinCode || ""}
                />

                {/* Temporary Tole/Area - Using InputComponent */}
                <InputComponent
                  name="temporary.tole"
                  control={control}
                  rules={{
                    required: !watchedSameAsPermanent
                      ? "Temporary Tole/Area is required"
                      : false,
                  }}
                  label="Tole/Area"
                  variant="bordered"
                  type="text"
                  inputClassName="w-full rounded-xl"
                  isReadOnly={watchedSameAsPermanent}
                  value={formData.address?.temporary?.tole || ""}
                />
              </div>

              <div className="form-navigation flex justify-between mt-6">
                <Button
                  onPress={handleBack}
                  className="px-4 py-2 bg-gray-300 rounded">
                  Back
                </Button>
                <button
                  type="submit"
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
