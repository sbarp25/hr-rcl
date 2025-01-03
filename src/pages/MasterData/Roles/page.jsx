import React, { useEffect, useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import Loader from "../../../components/Loader";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import { Form } from "@nextui-org/react";

const Roles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [addRole, setAddRole] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [menusAndActions, setMenusAndActions] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const accessToken = localStorage.getItem("accessToken");

  // Fetch menus and actions
  useEffect(() => {
    const fetchMenusAndActions = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post(
          "/master/menus-and-actions/get",
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
        const response = await axiosInstance.post("roles/get/all", {});
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

  // Handle add role
  const handleAddRole = async (e) => {
    e.preventDefault();
    const newRole = {
      roleName: roleName,
      roleDescription: roleDescription,
      menus: menusAndActions.map((menu) => ({
        menuId: menu.menuId,
        actions: menu.actions
          .filter((action) => action.selected)
          .map((action) => action.actionId),
      })),
    };

    try {
      setIsLoading(true);
      const response = await axiosInstance.post("roles/register", newRole, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.responseCode === "201") {
        setRoleData((prevRoles) => [...prevRoles, response.data]); // Update UI
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

  const handleAction = async (action, role) => {
    switch (action) {
      case "edit":
        console.log(`Editing role ID: ${role.id}`);
        break;
      case "delete":
        console.log(`Deleting role ID: ${role.id}`);
        break;
      default:
        console.log("Unknown action");
    }
  };

  return (
    <>
      {isLoading && <Loader message="Loading data, please wait..." />}
      <button
        className="button hover:button-hover"
        onClick={() => setAddRole(!addRole)}>
        {addRole ? "Show Roles" : "Add Role"}
      </button>

      {addRole ? (
        <Form
          onSubmit={handleAddRole}
          className="mb-6 p-4 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
            Add New Role
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col flex-1 gap-4">
              <input
                type="text"
                placeholder="Role Name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="input border rounded-lg px-4 py-2 focus:outline-none w-full"
                required
              />
              <textarea
                placeholder="Description"
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                className="input border rounded-lg px-4 py-2 h-24 focus:outline-none resize-none w-full"
                required></textarea>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {menusAndActions.length > 0 ? (
                menusAndActions.map((menu) => (
                  <div key={menu.menuId} className="mb-4">
                    <div className="border border-gray-300 p-2 bg-gray-50">
                      <strong>{menu.menuName}</strong>
                      <p>{menu.menuDescription}</p>
                    </div>
                    <ul className="pl-4">
                      {menu.actions.map((action) => (
                        <li key={action.actionId}>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="checkbox"
                              onChange={(e) => {
                                action.selected = e.target.checked;
                                setMenusAndActions([...menusAndActions]);
                              }}
                            />
                            <span>
                              {action.actionName}: {action.actionDescription}
                            </span>
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
          <button
            type="submit"
            className="button bg-bgprimary text-white rounded-lg px-6 py-2 hover:bg-bgprimaryhover transition w-full md:w-auto">
            Add Role
          </button>
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
