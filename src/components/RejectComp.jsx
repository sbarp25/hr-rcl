import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { ImCancelCircle } from "react-icons/im";
import { RxCross1 } from "react-icons/rx";
import ButtonComponent from "./ui/ButtonComp.jsx";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Loader from "./Loader/Loader.jsx";
import {
  hasApproveAccess,
  hasUpdateAccess,
  MENU_NAMES,
} from "../utils/permissionUtils.js";
import { useQueryClient } from "@tanstack/react-query";
import { useRejectUser } from "../hooks/useAuth.js";
import TextAreaComp from "./ui/TextAreaComp.jsx";

const RejectComp = ({ employeeData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { rclId } = useParams();
  const queryClient = useQueryClient();
  const hasrejectAccess = hasApproveAccess(MENU_NAMES.EKYE);

  // Using the custom hook
  const rejectMutation = useRejectUser((data) => {
    reset();
    onOpenChange(false);

    if (rclId) {
      queryClient.invalidateQueries({ queryKey: ["employee", rclId] });
    }
  });

  const onReject = async (data) => {
    if (!hasrejectAccess) {
      toast.error("Access Denied");
      return;
    }

    const rejectData = {
      userId: rclId,
      status: "REJECTED",
      remark: data.reject,
    };

    rejectMutation.mutate(rejectData);
  };

  const handleModalClose = () => {
    if (!rejectMutation.isPending) {
      reset();
      onOpenChange(false);
    }
  };

  return (
    <div>
      {rejectMutation.isPending && <Loader />}
      <ButtonComponent
        onPress={onOpen}
        isDisabled={rejectMutation.isPending}
        className={""}
        content={
          <span className="inline-flex items-center gap-2  cursor-pointer">
            <RxCross1 className="w-4 h-4" />
            <span>Reject</span>
          </span>
        }
      />

      <form onSubmit={handleSubmit(onReject)}>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="lg"
          isDismissable={!rejectMutation.isPending}
          isKeyboardDismissDisabled={rejectMutation.isPending}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex gap-1 justify-center items-center">
                  Rejecting the Ekye for
                  <p>{employeeData?.personalDetails?.fullName || "N/A"}</p>
                </ModalHeader>

                <ModalBody>
                  <TextAreaComp
                    control={control}
                    name="reject"
                    label="Reason"
                    rules={{
                      required: "Reject reason is required",
                      minLength: {
                        value: 10,
                        message:
                          "Reason to reject must be more than 10 charactes",
                      },
                      maxLength: {
                        value: 255,
                        message:
                          "Reason to reject cannot exceed 255 characters",
                      },
                    }}
                  />
                </ModalBody>

                <ModalFooter>
                  <ButtonComponent
                    onPress={handleModalClose}
                    content={
                      <div className="flex items-center justify-center gap-2">
                        <ImCancelCircle />
                        <span>Cancel</span>
                      </div>
                    }
                    color="warning"
                    className="text-white dark:text-black bg-gray-400 dark:bg-gray-300 "
                    isDisabled={rejectMutation.isPending}
                  />
                  <Button
                    color="danger"
                    onPress={handleSubmit(onReject)}
                    isDisabled={rejectMutation.isPending || !hasrejectAccess}>
                    <div className="flex items-center justify-center gap-2">
                      <RxCross1 />
                      <span>
                        {rejectMutation.isPending ? (
                          <span className="flex items-center gap-4">
                            <Spinner color="danger" size="sm" />
                            Rejecting...
                          </span>
                        ) : (
                          "Reject"
                        )}
                      </span>
                    </div>
                  </Button>
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
