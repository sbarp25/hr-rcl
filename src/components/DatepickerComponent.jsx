import { Controller } from "react-hook-form";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { DatePicker } from "@nextui-org/react";

// Helper function to convert string date to CalendarDate
const parseStringToCalendarDate = (dateString) => {
  if (!dateString) return null;
  try {
    // Parse YYYY-MM-DD string to CalendarDate
    return parseDate(dateString);
  } catch (e) {
    console.error("Error parsing date:", e);
    return null;
  }
};

// Modified to handle timezone issues properly
const formatDate = (date) => {
  if (!date) return null;

  // If it's already a CalendarDate object with toDate method
  if (date.toDate && typeof date.toDate === "function") {
    // Use the local timezone to prevent date shifting
    const localDate = date.toDate(getLocalTimeZone());

    // Get year, month, and day components and create ISO date string
    const year = localDate.getFullYear();
    // Month is 0-indexed in JS Date, so add 1 and pad with leading zero if needed
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // If it's already a YYYY-MM-DD string, return it as is
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  // Handle JavaScript Date objects
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return null;
};

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
  disabled,
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
        render={({ field, fieldState: { error } }) => {
          const dateValue =
            typeof field.value === "string"
              ? parseStringToCalendarDate(field.value)
              : field.value;

          return (
            <>
              <DatePicker
                {...field}
                value={dateValue}
                showMonthAndYearPickers
                isDisabled={disabled}
                isInvalid={!!error}
                errorMessage={error?.message}
                className={className}
                label={label}
                variant={variant}
                onChange={(date) => {
                  field.onChange(date);
                }}
              />
            </>
          );
        }}
      />
    </div>
  );
};

export default DatepickerComponent;
export { formatDate };
