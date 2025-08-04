import { useEffect, useState } from "react";
import { Divider, Form } from "@heroui/react";
import { FaRegEye } from "react-icons/fa6";
import EkyeDetailsComponent from "../../ui/EkyeDetailsComponent.jsx";

import UnderlineComponent from "../../ui/UnderlineComponent.jsx";

const UserEducation = ({ employeeData }) => {
  const [educationDocuments, setEducationDocuments] = useState({});

  useEffect(() => {
    if (employeeData?.educationalDetails) {
      const docStatus = {};
      employeeData.educationalDetails.forEach((edu, index) => {
        docStatus[index] = !!edu.documentUrl;
      });
      setEducationDocuments(docStatus);
    }
  }, [employeeData]);

  return (
    <>
      <div className="relative max-h-[75vh] overflow-auto flex flex-col items-center  bg-gray-50 dark:bg-black h-[75vh] py-6 w-full mx-auto rounded-lg border border-gray-300">
        <div className="bg-white dark:bg-black text-lg w-[calc(100%-.5rem)]  rounded-lg px-6 mt-2 mx-1">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold flex mb-6">
              <span className="relative">
                Education Details
                <UnderlineComponent />
              </span>
              {/* h-[calc(100vh-210px)] */}
            </h1>
            <div className="flex gap-1 items-end justify-end text-right">
              <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
              <div className="flex w-2 h-2 rounded-full bg-black"></div>
              <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>

          {employeeData?.educationalDetails?.length > 0 ? (
            employeeData.educationalDetails.map((education, index) => (
              <div key={index} className="mb-6 p-4 rounded-md ">
                <Form className="py-6 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
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
                  <Divider />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
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
                  <Divider />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
                    <div>
                      <label className="text-black dark:text-white font-semibold text-sm">
                        Education Certificate
                      </label>
                      {educationDocuments[index] ? (
                        <a
                          href={education.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-green-600 underline mb-2">
                          <span className="flex items-center gap-x-2">
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
                </Form>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No Education Details Available
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserEducation;
