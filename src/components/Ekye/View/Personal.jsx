import EkyeDetailsComponent from "../../ui/EkyeDetailsComponent.jsx";
import { Divider } from "@heroui/react";
import UnderlineComponent from "../../ui/UnderlineComponent.jsx";
import Legend from "../../ui/Legend.jsx";

const Personal = ({ employeeData }) => {
  return (
    <div className="bg-gray-50 dark:bg-black  pt-2 sm:pt-4 overflow-auto rounded-b-xl border border-gray-300 dark:border-slate-700">
      <div className="rounded-xl space-y-4 sm:space-y-6 pt-4 sm:pt-6">
        {/**Basic Information */}
        <div className="bg-white dark:bg-black rounded-xl mb-4 mx-2 sm:mx-4 p-3 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-4 justify-between bg-white dark:bg-black text-base sm:text-lg pr-2 sm:pr-4 rounded-xl">
            <h1 className="text-lg sm:text-xl font-semibold flex mb-4 sm:mb-6">
              <span className="relative">
                Personal Information Details
                <UnderlineComponent />
              </span>
            </h1>
            <Legend />
          </div>

          <form className="container pb-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-8 lg:px-20">
              <EkyeDetailsComponent
                label="FullName"
                placeholder={employeeData?.personalDetails?.fullName || "N/A"}
              />
              <EkyeDetailsComponent
                label="Age"
                placeholder={employeeData?.personalDetails?.age || "N/A"}
              />
              <EkyeDetailsComponent
                label="Gender"
                placeholder={employeeData?.personalDetails?.gender || "N/A"}
              />
            </div>
            <Divider />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-8 lg:px-20">
              <EkyeDetailsComponent
                label="Phone"
                placeholder={employeeData?.personalDetails?.phone || "N/A"}
              />
              <EkyeDetailsComponent
                label="Email"
                placeholder={employeeData?.personalDetails?.email || "N/A"}
              />
              <EkyeDetailsComponent
                label="Date Of Birth"
                placeholder={
                  employeeData?.personalDetails?.dateOfBirthAd || "N/A"
                }
              />
            </div>
            <Divider />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-8 lg:px-20">
              <EkyeDetailsComponent
                label="Blood Type"
                placeholder={employeeData?.personalDetails?.bloodGroup || "N/A"}
              />
              <EkyeDetailsComponent
                label="Department"
                placeholder={
                  employeeData?.personalDetails?.departmentName || "N/A"
                }
              />
              <EkyeDetailsComponent
                label="Position"
                placeholder={
                  employeeData?.personalDetails?.postionName || "N/A"
                }
              />
            </div>

            <Divider />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-8 lg:px-20">
              <EkyeDetailsComponent
                label="Marital Status"
                placeholder={
                  employeeData?.personalDetails?.married === true
                    ? "Married"
                    : employeeData?.personalDetails?.married === false
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
          <div className="bg-white dark:bg-black rounded-2xl pb-2 mx-2 sm:ml-4 lg:ml-4 p-3 sm:p-5">
            <div className="flex items-center gap-2 sm:gap-4 justify-between bg-white dark:bg-black text-base sm:text-lg pr-2 sm:pr-4 rounded-2xl">
              <h1 className="text-lg sm:text-xl font-semibold flex mb-4 sm:mb-6">
                <span className="relative">
                  Guardian Details
                  <UnderlineComponent />
                </span>
              </h1>
              <Legend />
            </div>
            <form className="container space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 sm:px-8 lg:px-20">
                <EkyeDetailsComponent
                  label="Guardian's Name"
                  placeholder={
                    employeeData?.personalDetails?.guardianName || "N/A"
                  }
                />
                <EkyeDetailsComponent
                  label="Guardian's Number"
                  placeholder={
                    employeeData?.personalDetails?.guardianNumber || "N/A"
                  }
                />
              </div>
              <Divider />
              <div className="grid grid-cols-1 gap-4 px-4 sm:px-8 lg:px-20">
                <EkyeDetailsComponent
                  label="Guardian's Relation"
                  placeholder={
                    employeeData?.personalDetails?.guardianType || "N/A"
                  }
                />
              </div>
            </form>
          </div>

          {/**Emergency Information */}
          <div className="bg-white dark:bg-black rounded-2xl pb-2 mx-2 sm:mr-4 lg:mr-4 p-3 sm:p-5">
            <div className="flex items-center justify-between bg-white dark:bg-black text-base sm:text-lg pr-2 sm:pr-4 rounded-2xl">
              <h1 className="text-lg sm:text-xl font-semibold flex mb-4 sm:mb-6">
                <span className="relative">
                  Emergency Details
                  <UnderlineComponent />
                </span>
              </h1>
              <Legend />
            </div>
            <form className="container space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 sm:px-8 lg:px-20">
                <EkyeDetailsComponent
                  label="Guardian's Name"
                  placeholder={
                    employeeData?.personalDetails?.emergencyName || "N/A"
                  }
                />
                <EkyeDetailsComponent
                  label="Guardian's Number"
                  placeholder={
                    employeeData?.personalDetails?.emergencyNumber || "N/A"
                  }
                />
              </div>
              <Divider />
              <div className="grid grid-cols-1 gap-4 px-4 sm:px-8 lg:px-20">
                <EkyeDetailsComponent
                  label="Guardian's Relation"
                  placeholder={
                    employeeData?.personalDetails?.emergencyType || "N/A"
                  }
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
