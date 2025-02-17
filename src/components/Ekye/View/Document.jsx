import { useEffect, useState } from "react";
import { Divider, Form } from "@nextui-org/react";
import { FaDiamond, FaRegEye } from "react-icons/fa6";
import EkyeDetailsComponent from "../../EkyeDetailsComponent";

const EkyeDocumentDetail = ({ employeeData }) => {
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
  }, []);

  return (
    <div className="flex flex-col bg-white py-6 border-solid mx-auto rounded-md h-[75vh]">
      <div className="grid grid-cols-1 md:grid-cols-2 mt-2 px-8 gap-6 ">
        {/**Citizenship details */}
        <div className="bg-white text-lg p-6 shadow-md rounded-lg">
          {/**Header Component */}
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold mb-4 text-left flex underline underline-offset-4 decoration-red-500">
              <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
              Citizenship Details
            </h1>
            <div className="flex gap-1 items-end justify-end text-right">
              <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
              <div className="flex w-2 h-2 rounded-full bg-black"></div>
              <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>
          <Form className="py-6 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full">
              <EkyeDetailsComponent
                label="Citizenship Number"
                placeholder={employeeData?.userDocument?.citizenshipNumber}
              />
              <EkyeDetailsComponent
                label="Issued Date"
                placeholder={employeeData?.userDocument?.citizenshipIssueDate}
              />
            </div>
            <Divider />
            <div className="grid grid-cols-1 md:grid-cols-2 w-full">
              <EkyeDetailsComponent
                label="Issued Place"
                placeholder={
                  employeeData?.userDocument?.citizenshipIssuedPlaceDistrict
                }
              />

              <div className="flex flex-col w-full mr-6">
                {/* Citizenship Front Photo */}
                <div>
                  <label className="text-black font-semibold text-sm">
                    Citizenship Front Photo
                  </label>
                  {citizenshipFront ? (
                    <a
                      href={
                        employeeData?.userDocument?.citizenshipFrontDocumentUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-green-600 underline mb-2"
                    >
                      <span className="flex items-center gap-x-2">
                        <FaRegEye />
                        View Uploaded Citizenship
                      </span>
                    </a>
                  ) : (
                    <div className="text-xs text-red-500">
                      No Links Available
                    </div>
                  )}
                </div>
                {/**Citizenship Back Photo */}
                <div>
                  <label className="text-black font-semibold text-sm">
                    Citizenship Back Photo
                  </label>
                  {citizenshipBack ? (
                    <a
                      href={
                        employeeData?.userDocument?.citizenshipBackDocumentUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-green-600 underline mb-2"
                    >
                      <span className="flex items-center gap-x-2">
                        <FaRegEye />
                        View Uploaded Citizenship
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
          </Form>
        </div>

        {/**Pan Details */}
        <div className="bg-white text-lg  p-6 shadow-md rounded-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold mb-4 text-left flex  underline underline-offset-4 decoration-red-500 ">
              <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
              PAN Details{" "}
            </h1>
            <div className="flex gap-1 items-end justify-end text-right">
              <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
              <div className="flex w-2 h-2 rounded-full bg-black"></div>
              <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>
          <Form className="py-6 w-full gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full">
              <EkyeDetailsComponent
                label="Issued Number"
                placeholder={employeeData?.userDocument?.panNumber}
              />
              <EkyeDetailsComponent
                label="Issued Place"
                placeholder={employeeData?.userDocument?.panIssuePlace}
              />
            </div>
            <Divider />

            <div className="grid grid-cols-1 md:grid-cols-2 w-full">
              <EkyeDetailsComponent
                label="Issued Date"
                placeholder={employeeData?.userDocument?.panIssueDate}
              />
              {/**Pan Document */}
              <div>
                <label className="text-black font-semibold text-sm">
                  PAN Photo
                </label>
                {photoPAN ? (
                  <a
                    href={employeeData?.userDocument?.panCardDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-green-600 underline mb-2"
                  >
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
          </Form>
        </div>
      </div>

      {/* Buttons Section */}
    </div>
  );
};

export default EkyeDocumentDetail;
