import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
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
import { hasUpdateAccess, MENU_NAMES } from "../utils/permissionUtils.js";
import { useQueryClient } from "@tanstack/react-query";
import { useRejectUser } from "../hooks/useAuth.js";

const RejectComp = ({ employeeData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { rclId } = useParams();
  const queryClient = useQueryClient();
  const hasApproveAccess = hasUpdateAccess(MENU_NAMES.EKYE);

  // Using the custom hook
  const rejectMutation = useRejectUser((data) => {
    reset();
    onOpenChange(false);

    if (rclId) {
      queryClient.invalidateQueries({ queryKey: ["employee", rclId] });
    }
  });

  const onReject = async (data) => {
    if (!hasApproveAccess) {
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
      <Button
        className="bg-white text-red-500 border border-red-500"
        onPress={onOpen}
        isDisabled={rejectMutation.isPending}>
        <RxCross1 />
        Reject
      </Button>

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
                  <Textarea
                    placeholder="Comment :"
                    minRows={10}
                    maxRows={10}
                    className={`${errors.reject ? "border-red-900" : ""}`}
                    variant="bordered"
                    isDisabled={rejectMutation.isPending}
                    {...register("reject", {
                      required: "Reject reason is required",
                      maxLength: {
                        value: 1000,
                        message:
                          "Reason to reject cannot exceed 1000 characters",
                      },
                    })}
                  />
                  {errors.reject && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.reject.message}
                    </p>
                  )}
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
                    className="text-white"
                    isDisabled={rejectMutation.isPending}
                  />
                  <ButtonComponent
                    onPress={handleSubmit(onReject)}
                    content={
                      <div className="flex items-center justify-center gap-2">
                        <RxCross1 />
                        <span>
                          {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                        </span>
                      </div>
                    }
                    className="bg-red-700 text-white"
                    isDisabled={rejectMutation.isPending}
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
