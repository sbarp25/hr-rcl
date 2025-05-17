import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Input } from "@nextui-org/react";
import { IoReturnDownBack } from "react-icons/io5";
import Loader from "../../../../components/Loader";
import axiosInstance from "../../../../lib/axios-Instance";
import BreadcrumbsComponent from "../../../../components/BreadCrumbsComp";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import InputComponent from "../../../../components/InputComponent";
import TextAreaComp from "../../../../components/TextAreaComp";
import LocalStorageUtil from "../../../../utils/LocalStorageUtil";
import ButtonComponent from "../../../../components/ButtonComp";
import GoBack from "../../../../components/GoBack";

const EditRole = () => {
  const { roleId } = useParams(); // Get the role ID from URL
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [menusAndActions, setMenusAndActions] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const { control, handleSubmit, reset } = useForm();
  // Breadcrumb setup
  const NumroleId = parseInt(roleId);
  const breadcrumbItems = [
    { label: "MasterData", href: "" },
    { label: "Roles", href: "/master-data/Roles" },
    { label: "Edit Role", href: `/master-data/Roles/edit/${NumroleId}` },
  ];

  // Fetch the specific role data and menus/actions when component mounts
  useEffect(() => {
    const fetchRoleData = async () => {
      setIsLoading(true);
      try {
        // Fetch role details
        const roleResponse = await axiosInstance.get(
          `/api/v1/role/get/${NumroleId}`
        );
        if (roleResponse.data.responseCode === "200") {
          const roleData = roleResponse.data.data;
          reset({
            roleName: roleData?.roleName,
            roleDescription: roleData?.roleDescription,
          });
          setRoleName(roleData.roleName || "");
          setRoleDescription(roleData.roleDescription || "");
        } else {
          toast.error(
            roleResponse.data.message || "Failed to fetch role details"
          );
        }

        // Fetch menus and actions
        const menusResponse = await axiosInstance.post(
          "/api/v1/master/menus/and/actions/",
          {}
        );
        if (menusResponse.data.responseCode === "201") {
          // First set all menus and actions
          const allMenusAndActions = menusResponse.data.data;

          // Now fetch selected actions for this role
          // const selectedActionsResponse = await axiosInstance.get(
          //   `/api/v1/role/actions/${NumroleId}`
          // );
          // if (selectedActionsResponse.data.responseCode === "200") {
          //   const selectedActionIds = selectedActionsResponse.data.data || [];

          //   // Mark actions as selected based on the role's permissions
          //   const updatedMenusAndActions = allMenusAndActions.map((menu) => {
          //     const updatedActions = menu.actions.map((action) => ({
          //       ...action,
          //       selected: selectedActionIds.includes(action.actionId),
          //     }));
          //     return { ...menu, actions: updatedActions };
          //   });

          //   setMenusAndActions(updatedMenusAndActions);
          // }
        } else {
          toast.error(
            menusResponse.data.message || "Failed to fetch menus and actions"
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(
          error.response?.data?.message ||
            "An error occurred while fetching data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    // if (NumroleId) {
    fetchRoleData();
    // }
  }, [NumroleId, reset]);

  // Calculate selected actions for updating
  const selectedActions = menusAndActions
    .map((menu) =>
      menu.actions
        .filter((action) => action.selected)
        .map((action) => action.actionId)
    )
    .flat();

  // Handle form submission to update the role
  const handleUpdateRole = async (e) => {
    if (hasaccess) {
      // e.preventDefault();
      setIsLoading(true);

      const updatedRole = {
        data: {
          selectedActions: selectedActions,
          roleName: roleName,
          description: roleDescription,
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
          toast.success(response.data.messages || "Role updated successfully");
          // Navigate back to roles list after successful update
          navigate("/master-data/Roles");
        } else {
          toast.error(response.data.message || "Failed to update role");
        }
      } catch (error) {
        console.error("Error updating role:", error);
        toast.error(
          error.response?.data?.message ||
            "An error occurred while updating the role"
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Currently You dont have access to this setting.");
    }
  };

  const handleCancel = () => {
    navigate("/master-data/Roles");
  };

  const menu = LocalStorageUtil.getItem("menu");

  const hasaccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 53)
  );

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  return (
    <>
      {isLoading && <Loader message="Loading data, please wait..." />}
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <GoBack />
          <h1 className="text-2xl font-bold text-gray-800">Edit Roles</h1>
          <div></div>
        </div>

        {/* Edit Form */}
        <Form
          onSubmit={handleSubmit(handleUpdateRole)}
          className="mb-6 p-6 bg-white shadow-md rounded-xl  mx-auto border-2 border-gray-300">
          <div className="grid grid-cols-1 gap-6 w-full">
            <div className="flex flex-col gap-6 w-full">
              <div>
                <InputComponent
                  control={control}
                  name="roleName"
                  label="Role Title"
                  variant="bordered"
                  rules={{
                    required: "Title is required",
                    pattern: {
                      value: /^[a-zA-Z0-9 ]{3,300}$/,
                      message: "Title must be 3-300 characters long.",
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
            <div className="w-full max-h-80 overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Menus and Actions
              </h3>
              {menusAndActions.length > 0 ? (
                menusAndActions.map((menu) => (
                  <div key={menu.menuId} className="mb-6">
                    <div className="border border-gray-300 p-4 bg-gray-50 rounded-md">
                      <strong className="text-lg text-gray-800">
                        {menu.menuName}
                      </strong>
                      <p className="text-sm text-gray-600">
                        {menu.menuDescription}
                      </p>
                    </div>
                    <ul className="pl-6 mt-4">
                      {menu.actions.map((action) => (
                        <li key={action.actionId} className="mb-3">
                          <label className="flex flex-row w-fit items-center gap-3 text-sm text-gray-700">
                            <Input
                              type="checkbox"
                              className="checkbox"
                              checked={action.selected}
                              onChange={(e) => {
                                const updatedMenus = menusAndActions.map(
                                  (m) => {
                                    if (m.menuId === menu.menuId) {
                                      const updatedActions = m.actions.map(
                                        (a) => {
                                          if (a.actionId === action.actionId) {
                                            return {
                                              ...a,
                                              selected: e.target.checked,
                                            };
                                          }
                                          return a;
                                        }
                                      );
                                      return { ...m, actions: updatedActions };
                                    }
                                    return m;
                                  }
                                );
                                setMenusAndActions(updatedMenus);
                              }}
                            />
                            <span className="ml-2">{action.actionName}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No menus found.</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center gap-x-4 mt-6">
            <ButtonComponent
              type="submit"
              className="bg-black text-white"
              content={isLoading ? "Editing..." : "Edit"}
              disabled={isLoading}
            />
          </div>
        </Form>
      </div>
    </>
  );
};

export default EditRole;
