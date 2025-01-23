import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios-Instance";
import { Button, Input } from "@nextui-org/react";
import { toast } from "react-toastify";
import ValidationComponent from "./ValidationComponent";
import Loader from "./Loader";
import { FaRegEye } from "react-icons/fa";
import Inputcomp from "./Inputcomp";
const DocumentDetails = ({ formData, handleNext, handleBack, setFormData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [citizenshipFront, setCitizenshipFront] = useState(false);
  const [citizenshipBack, setCitizenshipBack] = useState(false);
  const [photoPAN, setPhotoPAN] = useState(false);
  const [error, setError] = useState(false);

  // Utility function to handle nested changes
  const handleNestedChange = (section, subSection, field, value) => {
    // Define validation rules
    const validateField = (field, value) => {
      const errors = {};
      if (field === "panNumber" && !value) {
        errors[field] = "Pan number is required";
      }
      if (field === "panIssueDate" && !value) {
        errors[field] = "Issue Date is required";
      }
      if (field === "panIssuePlace" && !value) {
        errors[field] = "Issue Place is required ";
      }
      if (field === "citizenshipNumber" && !value) {
        errors[field] = "Citizenship Number is required.";
      }
      if (field === "issuedDate" && !value) {
        errors[field] = "Issue Date is required.";
      }
      if (field === "isIssuedPlaceDistrict" && !value) {
        errors[field] = "Issue Place is required.";
      }
      if (field === "citizenshipFrontDocumentFile" && !value) {
        errors[field] = "Photo of Citizernship is required.";
      }
      if (field === "citizenshipBackDocumentFile" && !value) {
        errors[field] = "Photo of Citizernship is required.";
      }
      if (field === "panCardDocumentFile" && !value) {
        errors[field] = "Photo of PAN card is required.";
      }

      return errors;
    };

    // Perform validation
    const fieldErrors = validateField(field, value);

    // Update errors
    setError((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (!fieldErrors[field]) {
        // Clear the error if validation passes
        delete newErrors[field];
      } else {
        // Update the error if validation fails
        newErrors[field] = fieldErrors[field];
      }
      return newErrors;
    });

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setCitizenshipBack(false), setCitizenshipFront(false), setPhotoPAN(false);
  };
  const validateAllFields = () => {
    const errors = {};
    const docs = formData?.documents || {};

    if (!docs.panNumber) {
      errors.panNumber = "PAN number  is required.";
    }
    if (!docs.panIssueDate) {
      errors.panIssueDate = "Issue date is required.";
    }
    if (!docs.panIssuePlace) {
      errors.panIssuePlace = "Issue Place is required.";
    }
    if (!docs.citizenshipNumber) {
      errors.citizenshipNumber = "Citizenship number is required.";
    }
    if (!docs.issuedDate) {
      errors.issuedDate = "Issue date is required.";
    }
    if (!docs.isIssuedPlaceDistrict) {
      errors.isIssuedPlaceDistrict = "Issued Place is required.";
    }
    if (!docs.guardianRelation) {
      errors.guardianRelation = "Guardian Relation  is required";
    }
    if (!docs.citizenshipFrontDocumentFile) {
      errors.citizenshipFrontDocumentFile = "Guardian Name is required";
    }
    if (!docs.citizenshipBackDocumentFile) {
      errors.citizenshipBackDocumentFile = "Phone Number  is required";
    }
    if (!docs.panCardDocumentFile) {
      errors.panCardDocumentFile = "Guardian Relation is required";
    }
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async () => {
    if (!validateAllFields()) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const formDataToSubmit = new FormData();

    // Append form data
    formDataToSubmit.append("panNumber", formData?.documents?.panNumber);
    formDataToSubmit.append("panIssueDate", formData?.documents?.panIssueDate);
    formDataToSubmit.append(
      "panIssuePlace",
      formData?.documents?.panIssuePlace
    );
    formDataToSubmit.append(
      "citizenshipNumber",
      formData?.documents?.citizenshipNumber
    );
    formDataToSubmit.append(
      "citizenshipIssueDate",
      formData?.documents?.issuedDate
    );
    formDataToSubmit.append(
      "citizenshipIssuedPlaceDistrict",
      formData?.documents?.isIssuedPlaceDistrict
    );

    // Append Files
    if (formData?.documents?.citizenshipFrontDocumentFile instanceof File) {
      formDataToSubmit.append(
        "citizenshipFrontDocumentFile",
        formData?.documents?.citizenshipFrontDocumentFile
      );
    }
    if (formData?.documents?.citizenshipBackDocumentFile instanceof File) {
      formDataToSubmit.append(
        "citizenshipBackDocumentFile",
        formData?.documents?.citizenshipBackDocumentFile
      );
    }
    if (formData?.documents?.panCardDocumentFile instanceof File) {
      formDataToSubmit.append(
        "panCardDocumentFile",
        formData?.documents?.panCardDocumentFile
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
        handleNext();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error saving document details:", error);
      toast.error("Error saving document details.", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextSubmit = () => {
    onSubmit();
    // handleNext();
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

          setFormData((prev) => ({
            ...prev,
            documents: {
              panNumber: data.panNumber || "",
              panIssuePlace: data.panIssuePlace || "",
              citizenshipNumber: data.citizenshipNumber || "",
              panIssueDate: data.panIssueDate || "",
              citizenshipIssueDate: data.citizenshipIssueDate || "",
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
        } else {
          console.error(
            "Failed to fetch document details:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching document details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [setFormData]);

  return (
    <>
      {isLoading && <Loader />}
      <ValidationComponent>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">
            Document Details
          </h2>

          {/* PAN Details Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-600">PAN Details</h3>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="flex flex-col items-center">
                <Inputcomp
                  id="panNumber"
                  variant="bordered"
                  type="text"
                  value={formData?.documents?.panNumber}
                  onChange={(e) =>
                    handleNestedChange("documents", "panNumber", e.target.value)
                  }
                  label="Enter your PAN number"
                />
                {error.panNumber && (
                  <span className="text-red-500 text-xs mt-1">
                    {error.panNumber}
                  </span>
                )}
              </div>
              <div className=" flex flex-col items-center">
                <Inputcomp
                  className="h-[10vh]"
                  variant="bordered"
                  type="date"
                  label="Pan Issue Date"
                  value={formData.documents?.panIssueDate}
                  onChange={(e) =>
                    handleNestedChange(
                      "documents",
                      "panIssueDate",
                      e.target.value
                    )
                  }
                />
                {error.panIssueDate && (
                  <span className="text-red-500 text-xs mt-1">
                    {error.panIssueDate}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <Inputcomp
                  variant="bordered"
                  type="text"
                  value={formData.documents?.panIssuePlace}
                  onChange={(e) =>
                    handleNestedChange(
                      "documents",
                      "panIssuePlace",
                      e.target.value
                    )
                  }
                  label="Enter PAN issued place"
                />
                {error.panIssuePlace && (
                  <span className="text-red-500 text-xs mt-1">
                    {error.panIssuePlace}
                  </span>
                )}
              </div>
              <div>
                <div className="flex flex-col items-center">
                  <Inputcomp
                    variant="bordered"
                    type="file"
                    onChange={(e) =>
                      handleNestedChange(
                        "documents",
                        "panCardDocumentFile",
                        e.target.files[0]
                      )
                    }
                    label="Enter PAN issued place"
                  />
                  {error.panCardDocumentFile && (
                    <span className="text-red-500 text-xs mt-1">
                      {error.panCardDocumentFile}
                    </span>
                  )}
                </div>

                <div className="flex gap-x-4">
                  <label className="text-xs">
                    Please upload the image of type either PNG or jpg
                  </label>
                  {photoPAN &&
                    (formData?.documents?.panCardDocumentFile ? (
                      <a
                        href={formData.documents?.panCardDocumentFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-green-600 underline mb-2">
                        <span className="flex items-center gap-x-2">
                          <FaRegEye />
                          View Uploaded PAN Card
                        </span>
                      </a>
                    ) : (
                      <div className="text-xs text-red-500">
                        No Links Available
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Citizenship Details Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-600">
              Citizenship Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <Inputcomp
                  variant="bordered"
                  type="text"
                  value={formData?.documents?.citizenshipNumber}
                  onChange={(e) =>
                    handleNestedChange(
                      "documents",
                      "citizenshipNumber",
                      e.target.value
                    )
                  }
                  label="Enter Citizenship Number"
                />
                {error.citizenshipNumber && (
                  <span className="text-red-500 text-xs mt-1">
                    {error.citizenshipNumber}
                  </span>
                )}
              </div>
              <div className=" flex flex-col items-center">
                <Inputcomp
                  variant="bordered"
                  type="date"
                  label="Citizenship Issue Date"
                  value={formData?.documents?.issuedDate}
                  onChange={(e) =>
                    handleNestedChange(
                      "documents",
                      "issuedDate",
                      e.target.value
                    )
                  }
                />
                {error.issuedDate && (
                  <span className="text-red-500 text-xs mt-1">
                    {error.issuedDate}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className=" flex flex-col items-center">
                <Inputcomp
                  type="text"
                  variant="bordered"
                  value={formData?.documents?.isIssuedPlaceDistrict}
                  onChange={(e) =>
                    handleNestedChange(
                      "documents",
                      "isIssuedPlaceDistrict",
                      e.target.value
                    )
                  }
                  label="Enter Citizenship Issued Place"
                />
                {error.isIssuedPlaceDistrict && (
                  <span className="text-red-500 text-xs mt-1">
                    {error.isIssuedPlaceDistrict}
                  </span>
                )}
              </div>
              <div>
                <div className="flex flex-col items-center">
                  <Input
                    type="file"
                    variant="bordered"
                    onChange={(e) => {
                      handleNestedChange(
                        "documents",
                        "citizenshipFrontDocumentFile",
                        e.target.files[0]
                      );
                    }}
                    label="Citizenship Front Photo"
                  />
                  {error.citizenshipFrontDocumentFile && (
                    <span className="text-red-500 text-xs mt-1">
                      {error.citizenshipFrontDocumentFile}
                    </span>
                  )}
                </div>

                <div className="flex gap-x-4">
                  <label className="text-xs">
                    Please upload the image of type either PNG or jpg
                  </label>
                  {citizenshipFront &&
                    (formData?.documents?.citizenshipFrontDocumentFile ? (
                      <a
                        href={formData?.documents?.citizenshipFrontDocumentFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-green-600 underline mb-2">
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
            </div>
            <div>
              <div className="flex flex-col items-center">
                <Inputcomp
                  variant="bordered"
                  type="file"
                  onChange={(e) =>
                    handleNestedChange(
                      "documents",
                      "citizenshipBackDocumentFile",
                      e.target.files[0]
                    )
                  }
                  label="Citizenship Back Photo "
                />
                {error.citizenshipBackDocumentFile && (
                  <span className="text-red-500 text-xs mt-1">
                    {error.citizenshipBackDocumentFile}
                  </span>
                )}
              </div>

              <div className="flex gap-x-4">
                <lable className="text-xs">
                  Please upload the image of type either PNG or jpg
                </lable>
                {citizenshipBack &&
                  (formData?.documents?.citizenshipBackDocumentFile ? (
                    <a
                      href={formData?.documents?.citizenshipBackDocumentFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-green-600 underline mb-2">
                      <span className="flex items-center gap-x-2">
                        <FaRegEye />
                        View Uploaded Back Side
                      </span>
                    </a>
                  ) : (
                    <div className="text-xs text-red-500">
                      No Links Available
                    </div>
                  ))}
              </div>
            </div>
            <div className="form-navigation flex justify-between mt-6">
              <Button
                onPress={handleBack}
                className="px-4 py-2 bg-gray-300 rounded">
                Back
              </Button>
              <Button
                onPress={handleNextSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </ValidationComponent>
    </>
  );
};

export default DocumentDetails;
