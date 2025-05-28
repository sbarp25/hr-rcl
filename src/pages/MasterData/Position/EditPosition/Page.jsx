import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../lib/axios-Instance";
import { toast } from "sonner";
import BreadcrumbsComponent from "../../../../components/ui/BreadCrumbsComp.jsx";
import GoBack from "../../../../components/GoBack";
import InputComponent from "../../../../components/ui/InputComponent.jsx";
import { Textarea } from "@nextui-org/react";
import ButtonComponent from "../../../../components/ui/ButtonComp.jsx";
import LocalStorageUtil from "../../../../utils/LocalStorageUtil";
import Loader from "../../../../components/Loader/Loader.jsx";

const EditPosition = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      leaveType: "",
      teamlead: "",
      Associateteamlead: "",
    },
  });
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

  const fetchPositionData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/api/v1/positions/get/${id}`);
      if (response.data.responseCode === "200") {
        const data = response.data.data;
        reset({
          title: data?.positionName,
          description: data?.description,
        });
      } else {
        toast.error(response.data.message);
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
  useEffect(() => {
    fetchPositionData();
  }, []);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "MasterData", href: "" },
    { label: "Position", href: "/master-data/Position" },
  ];
  const onSubmit = async (data) => {
    if (hasaccess) {
      const updatePosition = {
        data: {
          positionName: data.title,
          description: data.description,
        },
      };
      setIsLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axiosInstance.put(
          `/api/v1/positions/update/${id}`,
          updatePosition,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response?.data?.responseCode === "200") {
          navigate("/master-data/Position");
          toast.success(response?.data?.message);
          reset();
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Something went wrong";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Currently You dont have access to this setting.");
    }
  };
  const menu = LocalStorageUtil.getItem("menu");

  /**To check Employee see status */
  const hasaccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 49)
  );
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="px-4 flex flex-col space-y-4">
          {/* <BreadcrumbsComponent items={breadcrumbItems} /> */}
          <div className="flex justify-between">
            <GoBack />
            <div className="page-title -pl-2">Edit Position</div>
            <div></div>
          </div>
          <div className="bg-white p-4 rounded-xl max-h-[85vh] overflow-y-auto border-2 border-gray-300 ">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-4">
              {/* Position Title */}
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
                <Controller
                  name="description"
                  control={control}
                  rules={{
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message:
                        "Description must be at least 10 characters long.",
                    },
                    maxLength: {
                      value: 255,
                      message: "Title cannot exceed 300 characters.",
                    },
                  }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      minRows={getRows()}
                      maxRows={getMaxRows()}
                      isInvalid={!!errors.description}
                      className="rounded-xl"
                      label="Description"
                      variant="bordered"
                    />
                  )}
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
                content={isLoading ? "Updating..." : "Update"}
                disabled={isLoading}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditPosition;
