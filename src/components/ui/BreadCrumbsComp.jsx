import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { Link } from "react-router-dom";
const BreadcrumbsComponent = ({ items }) => {
  const [currentPage, setCurrentPage] = React.useState("music");

  return (
    <div className=" pb-1 w-full">
      <Breadcrumbs
        classNames={{
          list: "gap-1 sm:gap-2 flex-nowrap",
          base: "w-full",
        }}
        itemClasses={{
          item: [""],
          separator: "hidden",
        }}
        size="sm"
        onAction={(key) => setCurrentPage(key)}>
        {items?.map((item, index) => (
          <BreadcrumbItem
            key={index}
            // href={item.href}
            isCurrent={currentPage === `{item.label}`}>
            <Link to={item.href}>
              <span className="relative inline-flex items-center h-8">
                <div className="relative w-24  md:w-32 lg:w-40 xl:w-48 h-6 sm:h-8 bg-teal-800 hover:bg-red-600 pl-2 text-white text-xs text-center flex items-center justify-center clip-ribbon whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.label}
                </div>
              </span>
            </Link>
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
};

export default BreadcrumbsComponent;
