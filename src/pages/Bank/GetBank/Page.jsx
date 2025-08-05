import { useEffect } from "react";
import { toast } from "sonner";
import ButtonComponent from "../../../components/ui/ButtonComp.jsx";
import { useNavigate } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { CiBank } from "react-icons/ci";
import { CiCreditCard2 } from "react-icons/ci";
import { IoPersonSharp } from "react-icons/io5";
import Loader from "../../../components/Loader/Loader.jsx";
import { useFetchBank } from "../../../hooks/useAuth.js";
const GetBankDetails = () => {
  const navigate = useNavigate();
  const { data: BankData, isLoading: isBankLoading } = useFetchBank();

  const bankData = BankData?.data || {};

  const navigateTo = () => {
    if (AddBankDetailsAccess) {
      navigate("/Bank/AddBank");
    } else {
      toast.error("You currently Don't have access to this Setting");
    }
  };

  const seeBankDetailsAccess = true;

  const AddBankDetailsAccess = true;

  useEffect(() => {
    if (!seeBankDetailsAccess) {
      navigate("/dashboard");
    }
  }, [navigate, seeBankDetailsAccess]);

  if (isBankLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div></div>
        <h2 className="text-2xl font-semibold mb-4">Bank Details</h2>
        <ButtonComponent
          onPress={navigateTo}
          className="text-white bg-black dark:bg-white dark:text-black dark:hover:text-white hover:bg-active dark:hover:dark:bg-active"
          content="Add Bank"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        <div className="bg-white dark:bg-black  shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 border-b pb-2 border-gray-300">
            Bank Details
          </h2>
          <ul className="space-y-4 text-sm text-gray-700 dark:text-white">
            <li>
              <div className="flex items-center gap-3 font-medium mb-1">
                <CiCreditCard2 className="text-xl" />
                Account Number
              </div>
              <div className="ml-8 text-gray-600 dark:text-gray-300">
                {bankData?.accountNumber || "N/A"}
              </div>
            </li>
            <li>
              <div className="flex items-center gap-3 font-medium mb-1">
                <IoPersonSharp className="text-xl" />
                Account Holder Name
              </div>
              <div className="ml-8 text-gray-600 dark:text-gray-300">
                {bankData?.accountName || "N/A"}
              </div>
            </li>
            <li>
              <div className="flex items-center gap-3 font-medium mb-1">
                <CiCreditCard2 className="text-xl" />
                Account Type
              </div>
              <div className="ml-8 text-gray-600 dark:text-gray-300">
                {bankData?.accountType || "N/A"}
              </div>
            </li>
            <li>
              <div className="flex items-center gap-3 font-medium mb-1">
                <CiBank className="text-xl" />
                Bank Name
              </div>
              <div className="ml-8 text-gray-600 dark:text-gray-300">
                {bankData?.bankName || "N/A"}
              </div>
            </li>
            <li>
              <div className="flex items-center gap-3 font-medium mb-1">
                <CiLocationOn className="text-xl" />
                Branch Name
              </div>
              <div className="ml-8 text-gray-600 dark:text-gray-300">
                {bankData?.branchName || "N/A"}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GetBankDetails;
