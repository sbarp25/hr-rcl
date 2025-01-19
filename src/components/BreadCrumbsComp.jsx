import React from "react";
import { Breadcrumbs, TableColumn } from "@nextui-org/react";

const BreadcrumbsComponent = ({ items }) => {
  return (
    <Breadcrumbs>
      {items.map((item, index) => (
        <TableColumn key={index} href={item.href}>
          {item.label}
        </TableColumn>
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbsComponent;
