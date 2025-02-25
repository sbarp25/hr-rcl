import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const hasaccess = false;

  useEffect(() => {
    if (!hasaccess) {
      navigate("/login");
    }
  }, []);
  return <div>Settings</div>;
};

export default Settings;
