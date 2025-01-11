import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader";
import axiosInstance from "../../../lib/axios-Instance";

const ValidateLink = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let resetpasswordData = params.get("data");

    if (resetpasswordData) {
      resetpasswordData = decodeURIComponent(resetpasswordData);
      resetpasswordData = resetpasswordData.replaceAll(" ", "+");
      localStorage.setItem("resetpasswordData", resetpasswordData);

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const encryptedData = localStorage.getItem("resetpasswordData");

        if (!encryptedData) {
          setError("No reset password data found");
          toast.error("No reset password data found");
          navigate("/login");
          return;
        }
        const requestBody = {
          data: {
            encData: encryptedData,
          },
        };
        const response = await axios.post(
          "http://192.168.1.173:8090/auth/rstpwd",
          requestBody
        );

        if (response.status === 200) {
          // toast.success(response.data.message);
          toast.success("Link validated successfully. Redirecting...");
          navigate("/resetpwd");
        } else {
          // toast.error(response.data.message);
          setError("API request failed. Please try again.");
          toast.error("Failed to validate the link. Please try again.");
          navigate("/login");
        }
      } catch (error) {
        setError("An error occurred. Please try again later.");
        toast.error("Please Contact the administrator and try again later");
        console.error("An error occurred:", error);
        navigate("/login");
      } finally {
        setIsLoading(false); // Hide loading state
      }
    };
    fetchData();
  }, [navigate]); // Dependency array to include navigate so it doesn't trigger on every render

  return (
    <>
      {isLoading && (
        <Loader message="Please wait while the work is being done" />
      )}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-sm w-full">
          <h1 className="text-xl font-semibold text-gray-800 text-center mb-4">
            Validating the reset Link Please Wait
          </h1>
        </div>
      </div>
    </>
  );
};

export default ValidateLink;
