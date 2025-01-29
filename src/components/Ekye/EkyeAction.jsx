import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

import PersonalAction from "./Action/PersonalAction";
import AddressAction from "./Action/AddressAction";
import DocumentAction from "./Action/DocumentAction";
import EducationAction from "./Action/EducationAction";

const EkyeAction = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate(); // Hook for navigation

  // Automatically open the modal when the page loads
  useEffect(() => {
    onOpen();
  }, [onOpen]);

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
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                {/* Render child components */}
                <PersonalAction />
                <AddressAction />
                <DocumentAction />
                <EducationAction />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    navigate("/AdminEkye"); // Navigate to EkyeDashboard on close
                  }}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EkyeAction;
