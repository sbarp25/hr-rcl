import { Divider, Form } from "@nextui-org/react";
import { FaDiamond } from "react-icons/fa6";
import EkyeDetailsComponent from "../../EkyeDetailsComponent";
const PersonalAction = ({ employeeData }) => {
  return (
    <div className="relative flex flex-col bg-white mt-16 border-2 rounded-md shadow-lg px-8  ">
      {/* Header Section */}
      <div className="absolute bg-black w-auto rounded-t-2xl -top-12   left-1 px-6 py-2">
        <h1 className="text-2xl font-bold text-white">Personal Detail</h1>
      </div>

      {/* Form Section */}
      <Form className=" grid grid-cols-1 gap-12">
        <div className="bg-white text-lg p-6 rounded-lg">
          <h1 className="text-xl font-semibold flex underline underline-offset-4 decoration-red-500">
            <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-2" />
            Personal Details
          </h1>
          {/* Column 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
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

          {/* Column 4 */}
          <h1 className="text-xl font-semibold flex underline underline-offset-4 decoration-red-500 mb-6">
            <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-2" />
            Guardian Details
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
            <EkyeDetailsComponent
              label="Guardian Name"
              placeholder={employeeData?.personalDetails?.guardianName || "N/A"}
            />
            <EkyeDetailsComponent
              label="Guardian Number"
              placeholder={
                employeeData?.personalDetails?.guardianNumber || "N/A"
              }
            />
            <EkyeDetailsComponent
              label="Guardian Relationship"
              placeholder={employeeData?.personalDetails?.guardianType || "N/A"}
            />
          </div>
          <Divider className="mt-6 mb-6" />
          {/* Column 5 */}
          <h1 className="text-xl font-semibold flex underline underline-offset-4 decoration-red-500">
            <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-2" />
            Emergency Details
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
            <EkyeDetailsComponent
              label="Emergency Relationship"
              placeholder={employeeData?.personalDetails?.guardianType || "N/A"}
            />
            <EkyeDetailsComponent
              label="Emergency Relationship"
              placeholder={employeeData?.personalDetails?.guardianType || "N/A"}
            />
            <EkyeDetailsComponent
              label="Emergency Relationship"
              placeholder={employeeData?.personalDetails?.guardianType || "N/A"}
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default PersonalAction;
