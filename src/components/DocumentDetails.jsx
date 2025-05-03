import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios-Instance";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import ValidationComponent from "./ValidationComponent";
import { FaRegEye } from "react-icons/fa";
import Loader from "./Loader";
import InputComponent from "./InputComponent";
import { useForm, Controller } from "react-hook-form";
import DatepickerComponent from "./DatepickerComponent";
import { CiImageOn } from "react-icons/ci";
import { IoMdImage } from "react-icons/io";
const DocumentDetails = ({ formData, handleNext, handleBack, setFormData }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [citizenshipFront, setCitizenshipFront] = useState(false);
  const [citizenshipBack, setCitizenshipBack] = useState(false);
  const [photoPAN, setPhotoPAN] = useState(false);
  const [citizenshipFrontModalOpen, setCitizenshipFrontModalOpen] =
    useState(false);
  const [citizenshipBackModalOpen, setCitizenshipBackModalOpen] =
    useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  // Add new state to store the URLs
  const [documentUrls, setDocumentUrls] = useState({
    panCardDocumentUrl: null,
    citizenshipFrontDocumentUrl: null,
    citizenshipBackDocumentUrl: null,
  });
  const MAX_FILE_SIZE = 1024 * 1024;
  const { control, handleSubmit, setValue, formState } = useForm({
    mode: "onBlur",
    defaultValues: {
      panNumber: formData?.documents?.panNumber || "",
      panIssuePlace: formData?.documents?.panIssuePlace || "",
      panIssueDate: formData?.documents?.panIssueDate || "",
      panCardDocumentFile: formData?.documents?.panCardDocumentFile || null,
      citizenshipNumber: formData?.documents?.citizenshipNumber || "",
      isIssuedPlaceDistrict: formData?.documents?.isIssuedPlaceDistrict || "",
      issuedDate: formData?.documents?.issuedDate || "",
      citizenshipFrontDocumentFile:
        formData?.documents?.citizenshipFrontDocumentFile || null,
      citizenshipBackDocumentFile:
        formData?.documents?.citizenshipBackDocumentFile || null,
    },
  });

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

          // Set form values
          setValue("panNumber", data.panNumber || "");
          setValue("panIssuePlace", data.panIssuePlace || "");
          setValue("panIssueDate", data.panIssueDate || "");
          setValue("panCardDocumentFile", data.panCardDocumentUrl || null);
          setValue("citizenshipNumber", data.citizenshipNumber || "");
          setValue(
            "isIssuedPlaceDistrict",
            data.citizenshipIssuedPlaceDistrict || ""
          );
          setValue("issuedDate", data.citizenshipIssueDate || "");
          setValue(
            "citizenshipFrontDocumentFile",
            data.citizenshipFrontDocumentUrl || null
          );
          setValue(
            "citizenshipBackDocumentFile",
            data.citizenshipBackDocumentUrl || null
          );

          // Store document URLs in state
          setDocumentUrls({
            panCardDocumentUrl: data.panCardDocumentUrl || null,
            citizenshipFrontDocumentUrl:
              data.citizenshipFrontDocumentUrl || null,
            citizenshipBackDocumentUrl: data.citizenshipBackDocumentUrl || null,
          });

          // Update formData state to maintain compatibility
          setFormData((prev) => ({
            ...prev,
            documents: {
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
            },
          }));

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
  }, [setValue, setFormData]);

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

      if (response.data.responseCode === "200") {
        toast.success(response.data.message);

        // Update formData to maintain state consistency
        setFormData((prev) => ({
          ...prev,
          documents: {
            ...data,
          },
        }));

        handleNext();
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error saving document details:", error);
      toast.error("Error saving document details.");
    } finally {
      setIsLoading(false);
    }
  };

  // // Custom file input handler
  // const handleFileChange = (e, fieldName) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setValue(fieldName, file, { shouldValidate: true });

  //     // Reset file view states
  //     if (fieldName === "panCardDocumentFile") {
  //       setPhotoPAN(false);
  //     } else if (fieldName === "citizenshipFrontDocumentFile") {
  //       setCitizenshipFront(false);
  //     } else if (fieldName === "citizenshipBackDocumentFile") {
  //       setCitizenshipBack(false);
  //     }

  //     // Update formData to maintain state consistency
  //     setFormData((prev) => ({
  //       ...prev,
  //       documents: {
  //         ...prev.documents,
  //         [fieldName]: file,
  //       },
  //     }));
  //   }
  // };

  const validateFile = (file, existingUrl) => {
    // If we already have a file URL from the API, skip validation
    if (existingUrl) return true;

    // If no file is selected, it will be handled by the required validator
    if (!file) return true;

    // Check file type
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      return "Only PNG or JPG allowed";
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 1MB";
    }

    return true;
  };
  // Function to render the document link
  const renderDocumentLink = (url, label, isOpen, onOpenChange) => {
    if (!url) return null;

    return (
      <div className="mt-2 flex items-center">
        <FaRegEye className="text-green-500 mr-2" />
        <p
          onClick={() => onOpenChange(true)}
          className="text-green-500 hover:text-green-700 text-sm">
          View {label}
        </p>
        {/* <Button onPress={onOpen}>Open Modal</Button> */}
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          // size="5xl"
          // placement="bottom"
          //  backdrop="blur">
          isDismissable={true}
          isKeyboardDismissDisabled={false}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  <div className="h-full w-full">
                    <img src={url} />
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
        {/* <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-500 hover:text-green-700 text-sm">
          View {label}
        </a> */}
      </div>
    );
  };

  return (
    <>
      {isLoading && <Loader />}
      <ValidationComponent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* PAN Details Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-600 pt-4">
              PAN Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 space-y-2">
              {/* PAN number */}
              <div>
                <InputComponent
                  name="panNumber"
                  control={control}
                  rules={{
                    required: "PAN Number is Required",
                    pattern: {
                      value: /^[0-9]{0,16}$/,
                      message: "Invalid format",
                    },
                  }}
                  variant="bordered"
                  label="Enter your PAN number"
                  type="text"
                  inputClassName="w-full rounded-2xl"
                />
              </div>
              {/* PAN Issue Date */}
              <div>
                <DatepickerComponent
                  name="panIssueDate"
                  label="Pan Issue Date(A.D) "
                  control={control}
                  rules={{
                    required: "PAN Issue date is required",
                  }}
                />
              </div>

              {/* PAN Issue Place */}
              <div>
                <InputComponent
                  name="panIssuePlace"
                  control={control}
                  rules={{
                    required: "PAN Issue place is required",
                  }}
                  variant="bordered"
                  label="Enter PAN issued place"
                  type="text"
                  inputClassName="w-full rounded-xl"
                />
              </div>

              {/* PAN photo */}
              <div className="w-full">
                <Controller
                  name="panCardDocumentFile"
                  control={control}
                  rules={{
                    required: {
                      value: !documentUrls.panCardDocumentUrl,
                      message: "Pan Card photo is required",
                    },
                    validate: (file) =>
                      validateFile(file, documentUrls.panCardDocumentUrl),
                  }}
                  render={({ field: { onChange, value, ref } }) => (
                    <div className="space-y-2">
                      <div className="relative">
                        {/* Input styled like text input */}
                        <div
                          className={`relative flex items-center w-full ${
                            formState.errors.panCardDocumentFile
                              ? "border-danger"
                              : value?.name || documentUrls.panCardDocumentUrl
                          } border-2 rounded-2xl p-2 overflow-hidden `}>
                          {/* Left icon */}
                          <CiImageOn className="text-3xl text-gray-400" />

                          {/* Text area (fake input) */}
                          <div className="flex-1 px-2 py-2.5">
                            <span
                              className={`text-sm ${
                                value?.name || documentUrls.panCardDocumentUrl
                                  ? "text-gray-700 font-medium"
                                  : "text-gray-500"
                              } truncate block`}>
                              {value?.name
                                ? value.name
                                : documentUrls.panCardDocumentUrl
                                ? "File uploaded successfully"
                                : "Upload Front photo of Pan Card"}
                            </span>
                          </div>

                          {/* Browse button */}
                          <div className="pr-1">
                            <button
                              type="button"
                              className="bg-gray-100 py-1.5 px-3 border-l text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none"
                              onClick={() => {
                                // This is just for visual feedback, the actual input is below
                              }}>
                              Browse
                            </button>
                          </div>

                          {/* Hidden file input */}
                          <input
                            type="file"
                            accept=".png,.jpg,.jpeg"
                            ref={ref}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              onChange(file);
                              setPhotoPAN(false);
                              setFormData((prev) => ({
                                ...prev,
                                documents: {
                                  ...prev.documents,
                                  panCardDocumentFile: file,
                                },
                              }));
                            }}
                          />
                        </div>

                        {/* Error message */}
                        {formState.errors.panCardDocumentFile && (
                          <p className="mt-1 text-sm text-danger">
                            {formState.errors.panCardDocumentFile.message}
                          </p>
                        )}

                        {/* Help text */}
                        <p className="mt-1 text-xs text-gray-500">
                          Please upload PNG or JPG image under 1 MB
                        </p>

                        {/* Document link (if available) */}
                        {documentUrls.panCardDocumentUrl && (
                          <div className="mt-2">
                            {renderDocumentLink(
                              documentUrls.panCardDocumentUrl,
                              "PAN Card",
                              photoModalOpen,
                              setPhotoModalOpen
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                />
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
                <InputComponent
                  name="citizenshipNumber"
                  control={control}
                  rules={{
                    required: "Citizenship Number is required",
                    pattern: {
                      value: /^[0-9]{0,16}$/,
                      message: "Invalid format",
                    },
                  }}
                  variant="bordered"
                  label="Enter Citizenship Number"
                  type="text"
                  inputClassName="w-full rounded-xl"
                />
              </div>

              {/* Citizenship Issue Date */}
              <div>
                <DatepickerComponent
                  name="issuedDate"
                  label="Citizenship Issue Date(A.D)"
                  control={control}
                  rules={{
                    required: "Citizenship Issue Date is required",
                  }}
                />
              </div>
              {/* Citizenship Issue Place */}
              <div>
                <InputComponent
                  name="isIssuedPlaceDistrict"
                  control={control}
                  rules={{
                    required: "Citizenship Issue place is required",
                  }}
                  variant="bordered"
                  label="Enter Citizenship Issued Place"
                  type="text"
                  inputClassName="w-full rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {/* Citizenship Front Photo */}

              <div className="w-full">
                <Controller
                  name="citizenshipFrontDocumentFile"
                  control={control}
                  rules={{
                    required: {
                      value: !documentUrls.citizenshipFrontDocumentUrl,
                      message: "Citizenship front photo is required",
                    },
                    validate: (file) =>
                      validateFile(
                        file,
                        documentUrls.citizenshipFrontDocumentUrl
                      ),
                  }}
                  render={({ field: { onChange, value, ref } }) => (
                    <div className="space-y-2">
                      <div className="relative">
                        {/* Styled input */}
                        <div
                          className={`relative flex items-center w-full ${
                            formState.errors.citizenshipFrontDocumentFile
                              ? "border-danger"
                              : value?.name ||
                                documentUrls.citizenshipFrontDocumentUrl
                              ? "border-gray-300"
                              : "border-gray-300"
                          } border-2 rounded-2xl p-2 overflow-hidden`}>
                          {/* Left icon */}
                          <CiImageOn className="text-3xl text-gray-400" />

                          {/* Text area */}
                          <div className="flex-1 px-2 py-2.5">
                            <span
                              className={`text-sm ${
                                value?.name ||
                                documentUrls.citizenshipFrontDocumentUrl
                                  ? "text-gray-700 font-medium"
                                  : "text-gray-500"
                              } truncate block`}>
                              {value?.name
                                ? value.name
                                : documentUrls.citizenshipFrontDocumentUrl
                                ? "File uploaded successfully"
                                : "Upload Front photo of Citizenship"}
                            </span>
                          </div>

                          {/* Browse button */}
                          <div className="pr-1">
                            <button
                              type="button"
                              className="bg-gray-100 py-1.5 px-3 border-l text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none">
                              Browse
                            </button>
                          </div>

                          {/* Hidden input */}
                          <input
                            type="file"
                            accept=".png,.jpg,.jpeg"
                            ref={ref}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              onChange(file);
                              setCitizenshipFront(false);
                              setFormData((prev) => ({
                                ...prev,
                                documents: {
                                  ...prev.documents,
                                  citizenshipFrontDocumentFile: file,
                                },
                              }));
                            }}
                          />
                        </div>

                        {/* Error message */}
                        {formState.errors.citizenshipFrontDocumentFile && (
                          <p className="mt-1 text-sm text-danger">
                            {
                              formState.errors.citizenshipFrontDocumentFile
                                .message
                            }
                          </p>
                        )}

                        {/* Help text */}
                        <p className="mt-1 text-xs text-gray-500">
                          Please upload PNG or JPG image under 1 MB
                        </p>

                        {/* Document link */}
                        {documentUrls.citizenshipFrontDocumentUrl && (
                          <div className="mt-2">
                            {renderDocumentLink(
                              documentUrls.citizenshipFrontDocumentUrl,
                              "Citizenship Front",
                              citizenshipFrontModalOpen,
                              setCitizenshipFrontModalOpen
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                />
              </div>

              {/* Citizenship Back Photo */}
              <div className="w-full">
                <Controller
                  name="citizenshipBackDocumentFile"
                  control={control}
                  rules={{
                    required: {
                      value: !documentUrls.citizenshipBackDocumentUrl,
                      message: "Citizenship back photo is required",
                    },
                    validate: (file) =>
                      validateFile(
                        file,
                        documentUrls.citizenshipBackDocumentUrl
                      ),
                  }}
                  render={({ field: { onChange, value, ref } }) => (
                    <div className="space-y-2">
                      <div className="relative">
                        {/* Styled input container */}
                        <div
                          className={`relative flex items-center w-full ${
                            formState.errors.citizenshipBackDocumentFile
                              ? "border-danger"
                              : value?.name ||
                                documentUrls.citizenshipBackDocumentUrl
                              ? "border-gray-300"
                              : "border-gray-300"
                          } border-2 rounded-2xl p-2 overflow-hidden`}>
                          {/* Icon */}
                          <CiImageOn className="text-3xl text-gray-400" />

                          {/* Text display */}
                          <div className="flex-1 px-2 py-2.5">
                            <span
                              className={`text-sm ${
                                value?.name ||
                                documentUrls.citizenshipBackDocumentUrl
                                  ? "text-gray-700 font-medium"
                                  : "text-gray-500"
                              } truncate block`}>
                              {value?.name
                                ? value.name
                                : documentUrls.citizenshipBackDocumentUrl
                                ? "File uploaded successfully"
                                : "Upload Back photo of Citizenship"}
                            </span>
                          </div>

                          {/* Browse button (visual only) */}
                          <div className="pr-1">
                            <button
                              type="button"
                              className="bg-gray-100 py-1.5 px-3 border-l text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none">
                              Browse
                            </button>
                          </div>

                          {/* Hidden file input */}
                          <input
                            type="file"
                            accept=".png,.jpg"
                            ref={ref}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              onChange(file);
                              setCitizenshipBack(false);
                              setFormData((prev) => ({
                                ...prev,
                                documents: {
                                  ...prev.documents,
                                  citizenshipBackDocumentFile: file,
                                },
                              }));
                            }}
                          />
                        </div>

                        {/* Error message */}
                        {formState.errors.citizenshipBackDocumentFile && (
                          <p className="mt-1 text-sm text-danger">
                            {
                              formState.errors.citizenshipBackDocumentFile
                                .message
                            }
                          </p>
                        )}

                        {/* Help text */}
                        <p className="mt-1 text-xs text-gray-500">
                          Please upload PNG or JPG image under 1 MB
                        </p>

                        {/* Document link */}
                        {documentUrls.citizenshipBackDocumentUrl && (
                          <div className="mt-2">
                            {renderDocumentLink(
                              documentUrls.citizenshipBackDocumentUrl,
                              "Citizenship Back",
                              citizenshipBackModalOpen,
                              setCitizenshipBackModalOpen
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="form-navigation flex justify-between mt-6">
              <Button
                onPress={handleBack}
                className="px-4 py-2 bg-gray-300 rounded"
                type="button">
                Back
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </ValidationComponent>
    </>
  );
};

export default DocumentDetails;
