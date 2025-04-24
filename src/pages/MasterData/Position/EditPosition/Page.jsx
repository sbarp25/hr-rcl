import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../lib/axios-Instance";
import { toast } from "react-toastify";
import BreadcrumbsComponent from "../../../../components/BreadCrumbsComp";
import GoBack from "../../../../components/GoBack";
import InputComponent from "../../../../components/InputComponent";
import { Textarea } from "@nextui-org/react";
import ButtonComponent from "../../../../components/ButtonComp";

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
    { label: "Dashboard", href: "/" },
    { label: "MasterData", href: "" },
    { label: "Position", href: "/master-data/Position" },
  ];
  const onSubmit = async (data) => {
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
  };
  const hasaccess = true;
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);
  return (
    <div className="px-4 flex flex-col space-y-4">
      <BreadcrumbsComponent items={breadcrumbItems} />
      <div className="flex justify-between">
        <div className="page-title -pl-2">Edit Position</div>
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

          {/* Position description*/}
          <div>
            <Controller
              name="description"
              control={control}
              rules={{
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters long.",
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
            {/* <Textarea
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
            )} */}
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

export default EditPosition;
