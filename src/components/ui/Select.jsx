import { Select, SelectItem } from "@heroui/select";
import { Controller } from "react-hook-form";

const SelectComp = ({
  name,
  control,
  rules = {},
  label,
  variant = "bordered",
  data = [],
  valueKey = "key",
  labelKey = "label",
  className = "rounded-xl",
  defaultValue = "",
  isReadOnly,
  placeholder,
}) => {
  return (
    <div>
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field, fieldState: { error } }) => {
          // Find the selected item's label to display as placeholder text if needed
          const selectedItem = data.find(
            (item) => item[valueKey] === field.value
          );
          const displayPlaceholder = selectedItem
            ? selectedItem[labelKey]
            : placeholder;

          return (
            <>
              <Select
                {...field}
                variant={variant}
                isDisabled={isReadOnly}
                placeholder={displayPlaceholder}
                label={label}
                errorMessage={error?.message}
                isInvalid={!!error}
                className={className}
                selectedKeys={field.value !== undefined ? [field.value] : []}
                onSelectionChange={(keys) =>
                  field.onChange(Array.from(keys)[0])
                }>
                {data.map((item) => (
                  <SelectItem key={item[valueKey]} value={item[valueKey]}>
                    {item[labelKey]}
                  </SelectItem>
                ))}
              </Select>
            </>
          );
        }}
      />
    </div>
  );
};

export default SelectComp;
