import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputComponent from "../../../../components/InputComponent";
import { Textarea } from "@nextui-org/react";
import ButtonComponent from "../../../../components/ButtonComp";
import axiosInstance from "../../../../lib/axios-Instance";
import BreadcrumbsComponent from "../../../../components/BreadCrumbsComp";
import GoBack from "../../../../components/GoBack";
import { useNavigate, useParams } from "react-router-dom";
import SelectComp from "../../../../components/Select";
import { toast, ToastContainer } from "react-toastify";

const EditDepartment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [teamLead, setTeamLead] = useState([]);

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

  {
    /**To fetch Department Data */
  }
  const fetchDepartmentById = async () => {
    setIsLoading(true);
    try {
      // const response = await axiosInstance.get(`/api/v1/departments/get/${id}`);
      const response = await axiosInstance.post(
        `/api/v1/departments/get/{id}`,
        {
          id: parseFloat(id),
        }
      );
      if (response.data.responseCode === "200") {
        const data = response.data.data;
        reset({
          title: data?.name,
          description: data?.description,
          Associateteamlead: data?.associateTeamLeadId,
          teamlead: data?.teamLeadId,
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchTeamLead();
    fetchDepartmentById();
  }, []);

  const breadcrumbItems = [
    { label: "MasterData", href: "" },
    { label: "Department", href: "/master-data/Department" },
  ];

  const onSubmit = async (data) => {
    const updatedDepartment = {
      data: {
        departmentName: data.title,
        description: data.description,
        associateTeamLeadId: parseFloat(data.Associateteamlead),
        teamLeadId: parseFloat(data.teamlead),
      },
    };
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axiosInstance.put(
        `/api/v1/departments/update/${id}`,
        updatedDepartment,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response?.data?.responseCode === "200") {
        navigate("/master-data/Department");
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
  const teamLeadid = teamLead.map((item) => ({
    key: item.userId, // Using id as the key
    label: item.fullName, // Using fullName as the display label
  }));

  const hasaccess = true;
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  return (
    <div className="px-4 flex flex-col space-y-4">
      {/* <BreadcrumbsComponent items={breadcrumbItems} /> */}
      <div className="flex justify-between">
        <GoBack />
        <div className="page-title -pl-2">Edit Department</div>
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
              // value={}
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
          </div>
          {/* Team Leader */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            content={isLoading ? "Editing..." : "Edit"}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default EditDepartment;
