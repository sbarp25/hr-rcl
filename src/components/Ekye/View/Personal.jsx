import { FaDiamond } from "react-icons/fa6";
import EkyeDetailsComponent from "../../EkyeDetailsComponent";
import { Divider } from "@nextui-org/react";

const Personal = ({ employeeData }) => {
  return (
    <div className="bg-white h-[75vh] rounded-b-xl">
      <div className="rounded-xl space-y-6 pt-6 ">
        {/**Basic Information */}
        <div className="bg-white rounded-xl mb-4 border border-gray-200 mx-4  p-5">
          <div className="flex items-center gap-4 justify-between bg-white text-lg pr-4 rounded-xl ">
            <h1 className="py-4 text-left text-xl font-semibold flex underline underline-offset-4 decoration-red-500">
              <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3 px-8" />
              Personal Details
            </h1>
            <div className="flex items-center justify-end gap-4">
              <div className="flex gap-1 items-end justify-end text-right">
                <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
                <div className="flex w-2 h-2 rounded-full bg-black"></div>
                <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
              </div>
            </div>
          </div>

          <form className="container  pb-4 space-y-4 ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-20">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-20">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-20">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-20">
              <EkyeDetailsComponent
                label="Maritial Status"
                placeholder={employeeData?.personalDetails?.married || "N/A"}
              />
            </div>
          </form>
        </div>
        {/**Guardians && Emergency Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {/**Guardians Information */}
          <div className="bg-white rounded-2xl border border-gray-200 pb-2 ml-4 p-5">
            <div className="flex items-center gap-4 justify-between bg-white text-lg pr-4 rounded-2xl">
              <h1 className="py-2 text-left text-xl font-semibold flex underline underline-offset-4 decoration-red-500 px-8">
                <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
                Guardian Details
              </h1>
              <div className="flex gap-1 items-end justify-end text-right ">
                <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
                <div className="flex w-2 h-2 rounded-full bg-black"></div>
                <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
              </div>
            </div>
            <form className="container space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 px-20">
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
              <div className="grid grid-cols-1 md:grid-cols-2 px-20">
                <EkyeDetailsComponent
                  label="Guardian's Relation"
                  placeholder={
                    employeeData?.personalDetails?.guardianType || "N/A"
                  }
                />
              </div>
            </form>
          </div>
          {/**Emerency Information */}
          <div className="bg-white rounded-2xl  pb-2 border border-gray-200 mr-4 p-5">
            <div className="flex items-center justify-between bg-white text-lg pr-4 rounded-2xl">
              <h1 className="py-2 text-left text-xl font-semibold flex underline underline-offset-4 decoration-red-500 px-8">
                <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
                Emergency Details
              </h1>
              <div className="flex gap-1 items-end justify-end text-right">
                <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
                <div className="flex w-2 h-2 rounded-full bg-black"></div>
                <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
              </div>
            </div>
            <form className="container space-y-4">
              <div className=" grid grid-cols-1 md:grid-cols-2 px-20">
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
              <div className=" grid grid-cols-1 md:grid-cols-2 px-20">
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
