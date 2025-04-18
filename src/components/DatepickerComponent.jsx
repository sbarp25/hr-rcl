import { Controller } from "react-hook-form";
import { getLocalTimeZone } from "@internationalized/date";
import { DatePicker } from "@nextui-org/react";

const formatDate = (date) =>
  date ? date?.toDate(getLocalTimeZone()).toISOString().split("T")[0] : null;
const DatepickerComponent = ({
  name,
  control,
  rules = {},
  label = "Date",
  variant = "bordered",
  className = "rounded-xl",
  compareDate = null,
  compareDirection = "after",
  compareErrorMessage = "",
  placeholderDate = null,
  disabled = false,
  formatDateFn = formatDate,
}) => {
  const validationRules = {
    ...rules,
    ...(compareDate && {
      validate: (value) => {
        const existingValidation = rules.validate
          ? typeof rules.validate === "function"
            ? { custom: rules.validate }
            : rules.validate
          : {};

        return {
          ...existingValidation,
          dateComparison: () => {
            if (!compareDate || !value) return true;

            if (compareDirection === "after") {
              return (
                value >= compareDate ||
                compareErrorMessage ||
                "Date must be after comparison date"
              );
            } else {
              return (
                value <= compareDate ||
                compareErrorMessage ||
                "Date must be before comparison date"
              );
            }
          },
        };
      },
    }),
  };

  return (
    <div>
      <Controller
        name={name}
        control={control}
        rules={validationRules}
        defaultValue={placeholderDate}
        render={({ field, fieldState: { error } }) => (
          <>
            <DatePicker
              {...field}
              showMonthAndYearPickers
              isInvalid={!!error}
              className={className}
              label={label}
              variant={variant}
              disabled={disabled}
            />
            {error && <p className="text-danger text-sm">{error.message}</p>}
          </>
        )}
      />
    </div>
  );
};

export default DatepickerComponent;
export { formatDate };
