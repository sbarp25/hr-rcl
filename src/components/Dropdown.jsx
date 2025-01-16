import { Select, SelectItem } from "@nextui-org/select";

const Dropdown = ({
  className = "w-full",
  label = "Select an option",
  data = [],
  selectedValue,
  onSelectionChange,
  valueKey = "id",
  labelKey = "name",
}) => {
  return (
    <Select
      className={className}
      label={label}
      selectedKeys={[selectedValue]}
      onSelectionChange={onSelectionChange}>
      {data.map((item) => (
        <SelectItem key={item[valueKey]} value={item[valueKey]}>
          {item[labelKey]}
        </SelectItem>
      ))}
    </Select>
  );
};

export default Dropdown;
