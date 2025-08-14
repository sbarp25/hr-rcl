import React, { useEffect, useState } from "react";
import UnderlineComponent from "../../../../../../components/ui/UnderlineComponent";
import { Form } from "react-router-dom";
import EkyeDetailsComponent from "../../../../../../components/ui/EkyeDetailsComponent";
import { Divider } from "@heroui/react";
import { FaRegEye } from "react-icons/fa6";
import Legend from "../../../../../../components/ui/Legend";

const EkyeDocumentDetail = ({ employeeData }) => {
  const userCompleteDetails =
    employeeData?.userCompleteDetailsResponseDto || {};
  const userDocument = userCompleteDetails?.userDocument || {};

  const [citizenshipFront, setCitizenshipFront] = useState(false);
  const [citizenshipBack, setCitizenshipBack] = useState(false);
  const [photoPAN, setPhotoPAN] = useState(false);

  useEffect(() => {
    if (userDocument?.citizenshipFrontDocumentUrl) {
      setCitizenshipFront(true);
    }
    if (userDocument?.citizenshipBackDocumentUrl) {
      setCitizenshipBack(true);
    }
    if (userDocument?.panCardDocumentUrl) {
      setPhotoPAN(true);
    }
  }, [userDocument]);

  return (
    <div className="flex flex-col  overflow-auto bg-gray-50 dark:bg-black  py-6 border-solid mx-auto rounded-md border border-gray-300 dark:border-slate-700">
      <div className="flex flex-col px-8 space-y-8">
        {/* Citizenship Details */}
        <div className="bg-white dark:bg-black rounded-lg p-6">
          {/* Header Component */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold flex">
              <span className="relative">
                Citizenship Details
                <UnderlineComponent />
              </span>
            </h1>

            <div className="flex gap-1 items-center">
              <Legend />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EkyeDetailsComponent
                label="Citizenship Number"
                placeholder={userDocument?.citizenshipNumber}
              />
              <EkyeDetailsComponent
                label="Issued Date"
                placeholder={userDocument?.citizenshipIssueDate}
              />
              <EkyeDetailsComponent
                label="Issued Place"
                placeholder={userDocument?.citizenshipIssuedPlaceDistrict}
              />
            </div>

            <Divider className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Citizenship Front Photo */}
              <div className="space-y-2">
                <label className="text-black dark:text-white font-semibold text-sm">
                  Citizenship Front Photo
                </label>
                {citizenshipFront ? (
                  <a
                    href={userDocument?.citizenshipFrontDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-green-500 underline hover:text-green-600 transition-colors">
                    <span className="flex items-center gap-2">
                      <FaRegEye />
                      <div className="flex flex-col">
                        <span className="font-semibold">View Photo</span>
                        <span className="text-xs">Front Side</span>
                      </div>
                    </span>
                  </a>
                ) : (
                  <div className="text-xs text-red-500">No Links Available</div>
                )}
              </div>

              {/* Citizenship Back Photo */}
              <div className="space-y-2">
                <label className="text-black dark:text-white font-semibold text-sm">
                  Citizenship Back Photo
                </label>
                {citizenshipBack ? (
                  <a
                    href={userDocument?.citizenshipBackDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-green-500 underline hover:text-green-600 transition-colors">
                    <span className="flex items-center gap-2">
                      <FaRegEye />
                      <div className="flex flex-col">
                        <span className="font-semibold">View Photo</span>
                        <span className="text-xs">Back Side</span>
                      </div>
                    </span>
                  </a>
                ) : (
                  <div className="text-xs text-red-500">No Links Available</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PAN Details */}
        <div className="bg-white dark:bg-black rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold flex">
              <span className="relative">
                PAN Details
                <UnderlineComponent />
              </span>
            </h1>
            <div className="flex gap-1 items-center">
              <Legend />
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EkyeDetailsComponent
                label="Issued Number"
                placeholder={userDocument?.panNumber}
              />
              <EkyeDetailsComponent
                label="Issued Place"
                placeholder={userDocument?.panIssuePlace}
              />
              <EkyeDetailsComponent
                label="Issued Date"
                placeholder={userDocument?.panIssueDate}
              />
            </div>

            <Divider className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PAN Document */}
              <div className="space-y-2">
                <label className="text-black dark:text-white font-semibold text-sm">
                  PAN Photo
                </label>
                {photoPAN ? (
                  <a
                    href={userDocument?.panCardDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-green-500 underline hover:text-green-600 transition-colors">
                    <span className="flex items-center gap-2">
                      <FaRegEye />
                      View Photo
                    </span>
                  </a>
                ) : (
                  <div className="text-xs text-red-500">No Links Available</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons Section */}
    </div>
  );
};

export default EkyeDocumentDetail;
