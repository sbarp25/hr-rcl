import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import After from "../assets/svgs/After.svg";
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
      onAction={(key) => setCurrentPage(key)}>
      {items.map((item, index) => (
        <BreadcrumbItem
          key={index}
          href={item.href}
          isCurrent={currentPage === `{item.label}`}>
          <span className="relative inline-flex items-center h-6 w-28">
            <span className="absolute right-4 -ml-2">
              <img
                src={After}
                alt={`After ${item.label}`}
                className="w-32 h-32 "
              />
            </span>
            <span className="relative z-10 left-5 text-xs text-white">
              {item.label}
            </span>
          </span>
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbsComponent;
