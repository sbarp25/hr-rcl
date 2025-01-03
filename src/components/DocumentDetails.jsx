import { Form, Input, Button, DateInput } from "@nextui-org/react";
import { CalendarDate } from "@internationalized/date";
import { useState } from "react";
const DocumentDetails = ({ formData, setFormData }) => {
  const [localFormData, setLocalFormData] = useState(formData || {});
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData(localFormData); // Update parent state
    console.log("Form Data:", JSON.stringify(localFormData, null, 2)); // Debugging
  };
  return (
    <Form onSubmit={handleSubmit} className="container gap-y-10">
      {/**Pan Details */}
      <div className="w-full">
        <h2>Pan Details</h2>
        <label>Pan Number:</label>
        <Input
          name="PAN Number"
          label="PAN Number"
          required
          onChange={handleInputChange}
        />
        <div className="flex w-full gap-x-10">
          <div className="w-full">
            <label>Issued date:</label>
            <DateInput
              name="dob"
              aria-label
              placeholderValue={new CalendarDate(1995, 11, 6)}
              onChange={(date) =>
                setLocalFormData((prev) => ({
                  ...prev,
                  dob: date.toString(),
                }))
              }
            />
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
      <div className="w-full">
        <h2>Citizenship Details</h2>
        <div className="flex w-full gap-10">
          {/**Citizenship Number */}
          <div className="w-full">
            <label>Citizenship Number</label>
            <Input
              name="CitizenshipNumber"
              label="Citizenship Number"
              required
              onChange={handleInputChange}
            />
          </div>
          {/**Citizenship date */}
          <div className="w-full">
            <label>Issued date:</label>
            <DateInput
              name="dob"
              aria-label
              placeholderValue={new CalendarDate(1995, 11, 6)}
              onChange={(date) =>
                setLocalFormData((prev) => ({
                  ...prev,
                  dob: date.toString(),
                }))
              }
            />
          </div>
        </div>
        <div className="flex w-full gap-10">
          {/**Citizenship Issued Place */}
          <div className="w-full">
            <label>Citizenship Issued Place:</label>
            <Input
              name="Provinces"
              label="Provinces"
              required
              onChange={handleInputChange}
            />
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
      <Button type="submit" variant="primary">
        Save
      </Button>
    </Form>
  );
};

export default DocumentDetails;
