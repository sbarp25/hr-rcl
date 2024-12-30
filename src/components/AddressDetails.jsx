import { Form, Input, Button } from "@nextui-org/react";
const AddressDetails = () => {
  return (
    <div>
      {/**Permanent Address Details */}
      <div className="border-b-2">
        <h1>Permanent Address Details</h1>
        <div className="grid grid-cols-2 gap-10">
          <div className="">
            <label>Provinces:</label>
            <Input />
          </div>
          <div className="">
            <label>District:</label>
            <Input />
          </div>
          <div className="">
            <label>Municipality:</label>
            <Input />
          </div>
          <div className="">
            <label>Ward No:</label>
            <Input />
          </div>
          <div className="">
            <label>Pincode:</label>
            <Input />
          </div>
          <div className="">
            <label>Tole/Area</label>
            <Input />
          </div>
        </div>
      </div>

      {/**Temporary Address Details */}
      <div>
        <h1>Temporary Address Details</h1>
        <div className=" w-72">
          <Input type="radio" label="Same as Above" />
        </div>
        <div className="grid grid-cols-2 gap-10">
          <div className="">
            <label>Provinces:</label>
            <Input />
          </div>
          <div className="">
            <label>District:</label>
            <Input />
          </div>
          <div className="">
            <label>Municipality:</label>
            <Input />
          </div>
          <div className="">
            <label>Ward No:</label>
            <Input />
          </div>
          <div className="">
            <label>Pincode:</label>
            <Input />
          </div>
          <div className="">
            <label>Tole/Area</label>
            <Input />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressDetails;
