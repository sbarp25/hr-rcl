import { useNavigate } from "react-router-dom";
import BreadcrumbsComponent from "../../components/BreadCrumbsComp";
import { useEffect } from "react";
import LocalStorageUtil from "../../utils/LocalStorageUtil";
const HandBook = () => {
  const breadcrumbItems = [{ label: "HandBook", href: "" }];
  const navigate = useNavigate();

  const menu = LocalStorageUtil.getItem("menu");
  /**To check Employee see status */
  const hasaccess = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 20)
  );
  const hasHandBookCreateAccess = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 19)
  );
  const hasHandBookEditAccess = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 21)
  );
  const hasHandBookDeleteAccess = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 22)
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
