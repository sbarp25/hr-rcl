import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../lib/axios-Instance";
import { Button } from "@nextui-org/react";
import { toast } from "react-toastify";
import ValidationComponent from "./ValidationComponent";
import { FaRegEye } from "react-icons/fa";
import InputComponent from "./InputComponent"; // Import the custom InputComponent

const DocumentDetails = ({ formData, handleNext, handleBack, setFormData }) => {
  const {
    control,
    handleSubmit,
    setValue,
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

  const [citizenshipFront, setCitizenshipFront] = useState(false);
  const [citizenshipBack, setCitizenshipBack] = useState(false);
  const [photoPAN, setPhotoPAN] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formDataToSubmit = new FormData();

    // Append form data
    formDataToSubmit.append("panNumber", data.panNumber);
    formDataToSubmit.append("panIssueDate", data.panIssueDate);
    formDataToSubmit.append("panIssuePlace", data.panIssuePlace);
    formDataToSubmit.append("citizenshipNumber", data.citizenshipNumber);
    formDataToSubmit.append("citizenshipIssueDate", data.issuedDate);
    formDataToSubmit.append(
      "citizenshipIssuedPlaceDistrict",
      data.isIssuedPlaceDistrict
    );

    // Append Files
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
    if (data.panCardDocumentFile instanceof File) {
      formDataToSubmit.append("panCardDocumentFile", data.panCardDocumentFile);
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

          // Set form values using react-hook-form
          reset({
            panNumber: data.panNumber || "",
            panIssuePlace: data.panIssuePlace || "",
            citizenshipNumber: data.citizenshipNumber || "",
            panIssueDate: data.panIssueDate || "",
            issuedDate: data.citizenshipIssueDate || "",
            isIssuedPlaceDistrict: data.citizenshipIssuedPlaceDistrict || "",
            panCardDocumentFile: data.panCardDocumentUrl || null,
            citizenshipFrontDocumentFile:
              data.citizenshipFrontDocumentUrl || null,
            citizenshipBackDocumentFile:
              data.citizenshipBackDocumentUrl || null,
          });

          setCitizenshipFront(true);
          setCitizenshipBack(true);
          setPhotoPAN(true);
        }
      } catch (error) {
        console.error("Error fetching document details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [reset]);

  return (
    <ValidationComponent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* PAN Details Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-600 pt-4">
            PAN Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4">
            {/* PAN number */}
            <InputComponent
              name="panNumber"
              control={control}
              label="Enter your PAN number"
              type="text"
              rules={{
                required: "PAN Number is required",
                pattern: {
                  value: /^[0-9]{5}$/,
                  message: "Invalid format",
                },
              }}
              variant="bordered"
              inputClassName="w-full rounded-xl"
            />

            {/* Pan Issue Date */}
            <InputComponent
              name="panIssueDate"
              control={control}
              label="Pan Issue Date"
              type="date"
              rules={{
                required: "PAN Issue Date is required",
              }}
              variant="bordered"
              inputClassName="w-full rounded-xl"
            />

            {/* Pan Issue Place */}
            <InputComponent
              name="panIssuePlace"
              control={control}
              label="Enter PAN issued place"
              type="text"
              rules={{
                required: "PAN Issue Place is required",
                pattern: {
                  value: /^[a-zA-Z ]{3,50}$/,
                  message: "Invalid format",
                },
              }}
              variant="bordered"
              inputClassName="w-full rounded-xl"
            />

            {/* PAN photo upload remains the same */}
            <div>
              <div>
                <label
                  className={`relative flex items-center justify-left w-full h-14 mt-4 border-2 ${
                    errors.panCardDocumentFile
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-xl cursor-pointer bg-white hover:bg-gray-200`}
                >
                  <span className="text-gray-600 px-4">
                    Upload Front photo of Pan Card
                  </span>
                  <input
                    type="file"
                    onChange={(e) => {
                      setValue("panCardDocumentFile", e.target.files[0]);
                      setPhotoPAN(false);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
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
                {photoPAN && (
                  <a
                    href={formData?.documents?.panCardDocumentFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-green-600 underline mb-2"
                  >
                    <span className="flex items-center gap-x-2">
                      <FaRegEye />
                      View Uploaded PAN Card
                    </span>
                  </a>
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
            <InputComponent
              name="citizenshipNumber"
              control={control}
              label="Enter Citizenship Number"
              type="text"
              rules={{
                required: "Citizenship Number is required",
                pattern: {
                  value: /^[0-9]{0,14}$/,
                  message: "Invalid format",
                },
              }}
              variant="bordered"
              inputClassName="w-full rounded-xl"
            />

            {/* Citizenship Issue Date */}
            <InputComponent
              name="issuedDate"
              control={control}
              label="Citizenship Issue Date"
              type="date"
              rules={{
                required: "Citizenship Issue Date is required",
              }}
              variant="bordered"
              inputClassName="w-full rounded-xl"
            />

            {/* Citizenship Issue Place */}
            <InputComponent
              name="isIssuedPlaceDistrict"
              control={control}
              label="Enter Citizenship Issued Place"
              type="text"
              rules={{
                required: "Citizenship Issue Place is required",
                pattern: {
                  value: /^[a-zA-Z ]{3,50}$/,
                  message: "Invalid format",
                },
              }}
              variant="bordered"
              inputClassName="w-full rounded-xl"
            />
          </div>

          {/* Citizenship Photos upload section remains the same */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {/* Citizenship Front Photo */}
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
                    Upload front Photo of citizenship
                  </span>
                  <input
                    type="file"
                    onChange={(e) => {
                      setValue(
                        "citizenshipFrontDocumentFile",
                        e.target.files[0]
                      );
                      setCitizenshipFront(false);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
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
                {citizenshipFront &&
                  (formData?.documents?.citizenshipFrontDocumentFile ? (
                    <a
                      href={formData?.documents?.citizenshipFrontDocumentFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-green-600 underline mb-2"
                    >
                      <span className="flex items-center gap-x-2">
                        <FaRegEye />
                        View Uploaded Front Side
                      </span>
                    </a>
                  ) : (
                    <div className="text-xs text-red-500">
                      No Links Available
                    </div>
                  ))}
              </div>
            </div>

            {/* Citizenship Back Photo */}
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
                    Upload back Photo of citizenship
                  </span>
                  <input
                    type="file"
                    onChange={(e) => {
                      setValue(
                        "citizenshipBackDocumentFile",
                        e.target.files[0]
                      );
                      setCitizenshipBack(false);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
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
                {citizenshipBack && (
                  <a
                    href={formData?.documents?.citizenshipBackDocumentFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-green-600 underline mb-2"
                  >
                    <span className="flex items-center gap-x-2">
                      <FaRegEye />
                      View Uploaded Back Side
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>

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

export default DocumentDetails;
