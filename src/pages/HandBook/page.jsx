import BreadcrumbsComponent from "../../components/BreadCrumbsComp";
const HandBook = () => {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "HandBook", href: "" },
  ];
  return (
    <div>
      <BreadcrumbsComponent items={breadcrumbItems} />
      HandBook
    </div>
  );
};

export default HandBook;
