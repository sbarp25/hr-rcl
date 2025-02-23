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
  const [temporaryDistricts, setTemporaryDistricts] = useState([]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: {
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
    },
  });

  const watchPermanentAddress = watch("address.permanent");
  const watchSameAsPermanent = watch("address.sameAsPermanent");

  // Update temporary address when checkbox is checked
  useEffect(() => {
    if (watchSameAsPermanent) {
      const fieldsToUpdate = [
        "provinceId",
        "districtId",
        "municipality",
        "wardNumber",
        "pinCode",
        "tole",
      ];

      fieldsToUpdate.forEach((field) => {
        setValue(`address.temporary.${field}`, watchPermanentAddress[field], {
          shouldValidate: true,
          shouldDirty: true,
        });
      });

      // Update districts for temporary address
      if (watchPermanentAddress.provinceId) {
        fetchDistrictsByProvince(watchPermanentAddress.provinceId, "temporary");
      }
    }
  }, [watchSameAsPermanent, watchPermanentAddress, setValue]);

  // Fetch provinces on component mount
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

  const fetchDistrictsByProvince = async (provinceId, addressType) => {
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
      toast.error("Failed to fetch districts");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const sanitizedData = {
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
    }
  };

  return (
    <ValidationComponent>
      <div className="space-y-4 bg-white">
        <h2 className="text-2xl font-semibold text-gray-700 py-3">
          Address Details
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {/* Permanent Address Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-600">
              Permanent Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Province Select */}
              <Controller
                name="address.permanent.provinceId"
                control={control}
                rules={{ required: "Province is required" }}
                render={({ field }) => (
                  <div>
                    <Select
                      variant="bordered"
                      label="Select Province"
                      className={`w-full rounded-xl ${
                        errors.address?.permanent?.provinceId
                          ? "border-2 border-red-500"
                          : ""
                      }`}
                      selectedKeys={field.value ? [field.value] : []}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        fetchDistrictsByProvince(e.target.value, "permanent");
                      }}
                    >
                      {provinces.map((province) => (
                        <SelectItem key={province.id} value={province.id}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </Select>
                    {errors.address?.permanent?.provinceId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.permanent.provinceId.message}
                      </p>
                    )}
                  </div>
                )}
              />
              {/* District Select */}
              <Controller
                name="address.permanent.districtId"
                control={control}
                rules={{ required: "District is required" }}
                render={({ field }) => (
                  <div>
                    <Select
                      variant="bordered"
                      label="Select District"
                      className={`w-full rounded-xl ${
                        errors.address?.permanent?.districtId
                          ? "border-2 border-red-500"
                          : ""
                      }`}
                      selectedKeys={field.value ? [field.value] : []}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      {districts.map((district) => (
                        <SelectItem
                          key={district.districtId}
                          value={district.districtId}
                        >
                          {district.name}
                        </SelectItem>
                      ))}
                    </Select>
                    {errors.address?.permanent?.districtId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.permanent.districtId.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <div>
                <InputComponent
                  name="municipality"
                  control={control}
                  variant="bordered"
                  label="Muncipality"
                  rules={{
                    required: "Muncipality is required",
                    pattern: {
                      value: /^[a-zA-Z ]{3,50}$/,
                      message: "Muncipality must be 3-50 characters long.",
                    },
                  }}
                />
              </div>
              <div>
                <InputComponent
                  name="WardNumber"
                  control={control}
                  variant="bordered"
                  label="Ward Number"
                  rules={{
                    required: "Ward Number is required",
                    pattern: {
                      value: /^[0-9]{0,2}$/,
                      message: "Ward Number must be 3-50 characters long.",
                    },
                  }}
                />
              </div>
              <div>
                <InputComponent
                  name="PinCOde"
                  control={control}
                  variant="bordered"
                  label="PinCode"
                  rules={{
                    required: "PinCode is required",
                    pattern: {
                      value: /^[0-9 ]{5}$/,
                      message: "PinCode must be 3-500 characters long.",
                    },
                  }}
                />
              </div>

              <div>
                <InputComponent
                  name="Tole"
                  control={control}
                  variant="bordered"
                  label="Tole/Area"
                  rules={{
                    required: "Tole/Area is required",
                    pattern: {
                      value: /^[a-zA-Z ]{3,50}$/,
                      message: "Tole/Area must be 3-300 characters long.",
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Temporary Address Section */}
          <div className="space-y-4 mt-6">
            <div className="flex flex-col justify-start gap-x-4 my-4">
              <h3 className="text-xl font-semibold text-gray-600">
                Temporary Address
              </h3>
              <Controller
                name="address.sameAsPermanent"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    isSelected={field.value}
                    onValueChange={(isSelected) => field.onChange(isSelected)}
                  >
                    Same as Permanent Address
                  </Checkbox>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Temporary Province Select */}
              <Controller
                name="address.temporary.provinceId"
                control={control}
                rules={{ required: "Province is required" }}
                render={({ field }) => (
                  <div>
                    <Select
                      variant="bordered"
                      label="Select Province"
                      className={`w-full rounded-xl ${
                        errors.address?.temporary?.provinceId
                          ? "border-2 border-red-500"
                          : ""
                      }`}
                      selectedKeys={field.value ? [field.value] : []}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        fetchDistrictsByProvince(e.target.value, "temporary");
                      }}
                      isDisabled={watchSameAsPermanent}
                    >
                      {provinces.map((province) => (
                        <SelectItem key={province.id} value={province.id}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </Select>
                    {errors.address?.temporary?.provinceId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.temporary.provinceId.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Add isDisabled={watchSameAsPermanent} to all temporary address inputs */}
              <Controller
                name="address.temporary.districtId"
                control={control}
                rules={{ required: "District is required" }}
                render={({ field }) => (
                  <div>
                    <Select
                      variant="bordered"
                      label="Select District"
                      className={`w-full rounded-xl ${
                        errors.address?.temporary?.districtId
                          ? "border-2 border-red-500"
                          : ""
                      }`}
                      selectedKeys={field.value ? [field.value] : []}
                      onChange={(e) => field.onChange(e.target.value)}
                      isDisabled={watchSameAsPermanent}
                    >
                      {(watchSameAsPermanent
                        ? districts
                        : temporaryDistricts
                      ).map((district) => (
                        <SelectItem
                          key={district.districtId}
                          value={district.districtId}
                        >
                          {district.name}
                        </SelectItem>
                      ))}
                    </Select>
                    {errors.address?.temporary?.districtId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.temporary.districtId.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Repeat for other temporary address fields */}
              <InputComponent
                name="temporarymunicipality"
                control={control}
                variant="bordered"
                value={
                  watchSameAsPermanent ? municipality : temporarymunicipality
                }
                label="Municipality"
                disabled={watchSameAsPermanent}
                rules={{
                  required: "Municipality is required",
                  pattern: {
                    value: /^[a-zA-Z]{3,50}$/,
                    message: "Municipality must be 3-300 characters long.",
                  },
                }}
              />

              <InputComponent
                name="address.temporary.wardNumber"
                control={control}
                variant="bordered"
                label="Ward Number"
                disabled={watchSameAsPermanent}
                rules={{
                  required: "Ward Number is required",
                  pattern: {
                    value: /^[0-9]{0,2}$/,
                    message: "Ward Number must be 0-99.",
                  },
                }}
              />

              <InputComponent
                name="address.temporary.pinCode"
                control={control}
                variant="bordered"
                label="Pin Code"
                disabled={watchSameAsPermanent}
                rules={{
                  required: "Pin Code is required",
                  pattern: {
                    value: /^[0-9]{5}$/,
                    message: "Pin Code must be exactly 5 digits.",
                  },
                }}
              />

              <InputComponent
                name="address.temporary.tole"
                control={control}
                variant="bordered"
                label="Tole/Area"
                disabled={watchSameAsPermanent}
                rules={{
                  required: "Tole/Area is required",
                  pattern: {
                    value: /^[a-zA-Z0-9 ]{3,300}$/,
                    message: "Tole/Area must be 3-300 characters long.",
                  },
                }}
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="form-navigation flex justify-between mt-6">
            <Button
              type="button"
              onPress={handleBack}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </ValidationComponent>
  );
};

export default AddressDetails;
