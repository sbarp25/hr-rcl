import { Select, SelectItem } from "@nextui-org/select";
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
}) => {
  return (
    <div>
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field, fieldState: { error } }) => (
          <>
            <Select
              {...field}
              variant={variant}
              label={label}
              isInvalid={!!error}
              className={className}
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}>
              {data.map((item) => (
                <SelectItem key={item[valueKey]} value={item[valueKey]}>
                  {item[labelKey]}
                </SelectItem>
              ))}
            </Select>
            {error && <p className="text-danger text-sm">{error.message}</p>}
          </>
        )}
      />
    </div>
  );
};
export default SelectComp;
