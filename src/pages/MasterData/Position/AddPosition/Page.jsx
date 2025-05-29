import { useEffect, useState } from "react";
import BreadcrumbsComponent from "../../../../components/ui/BreadCrumbsComp.jsx";
import { useForm } from "react-hook-form";
import GoBack from "../../../../components/GoBack";
import InputComponent from "../../../../components/ui/InputComponent.jsx";
import { Textarea } from "@heroui/react";
import ButtonComponent from "../../../../components/ui/ButtonComp.jsx";
import axiosInstance from "../../../../lib/axios-Instance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import LocalStorageUtil from "../../../../utils/LocalStorageUtil";
import Loader from "../../../../components/Loader/Loader.jsx";
import {
  hasCreateAccess,
  MENU_NAMES,
} from "../../../../utils/permissionUtils.js";

const AddPosition = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsloading] = useState(false);
  const onSubmit = async (data) => {
    if (hasaccess) {
      setIsloading(true);
      const newPosition = {
        data: {
          positionName: data.title,
          description: data.description,
        },
      };

      try {
        const response = await axiosInstance.post(
          "/api/v1/positions/save",
          newPosition,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.responseCode === "201") {
          toast.success("Position added successfully!");
          navigate("/master-data/Position");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      } finally {
        setIsloading(false);
      }
    } else {
      toast.error("Currently You dont have access to this setting.");
    }
  };

  const hasaccess = hasCreateAccess(MENU_NAMES.POSITION);
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);
  const breadcrumbItems = [
    { label: "MasterData", href: "" },
    { label: "Position", href: "/master-data/Position" },
  ];

  /**To check The screen width */
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const getMaxRows = () => {
    if (screenWidth >= 1536) return 12; // 2xl
    if (screenWidth >= 1280) return 10; // xl
    if (screenWidth >= 1024) return 8; // lg
    if (screenWidth >= 768) return 6; // md
    return 4; // default for smaller screens
  };

  const getRows = () => {
    if (screenWidth >= 1536) return 10; // 2xl
    if (screenWidth >= 1280) return 8; // xl
    if (screenWidth >= 1024) return 6; // lg
    if (screenWidth >= 768) return 4; // md
    return 4; // default for smaller screens
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="px-4 flex flex-col space-y-4">
          {/* <BreadcrumbsComponent items={breadcrumbItems} /> */}
          <div className="flex justify-between">
            <GoBack />
            <div className="page-title -pl-2">Add Position</div>
            <div></div>
          </div>
          <div className="bg-white p-4 rounded-xl max-h-[85vh] overflow-y-auto border-2 border-gray-300 ">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-4">
              {/* position Title */}
              <div>
                <InputComponent
                  name="title"
                  control={control}
                  variant="bordered"
                  label="Position Name"
                  rules={{
                    required: "Title is required",
                    minLength: {
                      value: 3,
                      message: "Title must be at least 3 characters long.",
                    },
                    maxLength: {
                      value: 100,
                      message: "Title cannot exceed 100 characters.",
                    },
                  }}
                />
              </div>

              {/* Position description*/}
              <div>
                <Textarea
                  minRows={getRows()}
                  maxRows={getMaxRows()}
                  isInvalid={!!errors.description}
                  className={` rounded-xl `}
                  label="Description"
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message:
                        "Description must be at least 10 characters long.",
                    },
                    maxLength: {
                      value: 255,
                      message: "Description cannot exceed 255 characters long.",
                    },
                  })}
                  variant="bordered"
                />
                {errors.description && (
                  <p className="text-danger text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <ButtonComponent
                type="submit"
                className="bg-black text-white"
                content={isLoading ? "Adding..." : "Add Position"}
                disabled={isLoading}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPosition;
