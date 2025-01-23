import * as yup from "yup";

export const step1Schema = yup.object().shape({
  emailSchema: yup
    .string()
    .required("Email is required") // Required validation comes first
    .email("Please enter a valid email address") // Validate email format
    .max(50, "Email cannot exceed 50 characters") // Max length validation
    .test(
      "no-special-chars-start",
      "Email cannot start with a special character or dot",
      (value) => {
        if (!value) return true; // Skip validation if value is empty
        return !/^[^a-zA-Z0-9]/.test(value);
      }
    )
    .test(
      "no-repeated-special-chars",
      "Email cannot have consecutive special characters",
      (value) => {
        if (!value) return true; // Skip validation if value is empty
        return !/([.-])\1/.test(value);
      }
    )
    .test(
      "valid-domain",
      "Email must have a valid domain after '@'",
      (value) => {
        if (!value) return true; // Skip validation if value is empty
        const domain = value.split("@")[1];
        return domain ? /^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(domain) : false;
      }
    ),

  GenderSchema: yup.string().required("Gender is required"),

  dobSchema: yup.date().required("Date of Birth is required"),

  BloodGroupSchema: yup.string().required("Blood Group is required"),

  FullNameSchema: yup
    .string()
    .required("Name is required") // Required validation comes first
    .min(3, "Name must be at least 3 characters") // Min length validation only applies if field is not empty
    .max(30, "Name cannot exceed 30 characters") // Max length validation only applies if field is not empty
    .test(
      "valid-first-name",
      "First Name should only contain letters and single spaces between words",
      (value) => {
        if (!value) return true; // Skip regex validation if the value is empty
        return (
          /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value) && !/\s{2,}/.test(value)
        );
      }
    )
    .test(
      "no-repeated-letters",
      "No letter should repeat more than 3 times consecutively",
      (value) => !/([a-zA-Z])\1{3,}/.test(value || "") // This checks for repeated letters but will skip if empty
    ),
  MobileSchema: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
    .test(
      "no-sequence-same-digits",
      "Mobile number cannot have a sequence of the same 6 digits",
      (value) => {
        return !/(.)\1{5}/.test(value); // Disallows a sequence of the same 6 digits
      }
    ),
  RelationSchema: yup.string().required("Relation is required"),
});

export const step2Schema = yup.object().shape({
  ProvinceSchema: yup.string().required("District is required"),
  DistrictSchema: yup.string().required("District is required"),
  MunicipilitySchema: yup.string().required("Municipility is required"),
  WardSchema: yup
    .number()
    .required("Ward number is required")
    .typeError("Ward number must be a valid number")
    .min(1, "Ward number must be at least 1")
    .max(32, "Ward number cannot exceed 32"),
  PinCodeSchema: yup.string().required("Pin code is Required  is required"),
  ToleAreaSchema: yup.string().required("Tole/Area is required"),
});

export const step3Schema = yup.object().shape({
  panNumberSchema: yup
    .string()
    .required("PAN Number is required")
    .matches(
      /^[A-Z0-9]{10}$/,
      "PAN Number must be 10 characters and alphanumeric (uppercase)"
    ),
  IssueDateSchema: yup.date().required("Issue Date is required"),
  IssuePlaceSchema: yup.string().required("Issue Place is required"),
  citizenshipnumberSchema: yup
    .string()
    .required("Citizenship Number is required"),
});

export const step4Schema = yup.object().shape({
  Institute: yup.string().required("Institute is required"),
  Faculty: yup.string().required("Faculty is required"),
  Date: yup.date().required("Date is required"),
  Status: yup.string().required("Status is required"),
});
