import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputComponent from "../../../../components/ui/InputComponent.jsx";
import { Textarea } from "@heroui/react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../../../components/ui/ButtonComp.jsx";
import GoBack from "../../../../components/GoBack";
import Loader from "../../../../components/Loader/Loader.jsx";
import ReusableAutocomplete from "../../../../components/ui/SearableDropdown";
import {
  hasCreateAccess,
  MENU_NAMES,
} from "../../../../utils/permissionUtils.js";
import {
  useCreateDepartment,
  useFetchTeamLead,
} from "../../../../hooks/useAuth.js";

const AddDepartment = () => {
  const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // React Query hooks
  const { mutate: createDepartment, isPending: isCreating } =
    useCreateDepartment();
  const {
    data: teamLeadResponse,
    isLoading: isLoadingTeamLead,
    error: teamLeadError,
  } = useFetchTeamLead();

  // Form setup
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
      teamlead: "",
      Associateteamlead: "",
    },
    mode: "onChange",
  });

  // Permission check
  const hasAccess = hasCreateAccess(MENU_NAMES.DEPARTMENT);

  // Screen width handling
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Access control
  useEffect(() => {
    if (!hasAccess) {
      navigate("/dashboard");
    }
  }, [hasAccess, navigate]);

  // Handle team lead error
  useEffect(() => {
    if (teamLeadError) {
      toast.error("Failed to load team leads. Please try again.");
    }
  }, [teamLeadError]);

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

  const onSubmit = (data) => {
    if (!hasAccess) {
      toast.error("Currently you don't have access to this setting.");
      return;
    }

    const departmentData = {
      data: {
        departmentName: data.title,
        description: data.description,
        teamLeadId: parseFloat(data.teamlead),
        associateTeamLeadId: parseFloat(data.Associateteamlead),
      },
    };

    createDepartment(departmentData, {
      onSuccess: () => {
        reset(); // Reset form on successful creation
      },
    });
  };

  // Transform team lead data for dropdown
  const teamLeadOptions =
    teamLeadResponse?.datalist?.map((item) => ({
      key: item.userId,
      label: item.fullName,
    })) || [];

  // Show loader while loading team leads or during creation
  const isLoading = isLoadingTeamLead || isCreating;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="px-4 flex flex-col space-y-4">
          <div className="flex justify-between">
            <GoBack />
            <div className="page-title -pl-2">Add Department</div>
            <div></div>
          </div>

          <div className="bg-white dark:bg-black p-4 rounded-xl max-h-[85vh] overflow-y-auto border-2 border-gray-300">
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

              {/* Department Description */}
              <div>
                <Textarea
                  minRows={getRows()}
                  maxRows={getMaxRows()}
                  isInvalid={!!errors.description}
                  className="rounded-xl"
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
                      message: "Description cannot exceed 255 characters.",
                    },
                    pattern: {
                      value: /^[^\s]/,
                      message: "Description cannot start with a space",
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
                  <ReusableAutocomplete
                    name="teamlead"
                    control={control}
                    label="Team Lead"
                    items={teamLeadOptions}
                    // rules={{ required: "Team Lead is required" }}
                    disabled={isLoadingTeamLead}
                  />
                </div>

                {/* Associate Team Leader */}
                <div>
                  <ReusableAutocomplete
                    name="Associateteamlead"
                    control={control}
                    label="Associate Team Lead"
                    items={teamLeadOptions}
                    // rules={{ required: "Associate Team Lead is required" }}
                    disabled={isLoadingTeamLead}
                  />
                </div>
              </div>

              <ButtonComponent
                type="submit"
                className="bg-black text-white "
                content={isCreating ? "Adding..." : "Add Department"}
                disabled={isCreating || isLoadingTeamLead}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddDepartment;
