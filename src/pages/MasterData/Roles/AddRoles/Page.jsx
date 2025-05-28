import { Controller, useForm } from "react-hook-form";
import InputComponent from "../../../../components/ui/InputComponent.jsx";
import TextAreaComp from "../../../../components/ui/TextAreaComp.jsx";
import ButtonComponent from "../../../../components/ui/ButtonComp.jsx";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../lib/axios-Instance";
import { toast } from "sonner";
import { Checkbox } from "@nextui-org/react";
import GoBack from "../../../../components/GoBack";
import Loader from "../../../../components/Loader/Loader.jsx";
import LocalStorageUtil from "../../../../utils/LocalStorageUtil";
import { useNavigate } from "react-router-dom";

const AddRoles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [menusAndActions, setMenusAndActions] = useState([]);
  const navigate = useNavigate();

  const { control, handleSubmit, reset } = useForm();

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
  const menu = LocalStorageUtil.getItem("menu");

  const hasaccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 51)
  );

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);
  useEffect(() => {
    const fetchMenusAndActions = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post(
          "/api/v1/master/menus/and/actions/",
          {}
        );

        if (response.data.responseCode === "201") {
          // Add selected property to each action
          const processedData = response.data.data.map((menu) => ({
            ...menu,
            actions: menu.actions.map((action) => ({
              ...action,
              selected: action.selected || false,
            })),
          }));

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

    fetchMenusAndActions();
  }, []);

  const handleActionSelect = (menuIndex, actionIndex, isChecked) => {
    // Create a deep copy of the menus and actions array
    const updatedMenusAndActions = [...menusAndActions];

    // Update the selected property of the action
    updatedMenusAndActions[menuIndex].actions[actionIndex].selected = isChecked;

    // Update state with the new array
    setMenusAndActions(updatedMenusAndActions);
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
          const resetMenus = menusAndActions.map((menu) => ({
            ...menu,
            actions: menu.actions.map((action) => ({
              ...action,
              selected: false,
            })),
          }));
          setMenusAndActions(resetMenus);
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
    const updatedMenusAndActions = menusAndActions.map((menu) => ({
      ...menu,
      actions: menu.actions.map((action) => ({
        ...action,
        selected: isChecked,
      })),
    }));

    setMenusAndActions(updatedMenusAndActions);
  };

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

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <GoBack />
            <h1 className="text-2xl font-bold text-gray-800">Add Roles</h1>
            <div></div>
          </div>

          <div className="bg-white max-h[80vh] overflow-y-auto rounded-xl shadow-md border border-gray-200 flex-grow">
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
                  <h3 className="text-lg font-medium text-gray-800 ">
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
                        <div className="flex justify-between bg-gray-50 p-4 rounded-t-lg border-b border-gray-200">
                          <div>
                            <h4 className="text-md font-semibold text-gray-800">
                              {menu.menuName}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {menu.menuDescription}
                            </p>
                          </div>
                          <div>
                            <Controller
                              name={`SelectMenu_${menuIndex}`} // Give each menu its own control name
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  color="primary"
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
                                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md">
                                <Checkbox
                                  size="sm"
                                  color="primary"
                                  isSelected={action.selected}
                                  onChange={(e) =>
                                    handleActionSelect(
                                      menuIndex,
                                      actionIndex,
                                      e.target.checked
                                    )
                                  }
                                />
                                <span className="text-sm text-gray-700">
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
