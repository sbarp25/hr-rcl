import { useEffect, useState } from "react";
import BreadcrumbsComponent from "../../../../components/BreadCrumbsComp";
import { useForm } from "react-hook-form";
import GoBack from "../../../../components/GoBack";
import InputComponent from "../../../../components/InputComponent";
import { Textarea } from "@nextui-org/react";
import ButtonComponent from "../../../../components/ButtonComp";
import axiosInstance from "../../../../lib/axios-Instance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
  };
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
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
    <div className="px-4 flex flex-col space-y-4">
      <BreadcrumbsComponent items={breadcrumbItems} />
      <div className="flex justify-between">
        <div className="page-title -pl-2">Add Position</div>
        <GoBack />
      </div>
      <div className="bg-white p-4 rounded-xl max-h-[85vh] overflow-y-auto border-2 border-gray-300 ">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-4">
          {/* Department Title */}
          <div>
            <InputComponent
              name="title"
              control={control}
              variant="bordered"
              label="Position Name"
              rules={{
                required: "Title is required",
                pattern: {
                  value: /^[a-zA-Z0-9 ]{3,300}$/,
                  message: "Title must be 3-300 characters long.",
                },
              }}
            />
          </div>

          {/* Department description*/}
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
                  message: "Description must be at least 10 characters long.",
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
            content={isLoading ? "Submitting..." : "Submit"}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default AddPosition;
