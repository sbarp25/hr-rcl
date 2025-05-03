import React, { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import ButtonComponent from "../../../components/ButtonComp";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader";

const GetBankDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bankData, setBankData] = useState(null);

  const navigate = useNavigate();

  const fetchBankDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/v1/banking/bank_details_by_id`
      );
      if (response.data.responseCode === "200") {
        // Set the data object directly instead of expecting a datalist
        setBankData(response.data.data);
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

  const navigateTo = () => {
    navigate("/Bank/AddBank");
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white shadow-md w-full rounded-2xl p-4 border border-gray-200">
            <p className="mb-2">
              <span className="font-semibold">Account Number:</span>{" "}
              {bankData?.accountNumber || "N/A"}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Account Name:</span>{" "}
              {bankData?.accountName || "N/A"}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Account Type:</span>{" "}
              {bankData?.accountType || "N/A"}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Bank Name:</span>{" "}
              {bankData?.bankName || "N/A"}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Branch Name:</span>{" "}
              {bankData?.branchName || "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetBankDetails;
