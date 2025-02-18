import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
const BreadcrumbsComponent = ({ items }) => {
  const [currentPage, setCurrentPage] = React.useState("music");
  return (
    <Breadcrumbs
      classNames={{
        list: "gap-2",
      }}
      itemClasses={{
        item: [""],
        separator: "hidden",
      }}
      size="sm"
      onAction={(key) => setCurrentPage(key)}
    >
      {items?.map((item, index) => (
        <BreadcrumbItem
          key={index}
          href={item.href}
          isCurrent={currentPage === `{item.label}`}
        >
          <span className="relative inline-flex items-center h-6 w-32">
            <div className="relative w-40 h-10 bg-teal-800 pl-2 text-white text-xs text-center flex items-center justify-center clip-ribbon">
              {item.label}
            </div>
          </span>
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbsComponent;
