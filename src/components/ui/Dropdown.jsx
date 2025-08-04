import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { MdKeyboardArrowDown } from "react-icons/md";

const DropDownComp = ({ items, onSelect, selectedValue = 10 }) => {
  const selectedKeys = React.useMemo(
    () => new Set([selectedValue?.toString()]),
    [selectedValue]
  );

  const handleSelectionChange = (keys) => {
    const selected = Array.from(keys)[0]; // Get selected value as string
    onSelect(Number(selected)); // Convert to number before passing to parent
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className="capitalize" variant="bordered">
          {selectedValue}
          <MdKeyboardArrowDown />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Single selection example"
        selectedKeys={selectedKeys}
        selectionMode="single"
        variant="flat"
        onSelectionChange={handleSelectionChange}>
        {items.map((item) => (
          <DropdownItem key={item.toString()}>{item}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropDownComp;
