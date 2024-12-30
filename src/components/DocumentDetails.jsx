import { Form, Input, Button } from "@nextui-org/react";
const DocumentDetails = () => {
  return (
    <div className="container gap-y-20">
      {/**Pan Details */}
      <div>
        <h2>Pan Details</h2>
        <label>Pan Number:</label>
        <Input name="text" required />
        <div className="flex w-full gap-10">
          <div className="w-full">
            <label>Issued date:</label>
            <Input name="text" required />
          </div>
          <div className="w-full flex flex-col gap-2 rounded-md ">
            <label className="text-sm font-medium text-gray-700">
              Image Upload:
            </label>
            <input
              type="file"
              className="w-full text-sm text-gray-700 rounded-md cursor-pointer bg-white "
            />
          </div>
        </div>
      </div>
      {/**Citizenship details */}
      <div>
        <h2>Citizenship Details</h2>
        <div className="flex w-full gap-10">
          {/**Citizenship Number */}
          <div className="w-full">
            <label>Citizenship Number</label>
            <Input name="text" required />
          </div>
          {/**Citizenship date */}
          <div className="w-full">
            <label>Issued date:</label>
            <Input name="text" required />
          </div>
        </div>
        <div className="flex w-full gap-10">
          {/**Citizenship Issued Place */}
          <div className="w-full">
            <label>Citizenship Issued Place:</label>
            <Input name="text" required />
          </div>
          {/**Citizenship photo */}
          <div className="flex flex-col w-full">
            <label className="text-sm font-medium text-gray-700">
              Citizenship Photo:
            </label>
            <input
              type="file"
              className="w-full text-sm text-gray-700 rounded-md cursor-pointer bg-white "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
