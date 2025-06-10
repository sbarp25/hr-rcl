import { Divider, Form } from "@heroui/react";
import EkyeDetailsComponent from "../../ui/EkyeDetailsComponent.jsx";
import UnderlineComponent from "../../ui/UnderlineComponent.jsx";
const PersonalAction = ({ employeeData }) => {
  return (
    <div className=" relative flex flex-col bg-white mt-16 border border-black rounded-b-md shadow-lg px-8 ">
      {/* Header Section */}
      <div className="absolute bg-black w-auto rounded-t-2xl -top-12   -left-0.5 px-6 py-2">
        <h1 className="text-2xl font-semibold text-white">
          Personal Information Details
        </h1>
      </div>

      {/* Form Section */}
      <Form className=" grid grid-cols-1 gap-12 ">
        <div className="bg-white text-lg p-6 rounded-lg space-y-4">
          <div>
            <h1 className="text-xl font-semibold flex mb-6">
              <span className="relative">
                Personal Information Details
                <UnderlineComponent />
              </span>
            </h1>
            {/* Column 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 space-y-4">
              <EkyeDetailsComponent
                label="Name"
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
            <Divider className="mb-4 mt-2" />
            {/* Column 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
              <EkyeDetailsComponent
                label="Date of Birth"
                placeholder={
                  employeeData?.personalDetails?.dateOfBirthAd || "N/A"
                }
              />
              <EkyeDetailsComponent
                label="Email"
                placeholder={employeeData?.personalDetails?.email || "N/A"}
              />
              <EkyeDetailsComponent
                label="Phone"
                placeholder={employeeData?.personalDetails?.phone || "N/A"}
              />
            </div>
            <Divider className="mb-4 mt-2" />

            {/* Column 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
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
                label="Department"
                placeholder={
                  employeeData?.personalDetails?.departmentName || "N/A"
                }
              />
            </div>
            <Divider className="mt-4 mb-2" />
          </div>
          <div>
            {/* Column 4 */}
            <h1 className="text-xl font-semibold flex mb-6">
              <span className="relative">
                Guardian Details
                <UnderlineComponent />
              </span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
              <EkyeDetailsComponent
                label="Guardian Name"
                placeholder={
                  employeeData?.personalDetails?.guardianName || "N/A"
                }
              />
              <EkyeDetailsComponent
                label="Guardian Number"
                placeholder={
                  employeeData?.personalDetails?.guardianNumber || "N/A"
                }
              />
              <EkyeDetailsComponent
                label="Guardian Relationship"
                placeholder={
                  employeeData?.personalDetails?.guardianType || "N/A"
                }
              />
            </div>
            <Divider className="mt-6 mb-6" />
            {/* Column 5 */}
            <h1 className="text-xl font-semibold flex mb-6">
              <span className="relative">
                Emergency Details
                <UnderlineComponent />
              </span>
            </h1>
          </div>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
              <EkyeDetailsComponent
                label="Emergency Relationship"
                placeholder={
                  employeeData?.personalDetails?.guardianType || "N/A"
                }
              />
              <EkyeDetailsComponent
                label="Emergency Relationship"
                placeholder={
                  employeeData?.personalDetails?.guardianType || "N/A"
                }
              />
              <EkyeDetailsComponent
                label="Emergency Relationship"
                placeholder={
                  employeeData?.personalDetails?.guardianType || "N/A"
                }
              />
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default PersonalAction;
