import { Select, SelectItem } from "@nextui-org/select";

const SelectComp = ({
  variant,
  label,
  selectedKeys,
  onSelectionChange,
  defaultValue,
  data,
  valueKey,
  labelKey,
}) => {
  return (
    <Select
      className="shadow-lg rounded-lg shadow-gray-300"
      label={label}
      variant={variant}
      selectedKeys={selectedKeys}
      onSelectionChange={onSelectionChange}
      defaultValue={defaultValue}>
      {data.map((item) => (
        <SelectItem key={item[valueKey]} value={item[valueKey]}>
          {item[labelKey]}
        </SelectItem>
      ))}
    </Select>
  );
};

export default SelectComp;
