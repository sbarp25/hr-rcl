import { Table, TableBody, TableHeader } from "@nextui-org/react";
import React from "react";

const TableComponent = ({ headeritem }) => {
  return (
    <Table>
      <TableHeader>
        {headeritem.map((item, index) => (
          <BreadcrumbItem key={index} href={item.href}>
            {item.label}
          </BreadcrumbItem>
        ))}
      </TableHeader>
      <TableBody></TableBody>
    </Table>
  );
};

export default TableComponent;
