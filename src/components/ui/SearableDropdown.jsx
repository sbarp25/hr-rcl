import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Controller } from "react-hook-form";

const ReusableAutocomplete = ({
  name,
  control,
  label,
  items = [],
  rules = {},
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Autocomplete
          selectedKey={field.value ? field.value.toString() : ""}
          onSelectionChange={field.onChange}
          label={label}
          variant="bordered"
          isInvalid={fieldState.invalid}
          errorMessage={fieldState.error?.message}
          defaultItems={items}
          {...props}>
          {(item) => (
            <AutocompleteItem key={item.key} textValue={item.label}>
              {item.label}
            </AutocompleteItem>
          )}
        </Autocomplete>
      )}
    />
  );
};

export default ReusableAutocomplete;
