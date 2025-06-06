import React, { useEffect, useState } from "react";
import UnderlineComponent from "../../../../../../components/ui/UnderlineComponent";
import EkyeDetailsComponent from "../../../../../../components/ui/EkyeDetailsComponent";
import { Divider, Form } from "@heroui/react";
import { FaRegEye } from "react-icons/fa6";

const UserEducation = ({ employeeData }) => {
  const userCompleteDetails =
    employeeData?.userCompleteDetailsResponseDto || {};
  const educationalDetails = userCompleteDetails?.educationalDetails || [];
  const [educationDocuments, setEducationDocuments] = useState({});

  useEffect(() => {
    if (employeeData?.educationalDetails) {
      const docStatus = {};
      educationalDetails?.forEach((edu, index) => {
        docStatus[index] = !!edu.documentUrl;
      });
      setEducationDocuments(docStatus);
    }
  }, [educationalDetails]);

  return (
    <div className="max-h-[75vh] overflow-auto bg-gray-50 h-[75vh] py-8 mx-auto rounded-lg border border-gray-300">
      <div className="px-8">
        <div className="bg-white rounded-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl font-semibold flex">
              <span className="relative">
                Education Details
                <UnderlineComponent />
              </span>
            </h1>
            <div className="flex gap-1 items-center">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 rounded-full bg-black"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>

          {/* Education Content */}
          {educationalDetails?.length > 0 ? (
            <div className="space-y-8">
              {educationalDetails.map((education, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="space-y-6">
                    {/* Education Level, Institute, Faculty */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <EkyeDetailsComponent
                        label="Level"
                        placeholder={education.degree}
                      />
                      <EkyeDetailsComponent
                        label="Institute"
                        placeholder={education.institution}
                      />
                      <EkyeDetailsComponent
                        label="Faculty"
                        placeholder={education.faculty}
                      />
                    </div>

                    <Divider className="my-4" />

                    {/* Start Date, End Date, Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <EkyeDetailsComponent
                        label="Start Date"
                        placeholder={education.startYear}
                      />
                      <EkyeDetailsComponent
                        label="End Date"
                        placeholder={education.endYear}
                      />
                      <EkyeDetailsComponent
                        label="Status"
                        placeholder={education.status}
                      />
                    </div>

                    <Divider className="my-4" />

                    {/* Education Certificate */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-black font-semibold text-sm">
                          Education Certificate
                        </label>
                        {educationDocuments[index] ? (
                          <a
                            href={education.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-green-600 underline hover:text-green-700 transition-colors">
                            <span className="flex items-center gap-2">
                              <FaRegEye />
                              View Certificate
                            </span>
                          </a>
                        ) : (
                          <div className="text-xs text-red-500">
                            No Links Available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              No Education Details Available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserEducation;
