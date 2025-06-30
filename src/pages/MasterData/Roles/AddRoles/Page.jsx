import { Controller, useForm } from "react-hook-form";
import InputComponent from "../../../../components/ui/InputComponent.jsx";
import TextAreaComp from "../../../../components/ui/TextAreaComp.jsx";
import ButtonComponent from "../../../../components/ui/ButtonComp.jsx";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../lib/axios-Instance";
import { toast } from "sonner";
import { Button, Checkbox } from "@heroui/react";
import GoBack from "../../../../components/GoBack";
import Loader from "../../../../components/Loader/Loader.jsx";
import LocalStorageUtil from "../../../../utils/LocalStorageUtil";
import { useNavigate } from "react-router-dom";
import {
  hasCreateAccess,
  MENU_NAMES,
} from "../../../../utils/permissionUtils.js";

const AddRoles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [menusAndActions, setMenusAndActions] = useState([]);
  const navigate = useNavigate();

  const { control, handleSubmit, reset, setValue } = useForm();

  // Get all selected action IDs from the menus
  const getSelectedActions = () => {
    return menusAndActions
      .map((menu) =>
        menu.actions
          .filter((action) => action.selected)
          .map((action) => action.actionId)
      )
      .flat();
  };

  const hasaccess = hasCreateAccess(MENU_NAMES.ROLES);
  // const hasaccess = true;

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  const fetchMenusAndActions = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/v1/master/menus/and/actions/",
        {}
      );

      if (response.data.responseCode === "201") {
        // Remove duplicates and add selected property to each action
        const processedData = response.data.data.map((menu) => {
          // Remove duplicate actions based on actionId
          const uniqueActions = menu.actions.filter(
            (action, index, self) =>
              index === self.findIndex((a) => a.actionId === action.actionId)
          );

          return {
            ...menu,
            actions: uniqueActions.map((action) => ({
              ...action,
              selected: action.selected || false,
            })),
          };
        });
        setMenusAndActions(processedData);
      } else {
        toast.error(
          response.data.message || "Failed to fetch menus and actions"
        );
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
    fetchMenusAndActions();
  }, []);

  const handleActionSelect = (menuIndex, actionIndex, isChecked) => {
    setMenusAndActions((prevMenus) => {
      const updatedMenus = [...prevMenus];
      updatedMenus[menuIndex] = {
        ...updatedMenus[menuIndex],
        actions: updatedMenus[menuIndex].actions.map((action, idx) =>
          idx === actionIndex ? { ...action, selected: isChecked } : action
        ),
      };

      // Check if all actions in this menu are selected to update menu select all
      const allActionsInMenuSelected = updatedMenus[menuIndex].actions.every(
        (action) => action.selected
      );
      const noActionsInMenuSelected = updatedMenus[menuIndex].actions.every(
        (action) => !action.selected
      );

      if (allActionsInMenuSelected) {
        setValue(`SelectMenu_${menuIndex}`, true);
      } else if (noActionsInMenuSelected) {
        setValue(`SelectMenu_${menuIndex}`, false);
      } else {
        setValue(`SelectMenu_${menuIndex}`, false);
      }

      // Check if all menus are now selected/unselected to update main Select All
      const allMenusSelected = updatedMenus.every((menu) =>
        menu.actions.every((action) => action.selected)
      );
      const noMenusSelected = updatedMenus.every((menu) =>
        menu.actions.every((action) => !action.selected)
      );

      if (allMenusSelected) {
        setValue("SelectAllRoles", true);
      } else if (noMenusSelected) {
        setValue("SelectAllRoles", false);
      } else {
        setValue("SelectAllRoles", false);
      }

      return updatedMenus;
    });
  };

  const handleAddRole = async (data) => {
    if (hasaccess) {
      // Get the selected actions
      const selectedActions = getSelectedActions();

      // Check if any actions are selected
      if (selectedActions.length === 0) {
        toast.warning("Please select at least one permission");
        return;
      }

      const newRole = {
        data: {
          selectedActions: selectedActions,
          name: data.roleName,
          description: data.roleDescription,
          isActive: true,
        },
      };

      try {
        setIsLoading(true);
        const response = await axiosInstance.post(
          "/api/v1/role/save",
          newRole,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.responseCode === "201") {
          toast.success(response.data.message || "Role created successfully");
          reset();
          navigate("/master-data/Roles");

          // Reset all selections
          setMenusAndActions((prevMenus) =>
            prevMenus.map((menu) => ({
              ...menu,
              actions: menu.actions.map((action) => ({
                ...action,
                selected: false,
              })),
            }))
          );
        } else {
          toast.error(response.data.message || "Failed to create role");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Currently You dont have access to this setting.");
    }
  };

  const SelectAll = (isChecked) => {
    // Update all menu actions
    setMenusAndActions((prevMenus) =>
      prevMenus.map((menu) => ({
        ...menu,
        actions: menu.actions.map((action) => ({
          ...action,
          selected: isChecked,
        })),
      }))
    );

    // Update all individual menu select all checkboxes
    menusAndActions.forEach((menu, menuIndex) => {
      setValue(`SelectMenu_${menuIndex}`, isChecked);
    });
  };

  const selectMenuAll = (menuIndex, isChecked) => {
    setMenusAndActions((prevMenus) => {
      const updatedMenus = [...prevMenus];
      updatedMenus[menuIndex] = {
        ...updatedMenus[menuIndex],
        actions: updatedMenus[menuIndex].actions.map((action) => ({
          ...action,
          selected: isChecked,
        })),
      };

      // Check if all menus are now selected/unselected to update main Select All
      const allMenusSelected = updatedMenus.every((menu) =>
        menu.actions.every((action) => action.selected)
      );
      const noMenusSelected = updatedMenus.every((menu) =>
        menu.actions.every((action) => !action.selected)
      );

      if (allMenusSelected) {
        setValue("SelectAllRoles", true);
      } else if (noMenusSelected) {
        setValue("SelectAllRoles", false);
      } else {
        setValue("SelectAllRoles", false);
      }

      return updatedMenus;
    });
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <GoBack />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Add Roles
            </h1>
            <div></div>
          </div>
          {/* <Button onPress={fetchMenusAndActions}>Reload</Button> */}

          <div className="bg-white dark:bg-black max-h[80vh] overflow-y-auto rounded-xl shadow-md border border-gray-200 flex-grow">
            <form
              onSubmit={handleSubmit(handleAddRole)}
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
                    }}
                  />
                </div>
              </div>

              {/* Menus and Actions Section */}
              <div className="mt-6">
                <div className="flex justify-between border-b border-gray-200 pb-2 mb-4">
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
                          isSelected={field.value || false}
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
                        key={`menu-${menu.menuId}-${menuIndex}`}
                        className="border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex justify-between bg-gray-50 dark:bg-slate-500 p-4 rounded-t-lg border-b border-gray-200">
                          <div>
                            <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                              {menu.menuDescription}
                            </h4>
                            {/* <p className="text-sm text-gray-600 mt-1">
                              {menu.menuDescription}
                            </p> */}
                          </div>
                          <div>
                            <Controller
                              name={`SelectMenu_${menuIndex}`}
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  color="primary"
                                  isSelected={field.value || false}
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
                                key={`action-${action.actionId}-${menuIndex}-${actionIndex}`}
                                className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-slate-400 rounded-md">
                                <Checkbox
                                  size="sm"
                                  color="primary"
                                  isSelected={action.selected || false}
                                  onValueChange={(isChecked) =>
                                    handleActionSelect(
                                      menuIndex,
                                      actionIndex,
                                      isChecked
                                    )
                                  }
                                />
                                <div className="flex flex-col text-gray-700 dark:text-white">
                                  <span className="text-sm ">
                                    {action.actionName}
                                  </span>
                                  <span className="text-sm ">
                                    {action.actionDescription}
                                  </span>
                                </div>
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
                  className="bg-black text-white hover:bg-gray-800"
                  content="Save Role"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddRoles;
