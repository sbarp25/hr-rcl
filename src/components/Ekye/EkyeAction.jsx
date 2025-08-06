import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ScrollShadow,
  Spinner,
} from "@heroui/react";

import PersonalAction from "./Action/PersonalAction";
import AddressAction from "./Action/AddressAction";
import DocumentAction from "./Action/DocumentAction";
import EducationAction from "./Action/EducationAction";
import { useEmployeeEKYEDetails } from "../../hooks/useAuth";
import Loader from "../Loader/Loader";

const EkyeAction = () => {
  const { rclId } = useParams();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const { data, isPending } = useEmployeeEKYEDetails(rclId);

  const employeeData = data?.data || [];

  return (
    <>
      <Modal
        isOpen={isOpen}
        size="5xl"
        scrollBehavior="outside"
        onOpenChange={(isModalOpen) => {
          onOpenChange(isModalOpen);
          if (!isModalOpen) {
            navigate("/AdminEkye");
          }
        }}>
        <ModalContent>
          {() => (
            <>
              <ModalBody>
                {isPending ? (
                  <Loader />
                ) : (
                  // <Spinner size="lg" color="danger" />
                  <>
                    {/* <ScrollShadow className="w-full h-[900px] px-4" size={25}> */}
                    <PersonalAction employeeData={employeeData} />
                    <AddressAction employeeData={employeeData} />
                    <DocumentAction employeeData={employeeData} />
                    <EducationAction employeeData={employeeData} />
                    {/* </ScrollShadow> */}
                  </>
                )}
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
