import { Controller } from "react-hook-form";
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import { DatePicker } from "@heroui/react";

// Helper function to convert string date to CalendarDate
const parseStringToCalendarDate = (dateString) => {
  if (!dateString) return null;
  try {
    // Parse YYYY-MM-DD string to CalendarDate
    return parseDate(dateString);
  } catch (e) {
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

// import React, { useState } from "react";
// import DatePicker from "react-date-picker";
// import { Controller } from "react-hook-form";
// import "react-date-picker/dist/DatePicker.css";
// import "react-calendar/dist/Calendar.css";
// import { getLocalTimeZone } from "@internationalized/date";
// import { SlCalender } from "react-icons/sl";

// const formatDate = (date) => {
//   if (!date) return null;

//   // If it's already a CalendarDate object with toDate method
//   if (date.toDate && typeof date.toDate === "function") {
//     // Use the local timezone to prevent date shifting
//     const localDate = date.toDate(getLocalTimeZone());

//     // Get year, month, and day components and create ISO date string
//     const year = localDate.getFullYear();
//     // Month is 0-indexed in JS Date, so add 1 and pad with leading zero if needed
//     const month = String(localDate.getMonth() + 1).padStart(2, "0");
//     const day = String(localDate.getDate()).padStart(2, "0");

//     return `${year}-${month}-${day}`;
//   }

//   // If it's already a YYYY-MM-DD string, return it as is
//   if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
//     return date;
//   }

//   // Handle JavaScript Date objects
//   if (date instanceof Date) {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");

//     return `${year}-${month}-${day}`;
//   }

//   return null;
// };

// const DatePickerComponent = ({ name, control, label, rules }) => {
//   return (
//     <div className="relative w-full">
//       <Controller
//         control={control}
//         name={name}
//         rules={rules}
//         render={({ field, fieldState }) => {
//           return (
//             <>
//               <label
//                 className={`absolute left-3 top-1 text-gray-500 text-sm transition-all duration-200 bg-white px-1 -translate-y-1 scale-100 origin-left pointer-events-none`}>
//                 {label}
//               </label>

//               <DatePicker
//                 {...field}
//                 onChange={(date) => field.onChange(date)}
//                 value={field.value}
//                 calendarIcon={
//                   <span className="text-gray-400">
//                     <SlCalender />
//                   </span>
//                 }
//                 clearIcon={null}
//                 format="dd/MM/yyyy"
//                 // onCalendarOpen={() => setIsFocused(true)}
//                 // onCalendarClose={() => setIsFocused(!!field.value)}
//                 className={`w-full px-3 pt-8 pb-2 border-2 rounded-md ${
//                   fieldState?.error
//                     ? " border-danger  text-danger"
//                     : " border-gray-300"
//                 } `}
//               />

//               {fieldState?.error && (
//                 <p className="text-danger text-sm mt-1">
//                   {fieldState.error.message}
//                 </p>
//               )}
//             </>
//           );
//         }}
//       />
//     </div>
//   );
// };

// export default DatePickerComponent;
// export { formatDate };
