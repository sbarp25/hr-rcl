import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

const BreadcrumbsComponent = ({ items }) => {
  return (
    <Breadcrumbs>
      {items.map((item, index) => (
        <BreadcrumbItem key={index} href={item.href}>
          {item.label}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbsComponent;
