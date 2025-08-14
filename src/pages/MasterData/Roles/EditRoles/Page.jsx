import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../../../components/Loader/Loader.jsx";
import axiosInstance from "../../../../lib/axios-Instance";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import InputComponent from "../../../../components/ui/InputComponent.jsx";
import TextAreaComp from "../../../../components/ui/TextAreaComp.jsx";
import ButtonComponent from "../../../../components/ui/ButtonComp.jsx";
import GoBack from "../../../../components/GoBack";
import { Checkbox } from "@heroui/react";
import {
  hasUpdateAccess,
  MENU_NAMES,
} from "../../../../utils/permissionUtils.js";

const EditRole = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [menusAndActions, setMenusAndActions] = useState([]);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      roleName: "",
      roleDescription: "",
    },
    mode: "onChange",
  });

  const NumroleId = parseInt(roleId);

  const hasaccess = hasUpdateAccess(MENU_NAMES.ROLES);

  // Redirect if no access
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  // Fetch the specific role data and menus/actions when component mounts
  useEffect(() => {
    const fetchRoleData = async () => {
      setIsLoading(true);
      try {
        // Fetch role details and menus/actions in parallel
        const [roleResponse, menusResponse] = await Promise.all([
          axiosInstance.get(`/api/v1/role/get/${NumroleId}`),
          axiosInstance.post("/api/v1/master/menus/and/actions/", {}),
        ]);

        if (roleResponse.data.responseCode === "200") {
          const roleData = roleResponse.data.data;

          // Reset form with fetched data
          reset({
            roleName: roleData?.roleName || "",
            roleDescription: roleData?.roleDescription || "",
          });

          // Get selected action IDs from role data
          // Adjust this based on your actual API response structure
          const selectedActionIds =
            roleData?.selectedActions ||
            roleData?.actions ||
            roleData?.permissions ||
            [];

          if (menusResponse.data.responseCode === "201") {
            const allMenusAndActions = menusResponse.data.data;

            // Mark actions as selected based on the role's permissions
            const updatedMenusAndActions = allMenusAndActions.map((menu) => {
              const updatedActions = menu.actions.map((action) => ({
                ...action,
                selected: selectedActionIds.includes(action.actionId),
              }));
              return { ...menu, actions: updatedActions };
            });

            setMenusAndActions(updatedMenusAndActions);
          } else {
            toast.error(
              menusResponse.data.message || "Failed to fetch menus and actions"
            );
          }
        } else {
          toast.error(
            roleResponse.data.message || "Failed to fetch role details"
          );
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "An error occurred while fetching data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (NumroleId && hasaccess) {
      fetchRoleData();
    }
  }, [NumroleId, reset, hasaccess]);

  // Calculate selected actions for updating
  const selectedActions = menusAndActions
    .map((menu) =>
      menu.actions
        .filter((action) => action.selected)
        .map((action) => action.actionId)
    )
    .flat();

  // Handle checkbox change for individual actions
  const handleActionSelect = (menuIndex, actionIndex, isChecked) => {
    // Create a deep copy of the menus and actions array
    const updatedMenusAndActions = [...menusAndActions];

    // Update the selected property of the action
    updatedMenusAndActions[menuIndex].actions[actionIndex].selected = isChecked;

    // Update state with the new array
    setMenusAndActions(updatedMenusAndActions);
  };

  // Select/Deselect all actions across all menus
  const SelectAll = (isChecked) => {
    const updatedMenusAndActions = menusAndActions.map((menu) => ({
      ...menu,
      actions: menu.actions.map((action) => ({
        ...action,
        selected: isChecked,
      })),
    }));

    setMenusAndActions(updatedMenusAndActions);
  };

  // Select/Deselect all actions in a specific menu
  const selectMenuAll = (menuIndex, isChecked) => {
    const updatedMenusAndActions = [...menusAndActions];

    updatedMenusAndActions[menuIndex].actions = updatedMenusAndActions[
      menuIndex
    ].actions.map((action) => ({
      ...action,
      selected: isChecked,
    }));

    // Update state with the new array
    setMenusAndActions(updatedMenusAndActions);
  };

  // Handle form submission to update the role
  const handleUpdateRole = async (formData) => {
    if (!hasaccess) {
      toast.error("Currently You don't have access to this setting.");
      return;
    }

    // Check if any actions are selected
    if (selectedActions.length === 0) {
      toast.warning("Please select at least one permission");
      return;
    }

    setIsLoading(true);

    const updatedRole = {
      data: {
        selectedActions: selectedActions,
        name: formData.roleName,
        description: formData.roleDescription,
        isActive: true,
      },
    };

    try {
      const response = await axiosInstance.put(
        `/api/v1/role/update/${NumroleId}`,
        updatedRole,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.responseCode === "200") {
        // toast.success(response.data.messages || "Role updated successfully");
        // Navigate back to roles list after successful update
        navigate("/master-data/Roles");
      } else {
        toast.error(response.data.message || "Failed to update role");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating the role"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show loader while fetching data or if no access
  if (isLoading) {
    return <Loader message="Loading data, please wait..." />;
  }

  if (!hasaccess) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <GoBack />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Edit Roles
            </h1>
            <div></div>
          </div>

          <div className="bg-whitedark:bg-black max-h[80vh] overflow-y-auto rounded-xl shadow-md border border-gray-200 flex-grow">
            <form
              onSubmit={handleSubmit(handleUpdateRole)}
              className="p-6 grid grid-cols-1 gap-6 ">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <InputComponent
                    name="roleName"
                    control={control}
                    variant="bordered"
                    label="Role Title"
                    rules={{
                      required: "Title is required",
                      minLength: {
                        value: 3,
                        message: "Title must be at least 3 characters long.",
                      },
                      maxLengt: {
                        value: 300,
                        message: "Title cannot exceed 300 characters.",
                      },
                      pattern: {
                        value: /^[^\s]/,
                        message: "Description cannot start with a space",
                      },
                    }}
                  />
                </div>
                <div>
                  <TextAreaComp
                    control={control}
                    name="roleDescription"
                    label="Role Description"
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
                  />
                </div>
              </div>

              {/* Menus and Actions Section */}
              <div className="mt-6">
                <div className="flex justify-between border-b border-gray-200 dark:border-neutral-600 pb-2 mb-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                    Permissions
                  </h3>
                  <div>
                    <Controller
                      name="SelectAllRoles"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          color="primary"
                          isSelected={field.value}
                          onValueChange={(isChecked) => {
                            field.onChange(isChecked);
                            SelectAll(isChecked);
                          }}>
                          Select All
                        </Checkbox>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 max-h-96 overflow-y-auto pr-2">
                  {menusAndActions.length > 0 ? (
                    menusAndActions.map((menu, menuIndex) => (
                      <div
                        key={menu.menuId}
                        className="border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex justify-between bg-gray-50 dark:bg-neutral-800 p-4 rounded-t-lg border-b border-gray-200 dark:border-neutral-600">
                          <div>
                            <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                              {menu.menuName}
                            </h4>
                            {/* <p className="text-sm text-gray-600 mt-1">
                              {menu.menuDescription}
                            </p> */}
                          </div>
                          <div>
                            <Controller
                              name={`SelectMenu_${menuIndex}`} // Give each menu its own control name
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  color="danger"
                                  isSelected={field.value}
                                  onValueChange={(isChecked) => {
                                    field.onChange(isChecked);
                                    selectMenuAll(menuIndex, isChecked);
                                  }}>
                                  Select All
                                </Checkbox>
                              )}
                            />
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {menu.actions.map((action, actionIndex) => (
                              <div
                                key={action.actionId}
                                className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-neutral-500 rounded-md">
                                <Checkbox
                                  size="sm"
                                  color="danger"
                                  isSelected={action.selected}
                                  onChange={(e) =>
                                    handleActionSelect(
                                      menuIndex,
                                      actionIndex,
                                      e.target.checked
                                    )
                                  }
                                />
                                <span className="text-sm text-gray-700 dark:text-white">
                                  {action.actionName}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No permissions available.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-start mt-8 space-x-4">
                <ButtonComponent
                  type="submit"
                  className="bg-black text-white "
                  content={isLoading ? "Updating..." : "Update Role"}
                  disabled={isLoading}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditRole;
