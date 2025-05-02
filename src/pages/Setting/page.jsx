import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import BreadcrumbsComponent from "../../components/BreadCrumbsComp";
import axiosInstance from "../../lib/axios-Instance";
import { toast } from "react-toastify";
import ButtonComponent from "../../components/ButtonComp";
import {
  Button,
  Input,
  useDisclosure,
  Modal,
  ModalContent,
  ModalBody,
  Avatar,
} from "@nextui-org/react";
import ChangePassword from "./ChangePassword/Page";
import PersonalAction from "../../components/Ekye/Action/PersonalAction";

const Settings = () => {
  const [employeeData, setEmployeeData] = useState();
  const [rclId, setRclId] = useState();
  const { register, handleSubmit } = useForm();
  const [imageURL, setImageURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  const breadcrumbItems = [{ label: "Setting", href: "/settings" }];

  const fetchProfilephoto = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        "/api/v1/profilePicture/getById"
      );
      if (response.data.responseCode === "200") {
        setImageURL(response.data.data?.profilePicture);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfilephoto();
  }, []);

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setImageURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  useEffect(() => {
    return () => {
      if (imageURL && imageURL.startsWith("blob:")) {
        URL.revokeObjectURL(imageURL);
      }
    };
  }, [imageURL]);

  const onSubmit = async () => {
    if (!selectedFile) return toast.warn("Please select a file.");

    const formData = new FormData();
    formData.append("profilePicture", selectedFile);

    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/profilePicture/save`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data?.responseCode === "201") {
        toast.success(response?.data?.message);
        fetchProfilephoto();
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateto = () => {
    navigate("/settings/ViewEKYE");
  };
  const onDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/profilePicture/delete`,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data?.responseCode === "204") {
        toast.success(response?.data?.message);
        fetchProfilephoto();
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className=" mx-auto p-6">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <BreadcrumbsComponent items={breadcrumbItems} />
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-neutral-900 shadow-lg rounded-3xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-center mb-6">
          Profile Settings
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-6">
          {/* Profile Image */}

          <div
            className="relative h-64 w-64 rounded-full overflow-hidden border-2 border-gray-400  cursor-pointer "
            onClick={handleIconClick}>
            {imageURL ? (
              <Avatar className="h-full w-full object-cover" src={imageURL} />
            ) : (
              // <img
              //   src={imageURL}
              //   alt="Profile"
              //   className="h-full w-full object-cover"
              // />
              <Avatar className="h-full w-full object-cover" src={imageURL} />
            )}
            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex items-center">
            <ButtonComponent
              type="submit"
              content={isLoading ? "Updating..." : "Update Photo"}
              disabled={isLoading}
            />
            <ButtonComponent
              className="bg-black text-white"
              onPress={onDelete}
              content="Delete Photo"
            />
          </div>
        </form>

        {/* Change Password Button */}
        <div className="mt-8 flex justify-center">
          <Button className="bg-black text-white" onPress={onOpen}>
            Change Password
          </Button>
        </div>
      </div>
      <PersonalAction employeeData={employeeData} />
      <Button onPress={navigateto}>Navigate TO </Button>
      {/* Change Password Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          <ModalBody>
            <ChangePassword />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Settings;
