const EkyeDetailsComponent = ({ label, placeholder }) => {
  return (
    <div>
      {" "}
      {/* <div className=" flex flex-col text-center"> */}
      <div className=" flex flex-col ">
        <p className="font-semibold text-sm">{label}</p>
        <span className="text-xs">{placeholder}</span>
      </div>
    </div>
  );
};

export default EkyeDetailsComponent;
