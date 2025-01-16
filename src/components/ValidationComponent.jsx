import React, { useState } from "react";

const ValidationComponent = ({ children }) => {
  const [errors, setErrors] = useState({});

  const validationRules = {
    email: {
      // this is Id which should be same in form comp
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Invalid email format",
    },
    ward: {
      regex: /^(?:[1-9]|[1-2][0-9]|3[0-2])$/,
      message: "Invalid area code. Must be a number between 1 and 32",
    },
    phone: {
      // this is Id which should be same in form comp
      regex: /^[0-9]{10}$/,
      message: "Phone number must be 10 digits",
    },
    username: {
      // this is Id which should be same in form comp
      regex: /^[a-zA-Z0-9_]{3,30}$/,
      message: "Username must be 3-30 characters long",
    },
    Name: {
      // this is Id which should be same in form comp
      regex: /^[a-zA-Z0-9_]{3,30}$/,
      message: "Name must be 3-30 characters long",
    },
    description: {
      // this is Id which should be same in form comp
      regex: /^[a-zA-Z0-9_]{3,300}$/,
      message: "Name must be 3-30 characters long",
    },
    pincode: {
      regex: /^[1-9]\d{3}$/,
      message: "Invalid pincode. Must be a 4-digit number starting with 1-9.",
    },
    panNumber: {
      regex: /^[1-9]\d{8}$/,
      message:
        "Invalid PAN number. Must be a 9-digit number starting with 1-9.",
    },
  };
  const validateField = (id, value) => {
    if (id in validationRules) {
      const { regex, message } = validationRules[id];
      if (!regex.test(value)) {
        return message;
      }
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const errorMessage = validateField(id, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: errorMessage,
    }));
  };

  const renderChildrenWithProps = (children) =>
    React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        if (child.props.id && child.type === "input") {
          return (
            <div style={{ marginBottom: "1rem" }}>
              {React.cloneElement(child, {
                onChange: (e) => {
                  handleInputChange(e);
                  child.props.onChange?.(e);
                },
              })}
              {errors[child.props.id] && (
                <div className="text-sm mt-1 text-red-500">
                  {errors[child.props.id]}
                </div>
              )}
            </div>
          );
        }
        if (child.props.children) {
          return React.cloneElement(child, {
            children: renderChildrenWithProps(child.props.children),
          });
        }
      }
      return child;
    });

  return <div>{renderChildrenWithProps(children)}</div>;
};

export default ValidationComponent;
