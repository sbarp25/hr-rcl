import { useForm } from "react-hook-form";
import InputComponent from "../../components/ui/InputComponent.jsx";
import ButtonComponent from "../../components/ui/ButtonComp.jsx";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios-Instance";
import { useNavigate } from "react-router-dom";
import GoBack from "../../components/GoBack";
import LocalStorageUtil from "../../utils/LocalStorageUtil";
const Bank = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      branchName: "Kumaripati",
      bankName: "Sanima Bank",
      accountNumber: "",
      accountName: "",
      accountType: "Platinum PayRoll Saving",
    },
  });
  const navigate = useNavigate();

  const fetchBankDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/v1/banking/bank_details_by_id`
      );
      if (response.data.responseCode === "200") {
        // Set the data object directly instead of expecting a datalist
        const bankData = response.data.data;
        reset({
          accountNumber: bankData?.accountNumber || "",
          accountName: bankData?.accountName || "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchBankDetails();
  }, []);

  const onSubmit = async (data) => {
    if (AddBank) {
      const BankDetails = {
        data: {
          accountNumber: data.accountNumber,
          accountName: data.accountName,
          accountType: data.accountType,
          bankName: data.bankName,
          branchName: data.branchName,
        },
      };
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          toast.error("Authentication token is missing.");
          setIsLoading(false);
          return;
        }

        const response = await axiosInstance.post(
          "/api/v1/banking/bank_details_create",
          BankDetails,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response?.data?.responseCode === "200") {
          reset();
          navigate("/settings");
          toast.success(response?.data?.message);
        } else {
          const errorMessage =
            response?.data?.error?.errorList?.[0]?.errorMessage ||
            "Something went wrong";
          toast.error(errorMessage);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Something went wrong";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else toast.error("You currently dont have access to this setting");
  };

  /**To check Employee see status */

  const seeAddBank = true;

  const AddBank = true;

  useEffect(() => {
    if (!seeAddBank) {
      navigate("/dashboard");
    }
  }, []);
  return (
    <>
      <div className="flex justify-between mb-8 text-center">
        <GoBack />
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Banking Details
          </h2>
          <p className="text-gray-800">
            Please enter your bank account information
          </p>
        </div>
        <div></div>
      </div>
      {/* {is} */}
      <div className="h-[80vh] border-2 border-gray-300 rounded-2xl p-4">
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className=" space-y-4">
            <InputComponent
              control={control}
              variant="bordered"
              label="Branch Name"
              name="branchName"
              rules={{ required: "Branch Name is required" }}
              isReadOnly={true}
            />
            <InputComponent
              control={control}
              variant="bordered"
              label="Bank Name"
              name="bankName"
              rules={{
                required: "Bank Name is required",
              }}
              isReadOnly={true}
            />
            <InputComponent
              control={control}
              variant="bordered"
              label="Account No"
              name="accountNumber"
              rules={{
                required: "Account Number is required",
                pattern: {
                  value: /^(?=.*\d)[a-zA-Z0-9]{5,20}$/,
                  message:
                    "Account Number needs to be between 5 and 20 characters.",
                },
              }}
            />
            <InputComponent
              control={control}
              variant="bordered"
              label="Account-holder Name"
              name="accountName"
              rules={{
                required: "Account Holder Name is required",
                minLength: {
                  value: 3,
                  message: "Full name must be at least 3 characters",
                },
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message:
                    "Name must not contain numbers or special characters",
                },
              }}
            />
            <InputComponent
              control={control}
              variant="bordered"
              label="Account Type"
              name="accountType"
              rules={{ required: "Account type is required" }}
              isReadOnly={true}
            />
            <ButtonComponent
              content="Submit"
              className="bg-black text-white"
              type="submit"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Bank;
