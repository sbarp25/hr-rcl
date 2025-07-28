import Personal from "./View/Personal";
import EkyeAddress from "./View/EkyeAddress";
import EkyeDocumentDetail from "./View/EkyeDocumentDetail";
import UserEducation from "./View/UserEducation";

const EkyeDetails = ({ employeeData }) => {
  return (
    <div className="max-h-[75vh] overflow-y-auto">
      <Personal employeeData={employeeData} />
      <EkyeAddress employeeData={employeeData} />
      <EkyeDocumentDetail employeeData={employeeData} />
      <UserEducation employeeData={employeeData} />
    </div>
  );
};

export default EkyeDetails;
