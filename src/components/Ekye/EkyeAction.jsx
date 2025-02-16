import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

import PersonalAction from "./Action/PersonalAction";
import AddressAction from "./Action/AddressAction";
import DocumentAction from "./Action/DocumentAction";
import EducationAction from "./Action/EducationAction";
import axiosInstance from "../../lib/axios-Instance";
import { toast } from "react-toastify";

const EkyeAction = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate(); // Hook for navigation
  const [employeeData, setEmployeeData] = useState();

  // Automatically open the modal when the page loads
  useEffect(() => {
    onOpen();
  }, [onOpen]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axiosInstance.get(
          // `/api/v1/admin/singleCompleteEkyeUser/rclId/${rclid}`
          `/api/v1/admin/singleCompleteEkyeUser/rclId/RCL-250471009100003`
        );
        if (response.data.responseCode === "200") {
          const data = response?.data?.data;
          setEmployeeData(data);
          console.log(data);
        } else {
          toast.error(response?.data?.Message);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        // toast.error("Error fetching employee data.");
      }
    };
    fetchEmployeeData();
  }, []);

  return (
    <>
      <Modal
        isOpen={isOpen}
        size="5xl"
        scrollBehavior="inside"
        onOpenChange={(isModalOpen) => {
          onOpenChange(isModalOpen);
          if (!isModalOpen) {
            navigate("/AdminEkye"); // Navigate back when modal is closed
          }
        }}>
        <ModalContent>
          {() => (
            <>
              <ModalBody>
                {/* Render child components */}
                <PersonalAction employeeData={employeeData} />
                <AddressAction employeeData={employeeData} />
                <DocumentAction employeeData={employeeData} />
                <EducationAction employeeData={employeeData} />
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EkyeAction;
