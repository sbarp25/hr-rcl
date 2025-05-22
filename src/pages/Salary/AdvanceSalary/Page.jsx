import InputComponent from "../../../components/ui/InputComponent.jsx";
import { useForm } from "react-hook-form";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import ButtonComp from "../../../components/ui/ButtonComp.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdvanceSalary = () => {
  const { control, handleSubmit } = useForm({});
  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({});

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "RCL-ID", href: "" },
    { label: "Add Advance", href: "/AdvanceSalary" },
  ];

  const onSubmit = (data) => {
    console.log("Submitted Data", data);
  };

  const hasaccess = true;
  const navigate = useNavigate();
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);
  return (
    <div className="flex flex-col space-y-10">
      <BreadcrumbsComponent items={breadcrumbItems} />
      <div className="bg-white rounded-lg h-[85vh] m-3">
        <form className="p-7" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex  justify-between text-center place-items-center gap-7 h-16  py-5">
            <InputComponent
              name="Description"
              control={control}
              variant="bordered"
              label="Description"
              rules={{
                required: "Description is required",
                pattern: {
                  value: /^[a-zA-Z0-9 ]{3,50}$/,
                  message: "Description must be 3-50 characters long.",
                },
              }}
            />
            <InputComponent
              name="Year"
              control={control}
              variant="bordered"
              label="Year"
              rules={{
                required: "Year is required",
                pattern: {
                  value: /^\d{4}$/,
                  message: "Year must be a 4-digit number.",
                },
              }}
            />
            <InputComponent
              name="Month"
              control={control}
              variant="bordered"
              label="Month"
              rules={{
                required: "Month is required",
                pattern: {
                  value: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)$/i,
                  message: "Please enter a valid month (e.g., jan, dec).",
                },
              }}
            />
            {/* -(1[0-2]|[1-9]) */}
            <InputComponent
              name="AddAmount"
              control={control}
              variant="bordered"
              label="Add Amount"
              rules={{
                required: "Add Amount is required",
                pattern: {
                  value: /^(100|[1-9]\d{2,5}|1000000)(\.\d{1,2})?$/,
                  message: "Please enter a valid amount.",
                },
              }}
            />
          </div>
          <ButtonComp
            onPress={handleSubmit(onSubmit)}
            className="justify-start my-12 py-6  text-lg border border-gray-300 font-semibold bg-blue-100"
            content="Submit"
          />
        </form>
      </div>
    </div>
  );
};

export default AdvanceSalary;
