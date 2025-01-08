import React, { useEffect, useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import Loader from "../../../components/Loader";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import { Button, Form, Input } from "@nextui-org/react";

const Roles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [addRole, setAddRole] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [menusAndActions, setMenusAndActions] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(false);
  // Fetch menus and actions
  useEffect(() => {
    const fetchMenusAndActions = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post(
          "/api/master/menus-and-actions/get",
          {}
        );
        if (response.data.responseCode === "201") {
          setMenusAndActions(response.data.data);
        } else {
          toast.error("Failed to fetch menus and actions.");
        }
      } catch (error) {
        toast.error("Error fetching menus and actions.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenusAndActions();
  }, [accessToken]);

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/api/roles/get/all", {});
        if (response.data.responseCode === "200") {
          setRoleData(response.data.datalist);
        } else {
          toast.error("Failed to fetch roles.");
        }
      } catch (error) {
        toast.error("Error fetching roles.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const selectedActions = menusAndActions
    .map((menu) =>
      menu.actions
        .filter((action) => action.selected)
        .map((action) => action.actionId)
    )
    .flat();
  // Handle add role
  const handleAddRole = async (e) => {
    e.preventDefault();
    const newRole = {
      data: {
        selectedActions: selectedActions,
        name: roleName,
        description: roleDescription,
        isActive: true,
      },
    };

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        "/api/roles/register",
        newRole,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.responseCode === "201") {
        setRoleData((prevRoles) => [...prevRoles, response.data]);
        toast.success(response.data.message);
        setRoleName("");
        setRoleDescription("");
        setAddRole(false);
      } else {
        toast.error("Failed to add role.");
      }
    } catch (error) {
      toast.error("Error adding role.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit Role code
  const handleEditRole = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedPosition = {
      data: {
        selectedActions: selectedActions,
        roleName: roleName,
        description: roleDescription,
        isActive: true,
      },
    };

    try {
      const response = await axiosInstance.put(
        `/api/roles/update/${editingRoleId}`,
        updatedPosition,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.responseCode === "200") {
        toast.success("Role updated successfully!");
        setRoleData((prevData) =>
          prevData.map((item) =>
            item.id === editingRoleId
              ? {
                  ...item,
                  name: roleName,
                  description: roleDescription,
                  selectedActions: selectedActions,
                  isActive: true,
                }
              : item
          )
        );
        // Reset form and states
        setRoleName("");
        setRoleDescription("");
        setShowEditForm(false);
        setEditingRoleId(null);
      } else {
        toast.error("Failed to update the position.");
      }
    } catch (error) {
      console.error("Error updating position:", error);
      toast.error("Error updating position.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleAction = async (action, role) => {
    switch (action) {
      // Start Of Edit Operation
      case "edit":
        console.log(`Editing position ID: ${role.roleId}`);
        setShowEditForm(true);
        setRoleName(role.roleName || "");
        setRoleDescription(role.roleDescription || "");
        setEditingRoleId(role.roleId);
        break;
      // End Of Edit Operation
      //start of delete
      case "delete":
        try {
          console.log(`Deleting position ID: ${role.roleId}`);
          const response = await axiosInstance.delete(
            `/api/roles/delete/${role.roleId}`
            // {
            //   headers: {
            //     "Content-Type": "application/json",
            //     accessToken: accessToken,
            //     refreshToken: refreshToken,
            //   },
            // }
          );
          if (response.data.responseCode === "204") {
            toast.success("Position deleted successfully!");
          } else {
            toast.error("Failed to delete the position.");
          }
        } catch (error) {
          console.error("Error deleting position:", error);
          toast.error("Error deleting position.");
        }
        break;
      // End Of Delete Operation
      default:
        console.log("Unknown action");
    }
  };

  return (
    <>
      {/* {isLoading && <Loader message="Loading data, please wait..." />} */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="page-title">Roles</h2>
        <Button
          className="button bg-bgprimary text-white hover:bg-bgprimaryhover"
          onPress={() => setAddRole(!addRole)}>
          {addRole ? "Show Roles" : "Add Role"}
        </Button>
      </div>
      {/**Edit Form */}
      {showEditForm && (
        <div>
          <Form
            onSubmit={handleEditRole}
            className="mb-6 p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-6 text-center md:text-left text-gray-800">
              Edit Role
            </h2>
            <div className="grid grid-cols-1 gap-6 w-full">
              <div className="flex flex-col gap-6 w-full">
                <div>
                  <label
                    htmlFor="roleName"
                    className="text-sm font-medium text-gray-700 mb-2 block">
                    Role Name
                  </label>
                  <Input
                    id="roleName"
                    type="text"
                    placeholder="Enter role name"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="input border border-gray-300 rounded-lg px-4 py-3 focus:outline-none w-full"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="roleDescription"
                    className="text-sm font-medium text-gray-700 mb-2 block">
                    Description
                  </label>
                  <textarea
                    id="roleDescription"
                    placeholder="Provide a brief description"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    className="input border border-gray-300 rounded-lg px-4 py-3 h-32 focus:outline-none resize-none w-full"
                    required></textarea>
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
                                onChange={(e) => {
                                  action.selected = e.target.checked;
                                  setMenusAndActions([...menusAndActions]);
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
            {/**Save or delete button */}
            <div className="flex justify-center items-center gap-x-4">
              <Button
                type="submit"
                className="button bg-bgprimary text-white rounded-lg px-6 py-3 hover:bg-bgprimaryhover transition w-full md:w-auto ">
                Update Role
              </Button>
              <Button
                type="button"
                className="button bg-gray-500 text-white rounded-lg px-6 py-2 hover:bg-gray-600 transition w-full md:w-auto"
                onPress={() => setShowEditForm(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      )}

      {/**Add FOrm */}
      {addRole ? (
        <Form
          onSubmit={handleAddRole}
          className="mb-6 p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-6 text-center md:text-left text-gray-800">
            Add New Role
          </h2>
          <div className="grid grid-cols-1 gap-6 w-full">
            <div className="flex flex-col gap-6 w-full">
              <div>
                <label
                  htmlFor="roleName"
                  className="text-sm font-medium text-gray-700 mb-2 block">
                  Role Name
                </label>
                <Input
                  id="roleName"
                  type="text"
                  placeholder="Enter role name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="input border border-gray-300 rounded-lg px-4 py-3 focus:outline-none w-full"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="roleDescription"
                  className="text-sm font-medium text-gray-700 mb-2 block">
                  Description
                </label>
                <textarea
                  id="roleDescription"
                  placeholder="Provide a brief description"
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  className="input border border-gray-300 rounded-lg px-4 py-3 h-32 focus:outline-none resize-none w-full"
                  required></textarea>
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
                              onChange={(e) => {
                                action.selected = e.target.checked;
                                setMenusAndActions([...menusAndActions]);
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

          <b
            type="submit"
            className="button bg-bgprimary text-white rounded-lg px-6 py-3 hover:bg-bgprimaryhover transition w-full md:w-auto mt-6">
            Add Role
          </b>
        </Form>
      ) : (
        <div className="container mx-auto mt-8">
          <h1 className="text-2xl font-bold mb-4">Roles</h1>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Role Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Description
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {roleData.length > 0 ? (
                roleData.map((role) => (
                  <tr key={role.id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {role.roleName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {role.roleDescription}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <div className="flex justify-center gap-4">
                        <HiPencilSquare
                          className="text-green-500 cursor-pointer hover:text-green-700"
                          title="Edit"
                          onClick={() => handleAction("edit", role)}
                        />
                        <MdDelete
                          className="text-red-500 cursor-pointer hover:text-red-700"
                          title="Delete"
                          onClick={() => handleAction("delete", role)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="border border-gray-300 px-4 py-2 text-center">
                    No roles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Roles;
