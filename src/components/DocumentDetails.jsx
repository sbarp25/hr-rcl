import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios-Instance";
import { Button, Input } from "@nextui-org/react";
import { toast } from "react-toastify";
import ValidationComponent from "./ValidationComponent";
import { FaRegEye } from "react-icons/fa";
import Loader from "./Loader";

const DocumentDetails = ({ formData, handleNext, handleBack, setFormData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [citizenshipFront, setCitizenshipFront] = useState(false);
  const [citizenshipBack, setCitizenshipBack] = useState(false);
  const [photoPAN, setPhotoPAN] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case "panNumber":
        if (!value) return "PAN Number is Required";
        if (!/^[0-9]{0,16}$/.test(value)) return "Invalid format";
        return "";

      case "panIssueDate":
        return !value ? "PAN Issue date is required" : "";

      case "panIssuePlace":
        return !value ? "PAN Issue place is required" : "";

      case "panCardDocumentFile":
        return !value ? "PAN Photo is required" : "";

      case "citizenshipNumber":
        if (!value) return "Citizenship Number is required";
        if (!/^[0-9]{0,16}$/.test(value)) return "Invalid format";
        return "";

      case "isIssuedPlaceDistrict":
        return !value ? "Citizenship Issue place is required" : "";

      case "issuedDate":
        return !value ? "Citizenship Issue Date is required" : "";

      case "citizenshipFrontDocumentFile":
        return !value ? "Citizenship Front picture is Required" : "";

      case "citizenshipBackDocumentFile":
        return !value ? "Citizenship Back picture is required" : "";

      default:
        return "";
    }
  };

  // Handle field blur
  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    const value = formData.documents[field];
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  // Utility function to handle nested changes with validation
  const handleNestedChange = (parentKey, childKey, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [parentKey]: {
        ...prevState[parentKey],
        [childKey]: value,
      },
    }));

    // Mark field as touched and validate
    setTouched((prev) => ({
      ...prev,
      [childKey]: true,
    }));

    const error = validateField(childKey, value);
    setErrors((prev) => ({
      ...prev,
      [childKey]: error,
    }));

    // Reset file view states if needed
    if (childKey.includes("Document")) {
      setCitizenshipBack(false);
      setCitizenshipFront(false);
      setPhotoPAN(false);
    }
  };

  const validateFormData = () => {
    const documentFields = [
      "panNumber",
      "panIssuePlace",
      "panIssueDate",
      "panCardDocumentFile",
      "citizenshipNumber",
      "isIssuedPlaceDistrict",
      "issuedDate",
      "citizenshipFrontDocumentFile",
      "citizenshipBackDocumentFile",
    ];

    const newErrors = {};
    const newTouched = {};

    documentFields.forEach((field) => {
      newErrors[field] = validateField(field, formData.documents[field]);
      newTouched[field] = true;
    });

    setErrors(newErrors);
    setTouched(newTouched);

    return Object.values(newErrors).every((error) => !error);
  };

  const onSubmit = async () => {
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
      toast.error("Error saving document details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextSubmit = () => {
    if (validateFormData()) {
      onSubmit();
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
  }, [setFormData]);

  return (
    <>
      {isLoading && <Loader />}
      <ValidationComponent>
        <div className="space-y-4">
          {/* PAN Details Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-600 pt-4">
              PAN Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4">
              {/* PAN number */}
              <div>
                <Input
                  variant="bordered"
                  id="panNumber"
                  className={`w-full border-2 rounded-xl ${
                    touched.panNumber && errors.panNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  value={formData?.documents?.panNumber}
                  onChange={(e) =>
                    handleNestedChange("documents", "panNumber", e.target.value)
                  }
                  onBlur={() => handleBlur("panNumber")}
                  label="Enter your PAN number"
                />
                {touched.panNumber && errors.panNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.panNumber}
                  </p>
                )}
              </div>

              {/* PAN Issue Date */}
              <div>
                <Input
                  variant="bordered"
                  className={`w-full border-2 rounded-xl ${
                    touched.panIssueDate && errors.panIssueDate
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
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
                  onBlur={() => handleBlur("panIssueDate")}
                />
                {touched.panIssueDate && errors.panIssueDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.panIssueDate}
                  </p>
                )}
              </div>

              {/* PAN Issue Place */}
              <div>
                <Input
                  variant="bordered"
                  className={`w-full border-2 rounded-xl ${
                    touched.panIssuePlace && errors.panIssuePlace
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  value={formData.documents?.panIssuePlace}
                  onChange={(e) =>
                    handleNestedChange(
                      "documents",
                      "panIssuePlace",
                      e.target.value
                    )
                  }
                  onBlur={() => handleBlur("panIssuePlace")}
                  label="Enter PAN issued place"
                />
                {touched.panIssuePlace && errors.panIssuePlace && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.panIssuePlace}
                  </p>
                )}
              </div>

              {/* PAN photo */}
              <div>
                <div>
                  <label
                    className={`relative flex items-center justify-left w-full h-14 border-2 ${
                      touched.panCardDocumentFile && errors.panCardDocumentFile
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-xl cursor-pointer bg-white hover:bg-gray-200`}>
                    <span className="text-gray-600 px-4">
                      {formData?.documents?.panCardDocumentFile?.name ? (
                        <div className="flex gap-2">
                          <p>Choose a photo</p>
                          {formData.documents?.panCardDocumentFile?.name}
                        </div>
                      ) : (
                        "Upload Front photo of Pan Card"
                      )}
                    </span>
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full"
                      onChange={(e) => {
                        handleNestedChange(
                          "documents",
                          "panCardDocumentFile",
                          e.target.files[0]
                        );
                      }}
                      onBlur={() => handleBlur("panCardDocumentFile")}
                    />
                  </label>
                  {touched.panCardDocumentFile &&
                    errors.panCardDocumentFile && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.panCardDocumentFile}
                      </p>
                    )}
                </div>

                <div className="flex gap-x-4">
                  <label className="text-xs">
                    Please upload the image of type either PNG or jpg
                  </label>
                  {photoPAN && formData?.documents?.panCardDocumentFile && (
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
                  className={`w-full border-2 rounded-xl ${
                    touched.citizenshipNumber && errors.citizenshipNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  value={formData?.documents?.citizenshipNumber}
                  onChange={(e) =>
                    handleNestedChange(
                      "documents",
                      "citizenshipNumber",
                      e.target.value
                    )
                  }
                  onBlur={() => handleBlur("citizenshipNumber")}
                  label="Enter Citizenship Number"
                />
                {touched.citizenshipNumber && errors.citizenshipNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.citizenshipNumber}
                  </p>
                )}
              </div>

              {/* Citizenship Issue Date */}
              <div>
                <Input
                  variant="bordered"
                  className={`w-full border-2 rounded-xl ${
                    touched.issuedDate && errors.issuedDate
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
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
                  onBlur={() => handleBlur("issuedDate")}
                />
                {touched.issuedDate && errors.issuedDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.issuedDate}
                  </p>
                )}
              </div>

              {/* Citizenship Issue Place */}
              <div>
                <Input
                  variant="bordered"
                  type="text"
                  className={`w-full border-2 rounded-xl ${
                    touched.isIssuedPlaceDistrict &&
                    errors.isIssuedPlaceDistrict
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={formData.documents?.isIssuedPlaceDistrict}
                  onChange={(e) =>
                    handleNestedChange(
                      "documents",
                      "isIssuedPlaceDistrict",
                      e.target.value
                    )
                  }
                  onBlur={() => handleBlur("isIssuedPlaceDistrict")}
                  label="Enter Citizenship Issued Place"
                />
                {touched.isIssuedPlaceDistrict &&
                  errors.isIssuedPlaceDistrict && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.isIssuedPlaceDistrict}
                    </p>
                  )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {/* Citizenship Front Photo */}
              <div>
                <div>
                  <label
                    className={`relative flex items-center justify-left w-full h-14 border-2 ${
                      touched.citizenshipFrontDocumentFile &&
                      errors.citizenshipFrontDocumentFile
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-xl cursor-pointer bg-white hover:bg-gray-200`}>
                    <span className="text-gray-600 px-4">
                      {formData?.documents?.citizenshipFrontDocumentFile
                        ?.name ? (
                        <div className="flex gap-2">
                          <p>Choose a photo</p>
                          {
                            formData.documents?.citizenshipFrontDocumentFile
                              ?.name
                          }
                        </div>
                      ) : (
                        "Upload front Photo of citizenship"
                      )}
                    </span>
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full"
                      onChange={(e) => {
                        handleNestedChange(
                          "documents",
                          "citizenshipFrontDocumentFile",
                          e.target.files[0]
                        );
                      }}
                      onBlur={() => handleBlur("citizenshipFrontDocumentFile")}
                    />
                  </label>
                  {touched.citizenshipFrontDocumentFile &&
                    errors.citizenshipFrontDocumentFile && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.citizenshipFrontDocumentFile}
                      </p>
                    )}
                </div>

                <div className="flex gap-x-4">
                  <label className="text-xs">
                    Please upload the image of type either PNG or jpg
                  </label>
                  {citizenshipFront &&
                    formData?.documents?.citizenshipFrontDocumentFile && (
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
                    )}
                </div>
              </div>

              {/* Citizenship Back Photo */}
              <div>
                <div>
                  <label
                    className={`relative flex items-center justify-left w-full h-14 border-2 ${
                      touched.citizenshipBackDocumentFile &&
                      errors.citizenshipBackDocumentFile
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-xl cursor-pointer bg-white hover:bg-gray-200`}>
                    <span className="text-gray-600 px-4 truncate">
                      {formData?.documents?.citizenshipBackDocumentFile
                        ?.name ? (
                        <div className="flex gap-2">
                          <p>Choose a photo</p>
                          {formData.documents.citizenshipBackDocumentFile?.name}
                        </div>
                      ) : (
                        "Upload back Photo of citizenship"
                      )}
                    </span>
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleNestedChange(
                            "documents",
                            "citizenshipBackDocumentFile",
                            file
                          );
                        }
                      }}
                      onBlur={() => handleBlur("citizenshipBackDocumentFile")}
                    />
                  </label>
                  {touched.citizenshipBackDocumentFile &&
                    errors.citizenshipBackDocumentFile && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.citizenshipBackDocumentFile}
                      </p>
                    )}
                </div>

                <div className="flex gap-x-4">
                  <label className="text-xs">
                    Please upload the image of type either PNG or jpg
                  </label>
                  {citizenshipBack &&
                    formData?.documents?.citizenshipBackDocumentFile && (
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
                    )}
                </div>
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
