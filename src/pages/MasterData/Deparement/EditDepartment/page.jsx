import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputComponent from "../../../../components/ui/InputComponent.jsx";
import { Textarea } from "@heroui/react";
import ButtonComponent from "../../../../components/ui/ButtonComp.jsx";
import GoBack from "../../../../components/GoBack";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "sonner";
import Loader from "../../../../components/Loader/Loader.jsx";
import ReusableAutocomplete from "../../../../components/ui/SearableDropdown";
import {
  hasUpdateAccess,
  MENU_NAMES,
} from "../../../../utils/permissionUtils.js";
import {
  useEditDepartment,
  useFetchTeamLead,
  useIndivisualDepartment,
} from "../../../../hooks/useAuth.js";

const EditDepartment = () => {
  const { id } = useParams();
  const longid = parseInt(id);
  const navigate = useNavigate();
  const {
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
    mode: "onChange",
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

  const { data: teamLead, isLoading: isTeamLeadLoading } = useFetchTeamLead();
  const { data } = useIndivisualDepartment(longid);
  const editDepartmentMutation = useEditDepartment();

  // Check if any loading operation is in progress
  const isLoading = isTeamLeadLoading || editDepartmentMutation.isPending;

  useEffect(() => {
    if (data) {
      reset({
        title: data?.name,
        description: data?.description,
        Associateteamlead: data?.associateTeamLeadId,
        teamlead: data?.teamLeadId,
      });
    }
  }, [data, reset]);

  const onSubmit = async (data) => {
    if (hasaccess) {
      const updatedDepartment = {
        data: {
          departmentName: data.title,
          description: data.description,
          associateTeamLeadId: parseFloat(data.Associateteamlead),
          teamLeadId: parseFloat(data.teamlead),
        },
      };
      try {
        editDepartmentMutation.mutate({ updatedDepartment, longid });
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Something went wrong";
        toast.error(errorMessage);
      }
    } else {
      toast.error("Currently You dont have access to this setting.");
    }
  };

  const teamLeadid = teamLead?.datalist?.map((item) => ({
    key: item.userId, // Using id as the key
    label: item.fullName, // Using fullName as the display label
  }));

  const hasaccess = hasUpdateAccess(MENU_NAMES.DEPARTMENT);

  // const hasaccess = true;
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
            <div className="page-title -pl-2">Edit Department</div>
            <div></div>
          </div>
          <div className="bg-white dark:bg-black p-4 rounded-xl max-h-[85vh] overflow-y-auto border-2 border-gray-300 dark:border-neutral-600 ">
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
                    minLength: {
                      value: 3,
                      message: "Title must be at least 3 characters long.",
                    },
                    maxLength: {
                      value: 100,
                      message: "Title cannot exceed 100 characters.",
                    },
                    pattern: {
                      value: /^[^\s]/,
                      message: "Title cannot start with a space",
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
                      message:
                        "Description must be at least 10 characters long.",
                    },
                    pattern: {
                      value: /^[^\s]/,
                      message: "Description cannot start with a space",
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
                  <ReusableAutocomplete
                    name="teamlead"
                    control={control}
                    label="Team Lead"
                    items={teamLeadid}
                    // rules={{ required: "Team Lead is required" }}
                  />
                </div>

                {/* Associate Team Leader */}
                <div>
                  <ReusableAutocomplete
                    name="Associateteamlead"
                    control={control}
                    label="Associate Team Lead"
                    items={teamLeadid}
                    // rules={{ required: "AssociateTeam Lead is required" }}
                  />
                </div>
              </div>
              <ButtonComponent
                type="submit"
                className="bg-black text-white "
                content={
                  editDepartmentMutation.isPending ? "Updating..." : "Update"
                }
                disabled={editDepartmentMutation.isPending}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditDepartment;
