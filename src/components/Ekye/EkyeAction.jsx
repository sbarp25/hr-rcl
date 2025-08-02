import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ScrollShadow,
} from "@heroui/react";

import PersonalAction from "./Action/PersonalAction";
import AddressAction from "./Action/AddressAction";
import DocumentAction from "./Action/DocumentAction";
import EducationAction from "./Action/EducationAction";
import { useEmployeeEKYEDetails } from "../../hooks/useAuth";

const EkyeAction = () => {
  const { rclId } = useParams();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const { data } = useEmployeeEKYEDetails(rclId);

  const employeeData = data?.data || [];

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
                <ScrollShadow className="w-full h-[900px] px-4" size={25}>
                  <PersonalAction employeeData={employeeData} />
                  <AddressAction employeeData={employeeData} />
                  <DocumentAction employeeData={employeeData} />
                  <EducationAction employeeData={employeeData} />
                </ScrollShadow>
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
