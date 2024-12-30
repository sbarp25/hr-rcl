import { Form, Input, Button } from "@nextui-org/react";

const EducationDetails = () => {
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
