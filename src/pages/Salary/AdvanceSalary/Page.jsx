import InputComponent from "../../../components/ui/InputComponent.jsx";
import { useForm } from "react-hook-form";
import BreadcrumbsComponent from "../../../components/ui/BreadCrumbsComp.jsx";
import ButtonComp from "../../../components/ui/ButtonComp.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import GoBack from "../../../components/GoBack.jsx";

const AdvanceSalary = () => {
  const { control, handleSubmit } = useForm({});

  const breadcrumbItems = [{ label: "Add Advance", href: "/AdvanceSalary" }];

  const onSubmit = (data) => {
    // const advanceSalaryData:{data:{

    // }}
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
      <div className="flex justify-between items-center">
        <GoBack />
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
            Advance Salary
          </h1>
        </div>
        <div></div>
      </div>
      <div className="bg-white dark:bg-black rounded-lg h-[85vh] m-3">
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}>
          <InputComponent
            name="advanceAmount"
            control={control}
            variant="bordered"
            label="Advance Amount"
            rules={{
              required: "Amount is required",
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Please enter a valid amount",
              },
              min: {
                value: 0.01,
                message: "Amount must be greater than 0",
              },
            }}
          />
          <InputComponent
            name="repaymentPeriod"
            control={control}
            variant="bordered"
            label="Repayment Period"
            rules={{
              required: "Amount is required",
              pattern: {
                value: /^[1-9][0-9]*$/,
                message: "Amount must be a positive number",
              },
            }}
          />

          <ButtonComp
            onPress={handleSubmit(onSubmit)}
            className="text-lg font-semibold w-fit"
            content="Submit"
          />
        </form>
      </div>
    </div>
  );
};

export default AdvanceSalary;
