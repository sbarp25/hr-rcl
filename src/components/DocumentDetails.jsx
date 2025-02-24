import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../lib/axios-Instance";
import { Button, Input } from "@nextui-org/react";
import { toast } from "react-toastify";
import ValidationComponent from "./ValidationComponent";
import { FaRegEye } from "react-icons/fa";

const DocumentDetails = ({ formData, handleNext, handleBack, setFormData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      panNumber: "",
      panIssuePlace: "",
      panIssueDate: "",
      panCardDocumentFile: null,
      citizenshipNumber: "",
      isIssuedPlaceDistrict: "",
      issuedDate: "",
      citizenshipFrontDocumentFile: null,
      citizenshipBackDocumentFile: null,
    },
  });

  // State to store existing document URLs
  const [existingDocs, setExistingDocs] = useState({
    panCardUrl: null,
    citizenshipFrontUrl: null,
    citizenshipBackUrl: null,
  });

  const [citizenshipFront, setCitizenshipFront] = useState(false);
  const [citizenshipBack, setCitizenshipBack] = useState(false);
  const [photoPAN, setPhotoPAN] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Watch file inputs
  const watchPanCard = watch("panCardDocumentFile");
  const watchCitizenshipFront = watch("citizenshipFrontDocumentFile");
  const watchCitizenshipBack = watch("citizenshipBackDocumentFile");

  const handleFileChange = (fieldName, e) => {
    const file = e.target.files[0];
    if (file) {
      setValue(fieldName, file);
      // Reset the corresponding URL when a new file is selected
      switch (fieldName) {
        case "panCardDocumentFile":
          setExistingDocs((prev) => ({ ...prev, panCardUrl: null }));
          break;
        case "citizenshipFrontDocumentFile":
          setExistingDocs((prev) => ({ ...prev, citizenshipFrontUrl: null }));
          break;
        case "citizenshipBackDocumentFile":
          setExistingDocs((prev) => ({ ...prev, citizenshipBackUrl: null }));
          break;
      }
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formDataToSubmit = new FormData();

    // Append basic form data
    formDataToSubmit.append("panNumber", data.panNumber);
    formDataToSubmit.append("panIssueDate", data.panIssueDate);
    formDataToSubmit.append("panIssuePlace", data.panIssuePlace);
    formDataToSubmit.append("citizenshipNumber", data.citizenshipNumber);
    formDataToSubmit.append("citizenshipIssueDate", data.issuedDate);
    formDataToSubmit.append(
      "citizenshipIssuedPlaceDistrict",
      data.isIssuedPlaceDistrict
    );

    // Only append files if new ones were selected
    if (data.panCardDocumentFile instanceof File) {
      formDataToSubmit.append("panCardDocumentFile", data.panCardDocumentFile);
    }
    if (data.citizenshipFrontDocumentFile instanceof File) {
      formDataToSubmit.append(
        "citizenshipFrontDocumentFile",
        data.citizenshipFrontDocumentFile
      );
    }
    if (data.citizenshipBackDocumentFile instanceof File) {
      formDataToSubmit.append(
        "citizenshipBackDocumentFile",
        data.citizenshipBackDocumentFile
      );
    }

    // Append existing URLs if no new files were selected
    if (
      !(data.panCardDocumentFile instanceof File) &&
      existingDocs.panCardUrl
    ) {
      formDataToSubmit.append("panCardDocumentUrl", existingDocs.panCardUrl);
    }
    if (
      !(data.citizenshipFrontDocumentFile instanceof File) &&
      existingDocs.citizenshipFrontUrl
    ) {
      formDataToSubmit.append(
        "citizenshipFrontDocumentUrl",
        existingDocs.citizenshipFrontUrl
      );
    }
    if (
      !(data.citizenshipBackDocumentFile instanceof File) &&
      existingDocs.citizenshipBackUrl
    ) {
      formDataToSubmit.append(
        "citizenshipBackDocumentUrl",
        existingDocs.citizenshipBackUrl
      );
    }

    try {
      const response = await axiosInstance.post(
        "/api/v1/document/save",
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.responseCode === "200") {
        toast.success(response?.data?.message);
        handleNext();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error("Error saving document details:", error);
      toast.error("Error saving document details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const fetchDocumentDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/v1/document/getById", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data.responseCode === "200") {
          const data = response.data.data;

          // Store existing URLs
          setExistingDocs({
            panCardUrl: data.panCardDocumentUrl || null,
            citizenshipFrontUrl: data.citizenshipFrontDocumentUrl || null,
            citizenshipBackUrl: data.citizenshipBackDocumentUrl || null,
          });

          reset({
            panNumber: data.panNumber || "",
            panIssuePlace: data.panIssuePlace || "",
            citizenshipNumber: data.citizenshipNumber || "",
            panIssueDate: data.panIssueDate || "",
            issuedDate: data.citizenshipIssueDate || "",
            isIssuedPlaceDistrict: data.citizenshipIssuedPlaceDistrict || "",
          });

          setCitizenshipFront(!!data.citizenshipFrontDocumentUrl);
          setCitizenshipBack(!!data.citizenshipBackDocumentUrl);
          setPhotoPAN(!!data.panCardDocumentUrl);
        }
      } catch (error) {
        console.error("Error fetching document details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [reset]);

  // Modify the ViewUploadedFile component to use existingDocs
  const getFileDisplay = (fieldName) => {
    const file = watch(fieldName);
    let existingUrl;
    switch (fieldName) {
      case "panCardDocumentFile":
        existingUrl = existingDocs.panCardUrl;
        break;
      case "citizenshipFrontDocumentFile":
        existingUrl = existingDocs.citizenshipFrontUrl;
        break;
      case "citizenshipBackDocumentFile":
        existingUrl = existingDocs.citizenshipBackUrl;
        break;
    }

    return file instanceof File ? file : existingUrl;
  };
  return (
    <ValidationComponent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* PAN Details Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-600 pt-4">
            PAN Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4">
            {/* PAN Number */}
            <div>
              <Input
                variant="bordered"
                {...register("panNumber", {
                  required: "PAN Number is required",
                  pattern: {
                    value: /^[0-9]{0,16}$/,
                    message: "Invalid format",
                  },
                })}
                className={`w-full rounded-xl ${
                  errors.panNumber ? "border-2 border-red-500" : ""
                }`}
                type="text"
                label="Enter your PAN number"
              />
              {errors.panNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.panNumber.message}
                </p>
              )}
            </div>

            {/* PAN Issue Date */}
            <div>
              <Input
                variant="bordered"
                {...register("panIssueDate", {
                  required: "PAN Issue Date is required",
                })}
                className={`w-full rounded-xl ${
                  errors.panIssueDate ? "border-2 border-red-500" : ""
                }`}
                type="date"
                label="Pan Issue Date"
              />
              {errors.panIssueDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.panIssueDate.message}
                </p>
              )}
            </div>

            {/* PAN Issue Place */}
            <div>
              <Input
                variant="bordered"
                {...register("panIssuePlace", {
                  required: "PAN Issue Place is required",
                })}
                className={`w-full rounded-xl ${
                  errors.panIssuePlace ? "border-2 border-red-500" : ""
                }`}
                type="text"
                label="Enter PAN issued place"
              />
              {errors.panIssuePlace && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.panIssuePlace.message}
                </p>
              )}
            </div>

            {/* PAN Photo Upload */}
            <div>
              <div>
                <label
                  className={`relative flex items-center justify-left w-full h-14 border-2 ${
                    errors.panCardDocumentFile
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-xl cursor-pointer bg-white hover:bg-gray-200`}
                >
                  <span className="text-gray-600 px-4">
                    {watchPanCard instanceof File ? (
                      <div className="flex gap-2">
                        <p>Upload a file</p>
                        {watchPanCard.names}
                      </div>
                    ) : (
                      "Upload A File"
                    )}
                    {/* {watchPanCard?.name || "Upload Front photo of Pan Card"} */}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("panCardDocumentFile", e)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    {...register("panCardDocumentFile", {
                      required: "PAN Card photo is required",
                    })}
                  />
                </label>
                {errors.panCardDocumentFile && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.panCardDocumentFile.message}
                  </p>
                )}
              </div>

              <div className="flex gap-x-4">
                <label className="text-xs pl-2">
                  Please upload the image of type either PNG or jpg
                </label>
                {photoPAN && watchPanCard && (
                  <ViewUploadedFile file={watchPanCard} label="PAN Card" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Citizenship Details Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-600">
            Citizenship Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Citizenship Number */}
            <div>
              <Input
                variant="bordered"
                {...register("citizenshipNumber", {
                  required: "Citizenship Number is required",
                  pattern: {
                    value: /^[0-9]{0,16}$/,
                    message: "Invalid format",
                  },
                })}
                className={`w-full rounded-xl ${
                  errors.citizenshipNumber ? "border-2 border-red-500" : ""
                }`}
                type="text"
                label="Enter Citizenship Number"
              />
              {errors.citizenshipNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.citizenshipNumber.message}
                </p>
              )}
            </div>

            {/* Citizenship Issue Date */}
            <div>
              <Input
                variant="bordered"
                {...register("issuedDate", {
                  required: "Citizenship Issue Date is required",
                })}
                className={`w-full rounded-xl ${
                  errors.issuedDate ? "border-2 border-red-500" : ""
                }`}
                type="date"
                label="Citizenship Issue Date"
              />
              {errors.issuedDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.issuedDate.message}
                </p>
              )}
            </div>

            {/* Citizenship Issue Place */}
            <div>
              <Input
                variant="bordered"
                {...register("isIssuedPlaceDistrict", {
                  required: "Citizenship Issue Place is required",
                })}
                className={`w-full rounded-xl ${
                  errors.isIssuedPlaceDistrict ? "border-2 border-red-500" : ""
                }`}
                type="text"
                label="Enter Citizenship Issued Place"
              />
              {errors.isIssuedPlaceDistrict && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.isIssuedPlaceDistrict.message}
                </p>
              )}
            </div>
          </div>

          {/* Citizenship Document Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {/* Front Photo Upload */}
            <div>
              <div>
                <label
                  className={`relative flex items-center justify-left w-full h-14 border-2 ${
                    errors.citizenshipFrontDocumentFile
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-xl cursor-pointer bg-white hover:bg-gray-200`}
                >
                  <span className="text-gray-600 px-4">
                    {watchCitizenshipFront?.name ||
                      "Upload front Photo of citizenship"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange("citizenshipFrontDocumentFile", e)
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    {...register("citizenshipFrontDocumentFile", {
                      required: "Citizenship front photo is required",
                    })}
                  />
                </label>
                {errors.citizenshipFrontDocumentFile && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.citizenshipFrontDocumentFile.message}
                  </p>
                )}
              </div>

              <div className="flex gap-x-4">
                <label className="text-xs pl-2">
                  Please upload the image of type either PNG or jpg
                </label>
                {citizenshipFront && watchCitizenshipFront && (
                  <ViewUploadedFile
                    file={watchCitizenshipFront}
                    label="Citizenship Front"
                  />
                )}
              </div>
            </div>

            {/* Back Photo Upload */}
            <div>
              <div>
                <label
                  className={`relative flex items-center justify-left w-full h-14 border-2 ${
                    errors.citizenshipBackDocumentFile
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-xl cursor-pointer bg-white hover:bg-gray-200`}
                >
                  <span className="text-gray-600 px-4">
                    {watchCitizenshipBack?.name ||
                      "Upload back Photo of citizenship"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange("citizenshipBackDocumentFile", e)
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    {...register("citizenshipBackDocumentFile", {
                      required: "Citizenship back photo is required",
                    })}
                  />
                </label>
                {errors.citizenshipBackDocumentFile && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.citizenshipBackDocumentFile.message}
                  </p>
                )}
              </div>

              <div className="flex gap-x-4">
                <label className="text-xs pl-2">
                  Please upload the image of type either PNG or jpg
                </label>
                {citizenshipBack && watchCitizenshipBack && (
                  <ViewUploadedFile
                    file={watchCitizenshipBack}
                    label="Citizenship Back"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="form-navigation flex justify-between mt-6">
            <Button
              onPress={handleBack}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </ValidationComponent>
  );
};

// Helper component for viewing uploaded files
const ViewUploadedFile = ({ file, label }) => {
  if (!file)
    return <div className="text-xs text-red-500">No Links Available</div>;

  // If file is a URL string (from existing upload)
  if (typeof file === "string") {
    return (
      <a
        href={file}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-sm text-green-600 underline mb-2"
      >
        <span className="flex items-center gap-x-2">
          <FaRegEye />
          View Uploaded {label}
        </span>
      </a>
    );
  }

  // If file is a File object (new upload)
  if (file instanceof File) {
    return (
      <span className="text-sm text-green-600 flex items-center gap-x-2">
        <FaRegEye />
        {file.name}
      </span>
    );
  }

  return <div className="text-xs text-red-500">No Links Available</div>;
};

export default DocumentDetails;
