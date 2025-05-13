import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import BreadcrumbsComponent from "../../components/BreadCrumbsComp";
import axiosInstance from "../../lib/axios-Instance";
import { toast } from "react-toastify";
import ButtonComponent from "../../components/ButtonComp";
import { Input, Avatar, Divider } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import EkyeDetailsComponent from "../../components/EkyeDetailsComponent";
import LocalStorageUtil from "../../utils/LocalStorageUtil";
import getInitials from "../../utils/getInitials";
import UnderlineComponent from "../../components/UnderlineComponent";

const Settings = () => {
  const [employeeData, setEmployeeData] = useState();
  const [rclId, setRclId] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      profilePicture: null,
    },
  });

  const [imageURL, setImageURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const breadcrumbItems = [{ label: "Setting", href: "/settings" }];
  const navigate = useNavigate();

  const name = localStorage.getItem("fullName");
  const menu = LocalStorageUtil.getItem("menu");

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
      console.log(errorMessage);
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

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Set the file in react-hook-form
      setValue("profilePicture", file);

      // Validate the file
      await trigger("profilePicture");

      // Update the image preview
      setImageURL(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (imageURL && imageURL.startsWith("blob:")) {
        URL.revokeObjectURL(imageURL);
      }
    };
  }, [imageURL]);

  const onSubmit = async (data) => {
    if (editProfile) {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("profilePicture", data.profilePicture);

      try {
        const response = await axiosInstance.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/profilePicture/save`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (response.data?.responseCode === "201") {
          toast.success(response?.data?.message);
          setValue(null);
          navigate(0);
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
    } else {
      toast.error("You currently dont have access to this setting ");
    }
  };

  // File validation rules
  const validateFileType = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!file) toast.error("No Image Found");
    return (
      validTypes.includes(file?.type) ||
      "Please upload a valid image file (JPEG, PNG, GIF)"
    );
  };

  const validateFileSize = (file) => {
    const maxSize = 1024 * 1024;
    if (!file) return true; // Skip validation if no file
    return file.size <= maxSize || "File size must be less than 1MB";
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

  // const seeProfile = true;
  const seeProfile = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 64)
  );
  const editProfile = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 63)
  );
  const createProfile = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 50)
  );
  const deleteProfile = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 2)
  );

  useEffect(() => {
    if (!seeProfile) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className=" overflow-x-auto mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <BreadcrumbsComponent items={breadcrumbItems} />
      </div>

      {/* Profile Settings Card */}
      <div className="bg-white dark:bg-neutral-900 shadow-xl rounded-3xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-8">
          Profile Settings
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-10">
          {/* Profile Image Upload */}
          <div
            className="relative h-48 w-48 lg:h-64 lg:w-64 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 hover:shadow-md transition cursor-pointer"
            onClick={handleIconClick}>
            {imageURL ? (
              <Avatar className="h-full w-full object-cover" src={imageURL} />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-9xl ">
                {getInitials(name)}
              </div>
            )}
            <Input
              type="file"
              {...register("profilePicture", {
                validate: {
                  validateFileType,
                  validateFileSize,
                },
              })}
              ref={(e) => {
                register("profilePicture").ref(e);
                fileInputRef.current = e;
              }}
              className="hidden"
              onChange={handleFileChange}
              accept="image/jpeg, image/png, image/gif, image/webp"
            />
          </div>

          {/* Upload Button */}
          <div className="flex flex-col items-center gap-2">
            {errors.profilePicture && (
              <p className="text-red-500 text-sm">
                {errors.profilePicture.message}
              </p>
            )}

            <ButtonComponent
              type="submit"
              className="bg-black text-white"
              content={isLoading ? "Updating..." : "Update Photo"}
              // disabled={createProfile}
            />
          </div>
        </form>

        {/* Personal Information Card */}
        <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-300 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              <span className="relative">
                Personal Information Details
                <UnderlineComponent />
              </span>
            </h3>
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-black" />
              <div className="w-2 h-2 rounded-full bg-slate-600" />
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EkyeDetailsComponent
                label="Full Name"
                placeholder={employeeData?.personalDetails?.fullName || "N/A"}
              />
              <EkyeDetailsComponent
                label="RCL ID"
                placeholder={rclId || "N/A"}
              />
              <EkyeDetailsComponent
                label="Email"
                placeholder={employeeData?.personalDetails?.email || "N/A"}
              />
            </div>

            <Divider />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EkyeDetailsComponent
                label="Phone"
                placeholder={employeeData?.personalDetails?.phone || "N/A"}
              />

              <EkyeDetailsComponent
                label="Date of Birth"
                placeholder={
                  employeeData?.personalDetails?.dateOfBirthAd || "N/A"
                }
              />
              <EkyeDetailsComponent
                label="Department"
                placeholder={
                  employeeData?.personalDetails?.departmentName || "N/A"
                }
              />
            </div>

            <Divider />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EkyeDetailsComponent
                label="Position"
                placeholder={
                  employeeData?.personalDetails?.postionName || "N/A"
                }
              />
            </div>
            <EkyeDetailsComponent
              label="Marital Status"
              placeholder={
                employeeData?.personalDetails?.married === true
                  ? "Married"
                  : employeeData?.personalDetails?.married === false
                  ? "Unmarried"
                  : "N/A"
              }
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
