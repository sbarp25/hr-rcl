import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios-Instance";
import { Button, Select, SelectItem, Checkbox } from "@nextui-org/react";
import ValidationComponent from "./ValidationComponent";
import Loader from "./Loader";
import { useForm, Controller } from "react-hook-form";
import InputComponent from "./InputComponent";

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
  const [sameAsPermanent, setSameAsPermanent] = useState(false);

  const {
    control,
    handleSubmit: handleReactHookFormSubmit,
    setValue,
    formState: { errors },
    watch,
    trigger,
    reset,
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

          // Set values in the form
          setValue("permanent.provinceId", permanentAddress.provinceId || "");
          setValue("permanent.districtId", permanentAddress.districtName || "");
          setValue(
            "permanent.municipality",
            permanentAddress.municipality || ""
          );
          setValue("permanent.wardNumber", permanentAddress.wardNumber || "");
          setValue("permanent.pinCode", permanentAddress.pinCode || "");
          setValue("permanent.tole", permanentAddress.tole || "");

          setValue("temporary.provinceId", temporaryAddress.provinceId || "");
          setValue("temporary.districtId", temporaryAddress.districtName || "");
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

          // Also update the parent state to keep it in sync
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
              sameAsPermanent: isSameAsPermanent,
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
  }, [setValue, setFormData]);

  // Sync form data changes to parent component
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      address: {
        permanent: watchedPermanent,
        temporary: watchedSameAsPermanent
          ? watchedPermanent
          : watch("temporary"),
        sameAsPermanent: watchedSameAsPermanent,
      },
    }));
  }, [watch, setFormData, watchedPermanent, watchedSameAsPermanent]);

  // Handle Same As Permanent checkbox
  useEffect(() => {
    if (watchedSameAsPermanent) {
      // Copy permanent address values to temporary
      setValue("temporary", { ...watchedPermanent });
    }
  }, [watchedSameAsPermanent, watchedPermanent, setValue]);

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
      toast.error("Failed to fetch District Data.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const sanitizedProvinceId = data.permanent.provinceId.replace(
        /[^0-9]/g,
        ""
      );
      const sanitizedTemporaryProvinceId = data.temporary.provinceId.replace(
        /[^0-9]/g,
        ""
      );
      const sanitizedDistrictId = data.permanent.districtId.replace(
        /[^0-9]/g,
        ""
      );
      const sanitizedtemporaryDistrictId = data.temporary.districtId.replace(
        /[^0-9]/g,
        ""
      );

      const newData = {
        data: [
          {
            provinceId: sanitizedProvinceId,
            districtId: sanitizedDistrictId,
            municipality: data.permanent.municipality,
            wardNumber: data.permanent.wardNumber,
            pinCode: data.permanent.pinCode,
            tole: data.permanent.tole,
            addressType: "PERMANENT",
          },
          {
            provinceId: sanitizedTemporaryProvinceId,
            districtId: sanitizedtemporaryDistrictId,
            municipality: data.temporary.municipality,
            wardNumber: data.temporary.wardNumber,
            pinCode: data.temporary.pinCode,
            tole: data.temporary.tole,
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
    }
  };

  return (
    <>
      {/* {isLoading && <Loader message="Loading please wait" />} */}
      <ValidationComponent>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 py-3">
            Address Details
          </h2>
          <form
            className="w-full"
            onSubmit={handleReactHookFormSubmit(onSubmit)}>
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
                    rules={{ required: "Permanent Province is required" }}
                    render={({ field }) => (
                      <Select
                        variant="bordered"
                        scrollShadowProps={{ isEnabled: true }}
                        isInvalid={!!errors.permanent?.provinceId}
                        className={`w-full rounded-xl`}
                        label="Select A Province"
                        placeholder={formData.address?.permanent?.provinceName}
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(keys) => {
                          field.onChange(Array.from(keys)[0]);
                          fetchDistrictsByProvince(Array.from(keys)[0]);
                          // Reset district when province changes
                          setValue("permanent.districtId", "");
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
                    rules={{ required: "Permanent District is required" }}
                    render={({ field }) => (
                      <Select
                        variant="bordered"
                        scrollShadowProps={{ isEnabled: true }}
                        isInvalid={!!errors.permanent?.districtId}
                        className={`w-full rounded-xl `}
                        label="Select A District"
                        selectedKeys={field.value ? [field.value] : []}
                        placeholder={formData.address?.permanent?.districtId}
                        onSelectionChange={(keys) => {
                          field.onChange(Array.from(keys)[0]);
                        }}>
                        {districts.map((district) => (
                          <SelectItem
                            key={district.districtId}
                            value={district.districtId}>
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
                        value: /^(?:[1-9]|[12][0-9]|3[0-2])$/,
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
                  rules={{ required: "Permanent Pin Code is required" }}
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
                    rules={{
                      required: !watchedSameAsPermanent
                        ? "Temporary Province is required"
                        : false,
                    }}
                    render={({ field }) => (
                      <Select
                        variant="bordered"
                        scrollShadowProps={{ isEnabled: true }}
                        isInvalid={!!errors.temporary?.provinceId}
                        className={`w-full rounded-xl`}
                        label="Select A Province"
                        placeholder={formData.address?.temporary?.provinceName}
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(keys) => {
                          field.onChange(Array.from(keys)[0]);
                          fetchDistrictsByProvince(Array.from(keys)[0]);
                          // Reset district when province changes
                          setValue("temporary.districtId", "");
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
                    rules={{
                      required: !watchedSameAsPermanent
                        ? "Temporary District is required"
                        : false,
                    }}
                    render={({ field }) => (
                      <Select
                        variant="bordered"
                        scrollShadowProps={{ isEnabled: true }}
                        isInvalid={!!errors.temporary?.districtId}
                        className={`w-full rounded-xl `}
                        label="Select A District"
                        selectedKeys={field.value ? [field.value] : []}
                        placeholder={formData.address?.temporary?.districtId}
                        onSelectionChange={(keys) => {
                          field.onChange(Array.from(keys)[0]);
                        }}
                        isDisabled={watchedSameAsPermanent}>
                        {districts.map((district) => (
                          <SelectItem
                            key={district.districtId}
                            value={district.districtId}>
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
