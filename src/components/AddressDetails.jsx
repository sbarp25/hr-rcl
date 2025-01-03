import { Form, Input, Button } from "@nextui-org/react";
import { useState } from "react";
const AddressDetails = ({ formData, setFormData }) => {
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
    <Form onSubmit={handleSubmit} className="container w-full">
      {/**Permanent Address Details */}
      <div className="border-b-2 w-full ">
        <h2 className="h2-text">Permanent Address Details</h2>
        <div className="grid grid-cols-2 gap-x-10">
          <div className="">
            <label>Provinces:</label>
            <Input
              name="Provinces"
              label="Provinces"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="">
            <label>District:</label>
            <Input
              name="District"
              label="District"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="">
            <label>Municipality:</label>
            <Input
              name="Municipality"
              label="Municipality"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="">
            <label>Ward No:</label>
            <Input
              name="WardNo"
              label="Ward No"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="">
            <label>Pincode:</label>
            <Input
              name="Pincode"
              label="Pincode"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="">
            <label>Tole/Area</label>
            <Input
              name="Tole"
              label="Tole/Area"
              required
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/**Temporary Address Details */}
      <div className="w-full">
        <h2 className="h2-text">Temporary Address Details</h2>
        <div className=" w-72">
          <Input type="radio" label="Same as Above" />
        </div>
        <div className="grid grid-cols-2 gap-x-10">
          <div className="">
            <label>Provinces:</label>
            <Input
              name="Provinces"
              label="Provinces"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="">
            <label>District:</label>
            <Input
              name="District"
              label="District"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="">
            <label>Municipality:</label>
            <Input
              name="Municipality"
              label="Municipality"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="">
            <label>Ward No:</label>
            <Input
              name="Ward"
              label="Ward"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="">
            <label>Pincode:</label>
            <Input
              name="Pincode"
              label="Pincode"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="">
            <label>Tole/Area</label>
            <Input
              name="Tole"
              label="Tole/Area"
              required
              onChange={handleInputChange}
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

export default AddressDetails;
