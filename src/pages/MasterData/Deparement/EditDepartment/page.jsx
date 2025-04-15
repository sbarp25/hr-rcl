import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputComponent from "../../../../components/InputComponent";
import { Select, SelectItem, Textarea } from "@nextui-org/react";
import ButtonComponent from "../../../../components/ButtonComp";
import axiosInstance from "../../../../lib/axios-Instance";
import BreadcrumbsComponent from "../../../../components/BreadCrumbsComp";
import GoBack from "../../../../components/GoBack";

const EditDepartment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [teamLead, setTeamLead] = useState([]);
  const [associateTeamLead, setAssociateTeamLead] = useState([]);
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
    watch,
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
      const response = await axiosInstance.post(
        "/api/v1/departments/team-leads"
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
    /**To fetch Associate Team lead */
  }
  const fetchAssociateTeamLead = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/v1/departments/associate-team-leads"
      );
      if (response.data.responseCode === "200") {
        setAssociateTeamLead(response.data.datalist);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchTeamLead();
    fetchAssociateTeamLead();
  }, []);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "MasterData", href: "" },
    { label: "Department", href: "/master-data/Department" },
  ];

  const onSubmit = async (data) => {
    console.log(data);
  };
  return (
    <div className="px-4 flex flex-col space-y-4">
      <BreadcrumbsComponent items={breadcrumbItems} />
      <div className="flex justify-between">
        <div className="page-title -pl-2">Edit Department</div>
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
          {/* Team Leader */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Controller
                name="teamlead"
                control={control}
                rules={{ required: "Team Lead is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    variant="bordered"
                    label="Team Leader"
                    isInvalid={!!errors.teamlead}
                    className={`rounded-xl`}
                    selectedKeys={field.value ? [field.value] : []}
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys)[0])
                    }>
                    {teamLead.map((team) => (
                      <SelectItem key={team.key} value={team.key}>
                        {team.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
              {errors.teamlead && (
                <p className="text-danger text-sm">{errors.teamlead.message}</p>
              )}
            </div>
            {/* Associate Team Leader */}
            <div>
              <Controller
                name="Associateteamlead"
                control={control}
                rules={{ required: "Associate Team Lead is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    variant="bordered"
                    label="Associate Team Leader"
                    isInvalid={!!errors.teamlead}
                    className={`rounded-xl`}
                    selectedKeys={field.value ? [field.value] : []}
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys)[0])
                    }>
                    {associateTeamLead.map((team) => (
                      <SelectItem key={team.key} value={team.key}>
                        {team.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
              {errors.Associateteamlead && (
                <p className="text-danger text-sm">
                  {errors.Associateteamlead.message}
                </p>
              )}
            </div>
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

export default EditDepartment;
