import { Divider, Form } from "@nextui-org/react";
import { FaRegEye } from "react-icons/fa6";
import EkyeDetailsComponent from "../../ui/EkyeDetailsComponent.jsx";
import { useEffect, useState } from "react";
import UnderlineComponent from "../../ui/UnderlineComponent.jsx";

const DocumentAction = ({ employeeData }) => {
  const [citizenshipFront, setCitizenshipFront] = useState(false);
  const [citizenshipBack, setCitizenshipBack] = useState(false);
  const [photoPAN, setPhotoPAN] = useState(false);

  useEffect(() => {
    if (employeeData?.userDocument?.citizenshipFrontDocumentUrl) {
      setCitizenshipFront(true);
    }
    if (employeeData?.userDocument?.citizenshipBackDocumentUrl) {
      setCitizenshipBack(true);
    }
    if (employeeData?.userDocument?.panCardDocumentUrl) {
      setPhotoPAN(true);
    }
  }, [employeeData]);
  return (
    <div className="relative flex flex-col bg-white mt-16 border border-black rounded-b-md shadow-lg px-8">
      {/* Header Section */}
      <div className="absolute bg-black w-auto rounded-t-2xl -top-12   -left-0.5  px-6 py-2">
        <h1 className="text-2xl font-semibold text-white">Document Details</h1>
      </div>

      {/* Single Form Section */}
      <Form className="grid grid-cols-1 gap-12">
        {/* Citizenship Details Section */}
        <div className="bg-white text-lg p-6 rounded-lg">
          <h1 className="text-xl font-semibold flex mb-6">
            <span className="relative">
              Citizenship Details
              <UnderlineComponent />
            </span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/**Citizenship Number */}
            <EkyeDetailsComponent
              label="Citizenship Number"
              placeholder={
                employeeData?.userDocument?.citizenshipNumber || "N/A"
              }
            />
            {/**Citizenship Issue Date */}
            <EkyeDetailsComponent
              label="Issued Date"
              placeholder={
                employeeData?.userDocument?.citizenshipIssueDate || "N/A"
              }
            />
            {/**Citizenship Issue Place */}
            <EkyeDetailsComponent
              label="Issued Place"
              placeholder={
                employeeData?.userDocument?.citizenshipIssuedPlaceDistrict ||
                "N/A"
              }
            />
          </div>
          <Divider className="mb-6" />
          <div className="flex flex-row w-full mr-6 gap-16">
            {/* Citizenship Front Photo */}
            <div className="">
              <label className="text-black font-semibold text-sm">
                Citizenship Front Photo
              </label>
              {citizenshipFront ? (
                <a
                  href={employeeData?.userDocument?.citizenshipFrontDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-green-300 font-medium underline mb-2">
                  <span className="flex items-center gap-x-2">
                    <FaRegEye />
                    View Uploaded Citizenship
                  </span>
                </a>
              ) : (
                <div className="text-xs text-red-500">No Links Available</div>
              )}
            </div>
            {/**Citizenship Back Photo */}
            <div>
              <label className="text-black font-semibold text-sm">
                Citizenship Back Photo
              </label>
              {citizenshipBack ? (
                <a
                  href={employeeData?.userDocument?.citizenshipBackDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-green-300 font-medium underline mb-2">
                  <span className="flex items-center gap-x-2">
                    <FaRegEye />
                    View Uploaded Citizenship
                  </span>
                </a>
              ) : (
                <div className="text-xs text-red-500">No Links Available</div>
              )}
            </div>
          </div>

          <Divider className="mt-6" />
        </div>

        {/* PAN Details Section */}
        <div className="bg-white text-lg px-6 rounded-lg">
          <h1 className="text-xl font-semibold flex mb-6">
            <span className="relative">
              PAN Details
              <UnderlineComponent />
            </span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <EkyeDetailsComponent
              label="PAN Number"
              placeholder={employeeData?.userDocument?.panNumber || "N/A"}
            />
            <EkyeDetailsComponent
              label="Issued Place"
              placeholder={employeeData?.userDocument?.panIssuePlace || "N/A"}
            />
            <EkyeDetailsComponent
              label="Issued Date"
              placeholder={employeeData?.userDocument?.panIssueDate || "N/A"}
            />

            <div>
              <label className="text-black font-semibold text-sm">
                PAN Photo
              </label>
              {photoPAN ? (
                <a
                  href={employeeData?.userDocument?.panCardDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-green-300 font-medium underline mb-2">
                  <span className="flex items-center gap-x-2">
                    <FaRegEye />
                    View Uploaded PAN Card
                  </span>
                </a>
              ) : (
                <div className="text-xs text-red-500">No Links Available</div>
              )}
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default DocumentAction;
