import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios-Instance";
import { Button, Input } from "@nextui-org/react";
import { toast } from "react-toastify";
import ValidationComponent from "./ValidationComponent";
import { FaRegEye } from "react-icons/fa";

const DocumentDetails = ({ formData, handleNext, handleBack, setFormData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [citizenshipFront, setCitizenshipFront] = useState(false);
  const [citizenshipBack, setCitizenshipBack] = useState(false);
  const [photoPAN, setPhotoPAN] = useState(false);
  const [errors, setErrors] = useState({});

  // Utility function to handle nested changes
  const handleNestedChange = (parentKey, childKey, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [parentKey]: {
        ...prevState[parentKey],
        [childKey]: value,
      },
    }));
    setCitizenshipBack(false), setCitizenshipFront(false), setPhotoPAN(false);
  };
  // const getPanNumberError = (value) => {
  //   if (!value) {
  //     return "Province must not be empty";
  //   }
  //   return null;
  // };
  // const getPanIssuePlaceError = (value) => {
  //   if (!value) {
  //     return "Province must not be empty";
  //   }
  //   return null;
  // };
  // const getCitizenNumberError = (value) => {
  //   if (!value) {
  //     return "Province must not be empty";
  //   }
  //   return null;
  // };
  // const getCitizenIssuePlaceError = (value) => {
  //   if (!value) {
  //     return "Province must not be empty";
  //   }
  //   return null;
  // };

  const validateFormData = () => {
    const newErrors = {};
    const {
      panNumber,
      panIssuePlace,
      panIssueDate,
      PanPhoto,
      citizenshipNumber,
      isIssuedPlaceDistrict,
      issuedDate,
      citizenshipFront,
      citizenshipBack,
    } = formData.documents;
    if (!panNumber) newErrors.panNumber = "PanNumber is Required";
    if (panNumber && !/^[0-9]{0,16}$/.test(panNumber)) {
      newErrors.panNumber = "Invalid format";
    }

    if (!panIssueDate) newErrors.panIssueDate = "pan Issued date is required";
    if (!panIssuePlace)
      newErrors.panIssuePlace = "Pan Issued place is required";
    if (!PanPhoto) newErrors.PanPhoto = "pan Photo is required";
    if (!citizenshipNumber)
      newErrors.citizenshipNumber = "Citizenship Number is required";
    if (citizenshipNumber && !/^[0-9]{0,16}$/.test(citizenshipNumber)) {
      newErrors.citizenshipNumber = "Invalid format";
    }
    if (!isIssuedPlaceDistrict)
      newErrors.citizenshipIssuedPlace = "Citizenship Issued place is required";
    if (!issuedDate)
      newErrors.issuedDate = "Citizenship Issued Date  is required";
    if (!citizenshipFront)
      newErrors.citizenshipFront = "Citizenship Front picture is Required";
    if (!citizenshipBack)
      newErrors.citizenshipBack = "Citizenship bacK picture is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const onSubmit = async () => {
    console.log("Pan Issue Date", formData?.documents?.panIssueDate);
    console.log("Citizenship Issue Date", formData?.documents?.issuedDate);
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
    if (validateFormData()) {
      onSubmit();
      handleNext();
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
      {/* {isLoading && <Loader />} */}
      <ValidationComponent>
        <div className="space-y-4">
          {/* PAN Details Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-600 pt-4">
              PAN Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-x-4">
              {/**PAN number */}
              <div>
                <Input
                  variant="bordered"
                  id="panNumber"
                  className={`w-full  border-2 rounded-xl ${
                    errors.panNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  value={formData?.documents?.panNumber}
                  onChange={(e) =>
                    handleNestedChange("documents", "panNumber", e.target.value)
                  }
                  label="Enter your PAN number"
                  //   className={${errors.panNumber  ? 'border-red-500':""}}
                />
                {errors.panNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.panNumber}
                  </p>
                )}
              </div>
              {/**Pan Issue Date */}
              <div className="">
                <Input
                  variant="bordered"
                  className={`w-full  border-2 rounded-xl ${
                    errors.panIssueDate ? "border-red-500" : "border-gray-300"
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
                />
                {errors.panIssueDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.panIssueDate}
                  </p>
                )}
              </div>
              {/**Pan Issue Place */}
              <div>
                <Input
                  variant="bordered"
                  className={`w-full  border-2 rounded-xl ${
                    errors.panIssuePlace ? "border-red-500" : "border-gray-300"
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
                  label="Enter PAN issued place"
                />
                {errors.panIssuePlace && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.panIssuePlace}
                  </p>
                )}
              </div>
              {/**PAN photo */}
              <div>
                <div>
                  <label
                    className={`relative flex items-center justify-left w-full h-14 border-3  ${
                      errors.PanPhoto ? "border-red-500" : "border-gray-300"
                    }  rounded-xl  cursor-pointer bg-white hover:bg-gray-200 `}>
                    <span className="text-gray-600 px-4">
                      {formData?.documents?.panCardDocumentFile?.name ? (
                        <div className="flex gap-2">
                          <p>Choose a photo</p>
                          {formData.documents?.panCardDocumentFile?.name}
                        </div>
                      ) : (
                        "Upload Front photo of Pan Card "
                      )}
                    </span>
                    <input
                      type="file"
                      className={`absolute inset-0 opacity-0 cursor-pointer w-full border-2 rounded-xl  ${
                        errors.PanPhoto ? "border-red-500" : "border-gray-300"
                      }`}
                      onChange={(e) => {
                        handleNestedChange(
                          "documents",
                          "panCardDocumentFile",
                          e.target.files[0]
                        );
                      }}
                    />
                  </label>
                  {errors.PanPhoto && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.PanPhoto}
                    </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/**Citizenship Number */}
              <div>
                <Input
                  variant="bordered"
                  className={`w-full  border-2 rounded-xl ${
                    errors.citizenshipNumber
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
                  label="Enter Citizenship Number"
                />
                {errors.citizenshipNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.citizenshipNumber}
                  </p>
                )}
              </div>
              {/**Citizenship Issue Date */}
              <div>
                <Input
                  variant="bordered"
                  className={`w-full  border-2 rounded-xl ${
                    errors.issuedDate ? "border-red-500" : "border-gray-300"
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
                />
                {errors.issuedDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.issuedDate}
                  </p>
                )}
              </div>
              {/**Citizenship Issue Place */}
              <div>
                <Input
                  variant="bordered"
                  type="text"
                  className={`w-full  border-2 rounded-xl ${
                    errors.citizenshipIssuedPlace
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
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
                {errors.citizenshipIssuedPlace && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.citizenshipIssuedPlace}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {/**Citizenship Front Photo */}
              <div>
                <div>
                  <label
                    className={`relative flex items-center justify-left w-full h-14 border-2   ${
                      errors.citizenshipFront
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-xl  cursor-pointer bg-white hover:bg-gray-200 `}>
                    <span className="text-gray-600 px-4">
                      {/* Upload Front photo of citizenship */}
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
                      className={`absolute inset-0 opacity-0 cursor-pointer w-full border-2 rounded-xl  ${
                        errors.citizenshipFront
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      onChange={(e) => {
                        handleNestedChange(
                          "documents",
                          "citizenshipFrontDocumentFile",
                          e.target.files[0]
                        );
                      }}
                    />
                  </label>

                  {errors.citizenshipFront && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.citizenshipFront}
                    </p>
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
              {/**Citizenship Back Photo */}
              <div>
                <div>
                  <label
                    className={`relative flex items-center justify-left w-full h-14 border-2  ${
                      errors.citizenshipBack
                        ? "border-red-500"
                        : "border-gray-300"
                    }  rounded-xl  cursor-pointer bg-white hover:bg-gray-200`}>
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
                      className={`absolute inset-0 opacity-0 cursor-pointer w-full border-2 rounded-xl ${
                        errors.citizenshipBack
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
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
                    />
                  </label>
                  {errors.citizenshipBack && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.citizenshipBack}
                    </p>
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
