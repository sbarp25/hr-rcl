import { useNavigate } from "react-router-dom";
import BreadcrumbsComponent from "../../components/BreadCrumbsComp";
import { useEffect } from "react";
const HandBook = () => {
  const breadcrumbItems = [{ label: "HandBook", href: "" }];
  const navigate = useNavigate();
  const hasaccess = true;

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);
  return (
    <div>
      <BreadcrumbsComponent items={breadcrumbItems} />
      HandBook
    </div>
  );
};

export default HandBook;
