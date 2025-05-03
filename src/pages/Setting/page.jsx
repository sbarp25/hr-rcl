import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import BreadcrumbsComponent from "../../components/BreadCrumbsComp";
import axiosInstance from "../../lib/axios-Instance";
import { toast } from "react-toastify";
import ButtonComponent from "../../components/ButtonComp";
import { Input, Avatar } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
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
  };

  // File validation rules
  const validateFileType = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!file) toast.error("No Image Found");
    return (
      validTypes.includes(file?.type) ||
      "Please upload a valid image file (JPEG, PNG, GIF, or WEBP)"
    );
  };

  const validateFileSize = (file) => {
    const maxSize = 1024 * 1024;
    if (!file) return true; // Skip validation if no file
    return file.size <= maxSize || "File size must be less than 1MB";
  };

  return (
    <div className="mx-auto p-6">
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
            className="relative h-64 w-64 rounded-full overflow-hidden border-2 border-gray-400 cursor-pointer"
            onClick={handleIconClick}>
            {imageURL ? (
              <Avatar className="h-full w-full object-cover" src={imageURL} />
            ) : (
              <Avatar className="h-full w-full object-cover" src={imageURL} />
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

          {/* Error messages for file validation */}
          {errors.profilePicture && (
            <div className="text-danger text-sm mt-1">
              {errors.profilePicture.message}
            </div>
          )}

          <div className="flex items-center">
            <ButtonComponent
              type="submit"
              content={isLoading ? "Updating..." : "Update Photo"}
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
