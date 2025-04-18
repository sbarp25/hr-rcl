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

const DocumentDetails = ({ formData, handleNext, handleBack, setFormData }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [citizenshipFront, setCitizenshipFront] = useState(false);
  const [citizenshipBack, setCitizenshipBack] = useState(false);
  const [photoPAN, setPhotoPAN] = useState(false);

  // Add new state to store the URLs
  const [documentUrls, setDocumentUrls] = useState({
    panCardDocumentUrl: null,
    citizenshipFrontDocumentUrl: null,
    citizenshipBackDocumentUrl: null,
  });

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
        toast.error(response.data.message);
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

  // Function to render the document link
  const renderDocumentLink = (url, label) => {
    if (!url) return null;

    return (
      <div className="mt-2 flex items-center">
        <FaRegEye className="text-green-500 mr-2" />
        <p
          onClick={onOpen}
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
                <InputComponent
                  name="panIssueDate"
                  control={control}
                  rules={{
                    required: "PAN Issue date is required",
                  }}
                  variant="bordered"
                  label="Pan Issue Date"
                  type="date"
                  inputClassName="w-full rounded-xl"
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
              <div>
                <Controller
                  name="panCardDocumentFile"
                  control={control}
                  rules={{
                    required: {
                      value: !documentUrls.panCardDocumentUrl,
                      message: "Pan Card photo is required",
                    },
                    validate: (file) => {
                      if (documentUrls.panCardDocumentUrl) return true;

                      return file
                        ? ["image/png", "image/jpeg", "image/jpg"].includes(
                            file.type
                          )
                          ? true
                          : "Only PNG or JPG allowed"
                        : "Pan Card photo is required";
                    },
                  }}
                  render={({ field: { onChange, value, ref } }) => (
                    <>
                      <label
                        className={`relative flex items-center justify-left w-full h-14 border-2 ${
                          formState.errors.panCardDocumentFile
                            ? "border-danger"
                            : "border-gray-300"
                        } rounded-xl cursor-pointer bg-white hover:bg-gray-200`}>
                        <span
                          className={` px-4 truncate ${
                            formState.errors.panCardDocumentFile
                              ? "text-danger"
                              : "text-gray-600"
                          }`}>
                          {value?.name || "Upload Front photo of Pan Card"}
                        </span>
                        <input
                          type="file"
                          accept=".png,.jpg, .jpeg"
                          ref={ref}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full"
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
                      </label>
                      {formState.errors.panCardDocumentFile && (
                        <p className="text-danger text-sm mt-1">
                          {formState.errors.panCardDocumentFile.message}
                        </p>
                      )}
                      <label className="text-xs text-gray-500 mt-1">
                        Please upload the image of type either PNG or JPG
                      </label>
                      {/* Add document link */}
                      {renderDocumentLink(
                        documentUrls.panCardDocumentUrl,
                        "PAN Card"
                      )}
                    </>
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
                <InputComponent
                  name="issuedDate"
                  control={control}
                  rules={{
                    required: "Citizenship Issue Date is required",
                  }}
                  variant="bordered"
                  label="Citizenship Issue Date"
                  type="date"
                  inputClassName="w-full rounded-xl"
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
              {/* validate: (file) => {
                      if (!file && documentUrls?.panCardDocumentUrl !== null) {
                        return true;
                      }

                      return file &&
                        ["image/png", "image/jpg"].includes(file.type)
                        ? true
                        : "Only PNG or JPG allowed";
                    }, */}
              <div>
                <Controller
                  name="citizenshipFrontDocumentFile"
                  control={control}
                  rules={{
                    required: {
                      value: !documentUrls.citizenshipFrontDocumentUrl,
                      message: "Citizenship front photo is required",
                    },
                    validate: (file) => {
                      if (documentUrls.citizenshipFrontDocumentUrl) return true;

                      return file
                        ? ["image/png", "image/jpeg", "image/jpg"].includes(
                            file.type
                          )
                          ? true
                          : "Only PNG or JPG allowed"
                        : "Citizenship front photo is required";
                    },
                  }}
                  render={({ field: { onChange, value, ref } }) => (
                    <>
                      <label
                        className={`relative flex items-center justify-left w-full h-14 border-2 ${
                          formState.errors.citizenshipFrontDocumentFile
                            ? "border-danger"
                            : "border-gray-300"
                        } rounded-xl cursor-pointer bg-white hover:bg-gray-200`}>
                        <span
                          className={`${
                            formState.errors.citizenshipFrontDocumentFile
                              ? "text-danger"
                              : "text-gray-600"
                          } px-4 truncate`}>
                          {value?.name || "Upload front Photo of citizenship"}
                        </span>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          ref={ref}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full"
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
                      </label>
                      {formState.errors.citizenshipFrontDocumentFile && (
                        <p className="text-danger text-sm mt-1">
                          {
                            formState.errors.citizenshipFrontDocumentFile
                              .message
                          }
                        </p>
                      )}
                      <label className="text-xs text-gray-500 mt-1">
                        Please upload the image of type either PNG or JPG
                      </label>
                      {/* Add document link */}
                      {renderDocumentLink(
                        documentUrls.citizenshipFrontDocumentUrl,
                        "Citizenship Front"
                      )}
                    </>
                  )}
                />
              </div>

              {/* Citizenship Back Photo */}
              <div>
                <Controller
                  name="citizenshipBackDocumentFile"
                  control={control}
                  rules={{
                    required: {
                      value: !documentUrls.citizenshipBackDocumentUrl,
                      message: "Citizenship back photo is required",
                    },
                    validate: (file) => {
                      if (documentUrls.citizenshipBackDocumentUrl) return true;

                      return file
                        ? ["image/png", "image/jpeg", "image/jpg"].includes(
                            file.type
                          )
                          ? true
                          : "Only PNG or JPG allowed"
                        : "Citizenship back photo is required";
                    },
                  }}
                  render={({ field: { onChange, value, ref } }) => (
                    <>
                      <label
                        className={`relative flex items-center justify-left w-full h-14 border-2 ${
                          formState.errors.citizenshipBackDocumentFile
                            ? "border-danger"
                            : "border-gray-300"
                        } rounded-xl cursor-pointer bg-white hover:bg-gray-200`}>
                        <span
                          className={`${
                            formState.errors.citizenshipBackDocumentFile
                              ? "text-danger"
                              : "text-gray-600"
                          } px-4 truncate`}>
                          {value?.name || "Upload back Photo of citizenship"}
                        </span>
                        <input
                          type="file"
                          accept=".png,.jpg"
                          ref={ref}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full"
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
                      </label>
                      {formState.errors.citizenshipBackDocumentFile && (
                        <p className="text-danger text-sm mt-1">
                          {formState.errors.citizenshipBackDocumentFile.message}
                        </p>
                      )}
                      <label className="text-xs text-gray-500 mt-1">
                        Please upload the image of type either PNG or JPG
                      </label>
                      {/* Add document link */}
                      {renderDocumentLink(
                        documentUrls.citizenshipBackDocumentUrl,
                        "Citizenship Back"
                      )}
                    </>
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
