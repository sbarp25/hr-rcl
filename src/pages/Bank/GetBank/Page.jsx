import React, { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "sonner";
import ButtonComponent from "../../../components/ui/ButtonComp.jsx";
import { useNavigate } from "react-router-dom";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import { CiLocationOn } from "react-icons/ci";
import { CiBank } from "react-icons/ci";
import { CiCreditCard2 } from "react-icons/ci";
import { IoPersonSharp } from "react-icons/io5";
import Loader from "../../../components/Loader/Loader.jsx";
const GetBankDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bankData, setBankData] = useState(null);

  const navigate = useNavigate();

  const fetchBankDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/api/v1/banking/getById`);
      if (response.data.responseCode === "200") {
        // Set the data object directly instead of expecting a datalist
        setBankData(response.data.data);
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went Wrong";
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const navigateTo = () => {
    if (AddBankDetailsAccess) {
      navigate("/Bank/AddBank");
    } else {
      toast.error("You currently Don't have access to this Setting");
    }
  };

  /**To check Employee see status */
  const seeBankDetailsAccess = true;

  const AddBankDetailsAccess = true;

  useEffect(() => {
    if (!seeBankDetailsAccess) {
      navigate("/dashboard");
    }
  }, []);
  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div></div>
        <h2 className="text-2xl font-semibold mb-4">Bank Details</h2>
        <ButtonComponent
          onPress={navigateTo}
          className="bg-black text-white"
          content="Add Bank"
        />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          <div className="bg-white dark:bg-black  shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2 border-gray-300">
              Bank Details
            </h2>
            <ul className="space-y-4 text-sm text-gray-700 dark:text-white">
              <li>
                <div className="flex items-center gap-3 font-medium mb-1">
                  <CiCreditCard2 className="text-xl" />
                  Account Number
                </div>
                <div className="ml-8 text-gray-600">
                  {bankData?.accountNumber || "N/A"}
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3 font-medium mb-1">
                  <IoPersonSharp className="text-xl" />
                  Account Holder Name
                </div>
                <div className="ml-8 text-gray-600">
                  {bankData?.accountName || "N/A"}
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3 font-medium mb-1">
                  <CiCreditCard2 className="text-xl" />
                  Account Type
                </div>
                <div className="ml-8 text-gray-600">
                  {bankData?.accountType || "N/A"}
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3 font-medium mb-1">
                  <CiBank className="text-xl" />
                  Bank Name
                </div>
                <div className="ml-8 text-gray-600">
                  {bankData?.bankName || "N/A"}
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3 font-medium mb-1">
                  <CiLocationOn className="text-xl" />
                  Branch Name
                </div>
                <div className="ml-8 text-gray-600">
                  {bankData?.branchName || "N/A"}
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetBankDetails;
