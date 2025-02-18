import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { ImCancelCircle } from "react-icons/im";
import { RxCross1 } from "react-icons/rx";
import React, { useState } from "react";
import ButtonComponent from "./ButtonComp";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const RejectComp = ({ employeeData }) => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const onReject = async (data) => {
    const rejectData = {
      rejection: data.reject,
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axiosInstance.post(
        "/api/v1/rejected/users",
        rejectData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response?.data?.responseCode === "201") {
        toast.success(response?.data?.message);
        navigate("/AdminEkye");
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {" "}
      <Button className="bg-red-700 text-white" onPress={onOpen}>
        <RxCross1 />
        Reject
      </Button>
      <form onSubmit={handleSubmit(onReject)}>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="lg"
          // placement="bottom"
          //  backdrop="blur">
          isDismissable={true}
          isKeyboardDismissDisabled={false}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex gap-1 justify-center items-center">
                  Rejecting the Ekye for
                  <p>{employeeData?.personalDetails?.fullName || "N/A"}</p>
                </ModalHeader>

                <ModalBody>
                  <Textarea
                    placeholder="Comment :"
                    minRows={10}
                    maxRows={10}
                    variant="bordered"
                    {...register("reject", {
                      required: "Reject reason is required",
                      maxLength: {
                        value: 1000,
                        message:
                          "Reason to reject cannot exceed 1000 characters",
                      },
                    })}
                  />
                </ModalBody>

                <ModalFooter>
                  <ButtonComponent
                    onPress={onClose}
                    content={
                      <div className="flex items-center justify-center gap-2 ">
                        <ImCancelCircle />
                        <span>Cancel</span>
                      </div>
                    }
                    color="warning"
                    className="text-white "
                  />
                  <ButtonComponent
                    onPress={onReject}
                    content={
                      <div className="flex items-center justify-center gap-2 ">
                        <RxCross1 />
                        <span>Reject</span>
                      </div>
                    }
                    className={"bg-red-700 text-white"}
                  />
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </form>
    </div>
  );
};

export default RejectComp;
