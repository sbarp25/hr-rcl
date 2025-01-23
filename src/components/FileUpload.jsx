import React from "react";
import Inputcomp from "./Inputcomp";
const FileUpload = ({ label, placeholder, onChange }) => {
  return (
    <div>
      <Inputcomp
        variant="bordered"
        type="file"
        label={label}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default FileUpload;
