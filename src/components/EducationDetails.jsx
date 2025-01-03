import { Form, Input, Button } from "@nextui-org/react";
import { useState } from "react";

const EducationDetails = ({ formData, setFormData }) => {
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
    <form>
      <h2>Educational Details</h2>
      <h2>Highest Educational Details</h2>
      <div>
        <label>Degree</label>
        <Input />
      </div>
      <div className="flex w-full gap-10">
        <div className="w-full">
          <label>Start year</label>
          <Input />
        </div>
        <div className="w-full">
          <label>End Year</label>
          <Input />
        </div>
      </div>
      <div>
        <label>Status</label>
        <Input />
      </div>
    </form>
  );
};

export default EducationDetails;
