import { useNavigate } from "react-router-dom";
import BreadcrumbsComponent from "../../components/BreadCrumbsComp";
import { useEffect } from "react";
const HandBook = () => {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "HandBook", href: "" },
  ];
  const navigate = useNavigate();
  const hasaccess = false;

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, []);
  return (
    <div>
      <BreadcrumbsComponent items={breadcrumbItems} />
      HandBook
    </div>
  );
};

export default HandBook;
