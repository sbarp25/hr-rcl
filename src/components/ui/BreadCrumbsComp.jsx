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
              <>
                <div className="relative w-24 md:w-32 lg:w-40 xl:w-48 h-6 sm:h-8 clip-ribbon-border bg-breadcrumbs hover:bg-breadcrumbshover dark:bg-breadcrumbsborder dark:hover:bg-breadcrumbshoverborder flex items-center justify-center py-[.5px] pl-[1px] ">
                  <div className="w-full h-[95%] clip-ribbon bg-stone-950 hover:bg-active text-white text-xs sm:text-sm scale-[0.95] flex items-center justify-center">
                    {item.label}
                  </div>
                </div>
              </>
            </Link>
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
};

export default BreadcrumbsComponent;
