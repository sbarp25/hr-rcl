import { Table, TableBody, TableColumn, TableHeader } from "@nextui-org/react";
import React from "react";

const TableComponent = ({ headeritem }) => {
  return (
    <Table>
      <TableHeader>
        {headeritem.map((item, index) => (
          <TableColumn key={index} href={item.href}>
            {item.label}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody></TableBody>
    </Table>
  );
};

export default TableComponent;
