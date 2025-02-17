import { useEffect, useState } from "react";
import {
  Divider,
  Form,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  ModalBody,
  Textarea,
} from "@nextui-org/react";
import { FaDiamond, FaRegEye } from "react-icons/fa6";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader";
import EkyeDetailsComponent from "../../EkyeDetailsComponent";
import ButtonComponent from "../../ButtonComp";
import { useForm } from "react-hook-form";
import RejectComp from "../../RejectComp";

const EducationAction = ({ employeeData }) => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [EducationDocument, setEducationDocument] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const educationalDetail = employeeData?.educationalDetails?.[0];

  useEffect(() => {
    if (employeeData?.educationalDetails?.[0].documentUrl) {
      setEducationDocument(true);
    }
  }, []);

  const onApprove = async () => {
    const submitData = {
      userId: 0,
      status: "APPROVED",
      remark: "Congrulations",
    };
    try {
      const response = await axiosInstance.post(
        "/api/v1/approved/users",
        submitData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.responseCode === "201") {
        toast.success(response?.data?.message);
        navigate("/AdminEkye");
      } else {
        toast.error(response?.data?.data?.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="relative flex flex-col bg-white mt-16 border-2 rounded-md shadow-lg p-8">
        {/* Header Section */}
        <div className="absolute bg-black w-auto rounded-t-2xl -top-12   left-1 px-6 py-2">
          <h1 className="text-2xl font-bold text-white">Education Detail</h1>
        </div>

        {/* Single Form Section */}
        <Form className="mt-8 grid grid-cols-1 gap-12">
          {/* Education Details Section */}
          <div className="bg-white text-lg p-6 rounded-lg">
            <h1 className="text-xl font-semibold flex underline underline-offset-4 decoration-red-500 mb-6">
              <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-2" />
              Education Details
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <EkyeDetailsComponent
                label="level"
                placeholder={educationalDetail?.degree || "N/A"}
              />
              <EkyeDetailsComponent
                label="Institute"
                placeholder={educationalDetail?.institution || "N/A"}
              />
              <EkyeDetailsComponent
                label="Faculty"
                placeholder={educationalDetail?.faculty || "N/A"}
              />
            </div>
            <Divider className="mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EkyeDetailsComponent
                label="Start Date"
                placeholder={educationalDetail?.startYear || "N/A"}
              />
              <EkyeDetailsComponent
                label="End Date"
                placeholder={educationalDetail?.endYear || "N/A"}
              />
              <EkyeDetailsComponent
                label="Status"
                placeholder={educationalDetail?.status || "N/A"}
              />
            </div>
            <Divider className="mt-6 mb-6" />

            <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-black font-semibold text-sm">
                  Education Certificate
                </label>
                {EducationDocument ? (
                  <a
                    href={employeeData?.educationDetails?.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-green-600 underline mb-2">
                    <span className="flex items-center gap-x-2">
                      <FaRegEye />
                      View Uploaded Certificate
                    </span>
                  </a>
                ) : (
                  <div className="text-xs text-red-500">No Links Available</div>
                )}
              </div>
            </div>
          </div>
        </Form>

        {/* Buttons Section */}
        <div className="mt-6 flex justify-end gap-4">
          {/* <Button className="bg-red-700 text-white" onPress={onOpen}>
            Reject
          </Button> */}
          <RejectComp employeeData={employeeData} />
          <Button className="bg-green-700 text-white" onPress={onApprove}>
            Approve
          </Button>
        </div>
        {/**Modal For Reject  */}
        {/* <form onSubmit={handleSubmit(onReject)}>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="sm"
            // placement="bottom"
            //  backdrop="blur">
            isDismissable={true}
            isKeyboardDismissDisabled={false}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Rejecting the Ekye for
                    <p>{employeeData?.personalDetails?.fullName || "N/A"}</p>
                  </ModalHeader>

                  <ModalBody>
                    <Textarea
                      placeholder="Comment :"
                      rows={5}
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
                      content="No"
                      variant="light"
                      color="danger"
                    />
                    <ButtonComponent onPress={onReject} content="Yes" />
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </form> */}
      </div>
    </>
  );
};

export default EducationAction;
