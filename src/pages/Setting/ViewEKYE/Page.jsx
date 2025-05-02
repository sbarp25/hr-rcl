import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import GoBack from "../../../components/GoBack";

import { useNavigate } from "react-router-dom";
import EkyeDocumentDetail from "../../../components/Ekye/View/Document";
import AddressAction from "../../../components/Ekye/Action/AddressAction";
import PersonalAction from "../../../components/Ekye/Action/PersonalAction";
import DocumentAction from "../../../components/Ekye/Action/DocumentAction";
import EducationAction from "../../../components/Ekye/Action/EducationAction";
const ViewEKYE = () => {
  const [employeeData, setEmployeeData] = useState();
  const [rclId, setRclId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchrcl = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/v1/auth/ekye/details`);
      if (response.data.responseCode === "200") {
        const data = response?.data?.data?.rclId;
        setRclId(data);
      } else {
        toast.error(response?.data?.Message);
      }
    } catch (error) {
      console.error("Error fetching RCL ID:", error);
      toast.error("Failed to fetch RCL ID");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeData = async () => {
    if (!rclId) return;

    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/api/v1/admin/singleCompleteEkyeUser/rclId/${rclId}`
      );
      if (response.data.responseCode === "200") {
        const data = response?.data?.data;
        setEmployeeData(data);
      } else {
        toast.error(response?.data?.Message);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
      toast.error("Failed to fetch employee data");
    } finally {
      setIsLoading(false);
    }
  };

  // First fetch the rclId
  useEffect(() => {
    fetchrcl();
  }, []);

  // Then fetch employee data once rclId is available
  useEffect(() => {
    if (rclId) {
      fetchEmployeeData();
    }
  }, [rclId]);

  return (
    <div className="max-h-[95vh] overflow-y-auto">
      <GoBack />

      <AddressAction employeeData={employeeData} />
      <DocumentAction employeeData={employeeData} />
      <EducationAction employeeData={employeeData} />
    </div>
  );
};

export default ViewEKYE;
