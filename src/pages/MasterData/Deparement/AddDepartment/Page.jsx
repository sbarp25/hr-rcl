import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputComponent from "../../../../components/InputComponent";
import { Input, Textarea } from "@nextui-org/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../lib/axios-Instance";
import ButtonComponent from "../../../../components/ButtonComp";
import BreadcrumbsComponent from "../../../../components/BreadCrumbsComp";
import GoBack from "../../../../components/GoBack";
import SelectComp from "../../../../components/Select";
import LocalStorageUtil from "../../../../utils/LocalStorageUtil";

const AddDepartment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [teamLead, setTeamLead] = useState([]);

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

  const hasaccess = true;

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);
  /**To fetch Team lead */
  const fetchTeamLead = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        "/api/v1/departments/get_all_users_name_id"
      );
      if (response.data.responseCode === "200") {
        setTeamLead(response.data.datalist);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchTeamLead();
  }, []);

  const onSubmit = async (data) => {
    const AddDepartment = {
      data: {
        departmentName: data?.title,
        description: data?.description,
        teamLeadId: parseFloat(data?.teamlead),
        associateTeamLeadId: parseFloat(data?.Associateteamlead),
      },
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Authentication token is missing.");
        setIsLoading(false);
        return;
      }

      const response = await axiosInstance.post(
        "/api/v1/departments/register",
        AddDepartment,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response?.data.responseCode === "201") {
        navigate("/master-data/Department");
        toast.success(response?.data?.message);
        reset();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const menu = LocalStorageUtil.getItem("menu");

  /**To check Employee see status */
  const seeEmployee = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 2)
  );

  const teamLeadid = teamLead.map((item) => ({
    key: item.userId, // Using id as the key
    label: item.fullName, // Using fullName as the display label
  }));

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="px-4 flex flex-col space-y-4">
      {/* <BreadcrumbsComponent items={breadcrumbItems} /> */}
      <div className="flex justify-between">
        <GoBack />
        <div className="page-title -pl-2">Add Department</div>
        <div></div>
      </div>
      <div className="bg-white p-4 rounded-xl max-h-[85vh] overflow-y-auto border-2 border-gray-300 ">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-4">
          {/* Department Title */}
          <div>
            <InputComponent
              name="title"
              control={control}
              variant="bordered"
              label="Title"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Team Leader */}
            <div>
              <SelectComp
                name="teamlead"
                label="Team Lead"
                control={control}
                rules={{ required: "Team Lead is required" }}
                data={teamLeadid}
                valueKey="key"
                labelKey="label"
              />
            </div>

            {/* Associate Team Leader */}
            <div>
              <SelectComp
                name="Associateteamlead"
                label="Associate Team Lead"
                control={control}
                rules={{ required: "Associate Team Lead is required" }}
                data={teamLeadid}
                valueKey="key"
                labelKey="label"
              />
            </div>
          </div>
          <ButtonComponent
            type="submit"
            className="bg-black text-white"
            content={isLoading ? "Adding..." : "Add Department"}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
