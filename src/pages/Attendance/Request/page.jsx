import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AttendanceRequest = () => {
  const navigate = useNavigate();
  const hasaccess = false;

  useEffect(() => {
    if (!hasaccess) {
      navigate("/login");
    }
  }, []);
  return <div>AttendanceRequest</div>;
};

export default AttendanceRequest;
