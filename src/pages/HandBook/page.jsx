import { useNavigate } from "react-router-dom";
import BreadcrumbsComponent from "../../components/BreadCrumbsComp";
import { useEffect } from "react";
import LocalStorageUtil from "../../utils/LocalStorageUtil";
const HandBook = () => {
  const breadcrumbItems = [{ label: "HandBook", href: "" }];
  const navigate = useNavigate();
  const hasaccess = true;

  const menu = LocalStorageUtil.getItem("menu");
  /**To check Employee see status */
  const seeEmployee = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 2)
  );
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
