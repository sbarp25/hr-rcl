import React from "react";
import UnderlineComponent from "../../../../../../components/ui/UnderlineComponent";
import EkyeDetailsComponent from "../../../../../../components/ui/EkyeDetailsComponent";
import { Divider } from "@heroui/react";

const Personal = ({ employeeData }) => {
  const userCompleteDetails =
    employeeData?.userCompleteDetailsResponseDto || {};
  const personalDetails = userCompleteDetails?.personalDetails || {};

  return (
    <div className="bg-gray-50 h-[75vh] pt-2 sm:pt-4 overflow-auto rounded-b-xl border border-gray-300">
      <div className="rounded-xl space-y-4 sm:space-y-6 pt-4 sm:pt-6">
        {/**Basic Information */}
        <div className="bg-white rounded-xl mb-4 mx-2 sm:mx-4 p-3 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-4 justify-between bg-white text-base sm:text-lg pr-2 sm:pr-4 rounded-xl">
            <h1 className="text-lg sm:text-xl font-semibold flex mb-4 sm:mb-6">
              <span className="relative">
                Personal Information Details
                <UnderlineComponent />
              </span>
            </h1>
            <div className="flex items-center justify-end gap-2 sm:gap-4">
              <div className="flex gap-1 items-end justify-end text-right">
                <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
                <div className="flex w-2 h-2 rounded-full bg-black"></div>
                <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
              </div>
            </div>
          </div>

          <form className="container pb-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-8 lg:px-20">
              <EkyeDetailsComponent
                label="FullName"
                placeholder={personalDetails?.fullName || "N/A"}
              />
              <EkyeDetailsComponent
                label="Age"
                placeholder={personalDetails?.age || "N/A"}
              />
              <EkyeDetailsComponent
                label="Gender"
                placeholder={personalDetails?.gender || "N/A"}
              />
            </div>
            <Divider />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-8 lg:px-20">
              <EkyeDetailsComponent
                label="Phone"
                placeholder={personalDetails?.phone || "N/A"}
              />
              <EkyeDetailsComponent
                label="Email"
                placeholder={personalDetails?.email || "N/A"}
              />
              <EkyeDetailsComponent
                label="Date Of Birth"
                placeholder={personalDetails?.dateOfBirthAd || "N/A"}
              />
            </div>
            <Divider />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-8 lg:px-20">
              <EkyeDetailsComponent
                label="Blood Type"
                placeholder={personalDetails?.bloodGroup || "N/A"}
              />
              <EkyeDetailsComponent
                label="Department"
                placeholder={personalDetails?.departmentName || "N/A"}
              />
              <EkyeDetailsComponent
                label="Position"
                placeholder={personalDetails?.postionName || "N/A"}
              />
            </div>

            <Divider />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-8 lg:px-20">
              <EkyeDetailsComponent
                label="Marital Status"
                placeholder={
                  personalDetails?.married === true
                    ? "Married"
                    : personalDetails?.married === false
                    ? "Unmarried"
                    : "N/A"
                }
              />
            </div>
            <Divider />
          </form>
        </div>

        {/**Guardians && Emergency Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/**Guardians Information */}
          <div className="bg-white rounded-2xl pb-2 mx-2 sm:ml-4 lg:ml-4 p-3 sm:p-5">
            <div className="flex items-center gap-2 sm:gap-4 justify-between bg-white text-base sm:text-lg pr-2 sm:pr-4 rounded-2xl">
              <h1 className="text-lg sm:text-xl font-semibold flex mb-4 sm:mb-6">
                <span className="relative">
                  Guardian Details
                  <UnderlineComponent />
                </span>
              </h1>
              <div className="flex gap-1 items-end justify-end text-right">
                <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
                <div className="flex w-2 h-2 rounded-full bg-black"></div>
                <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
              </div>
            </div>
            <form className="container space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 sm:px-8 lg:px-20">
                <EkyeDetailsComponent
                  label="Guardian's Name"
                  placeholder={personalDetails?.guardianName || "N/A"}
                />
                <EkyeDetailsComponent
                  label="Guardian's Number"
                  placeholder={personalDetails?.guardianNumber || "N/A"}
                />
              </div>
              <Divider />
              <div className="grid grid-cols-1 gap-4 px-4 sm:px-8 lg:px-20">
                <EkyeDetailsComponent
                  label="Guardian's Relation"
                  placeholder={personalDetails?.guardianType || "N/A"}
                />
              </div>
            </form>
          </div>

          {/**Emergency Information */}
          <div className="bg-white rounded-2xl pb-2 mx-2 sm:mr-4 lg:mr-4 p-3 sm:p-5">
            <div className="flex items-center justify-between bg-white text-base sm:text-lg pr-2 sm:pr-4 rounded-2xl">
              <h1 className="text-lg sm:text-xl font-semibold flex mb-4 sm:mb-6">
                <span className="relative">
                  Emergency Details
                  <UnderlineComponent />
                </span>
              </h1>
              <div className="flex gap-1 items-end justify-end text-right">
                <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
                <div className="flex w-2 h-2 rounded-full bg-black"></div>
                <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
              </div>
            </div>
            <form className="container space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 sm:px-8 lg:px-20">
                <EkyeDetailsComponent
                  label="Guardian's Name"
                  placeholder={personalDetails?.emergencyName || "N/A"}
                />
                <EkyeDetailsComponent
                  label="Guardian's Number"
                  placeholder={personalDetails?.emergencyNumber || "N/A"}
                />
              </div>
              <Divider />
              <div className="grid grid-cols-1 gap-4 px-4 sm:px-8 lg:px-20">
                <EkyeDetailsComponent
                  label="Guardian's Relation"
                  placeholder={personalDetails?.emergencyType || "N/A"}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personal;
