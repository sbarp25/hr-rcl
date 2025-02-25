import { useEffect, useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import Loader from "../../../components/Loader";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import { Button, Form, Input, Textarea } from "@nextui-org/react";
import { IoMdAdd } from "react-icons/io";
import { IoReturnDownBack } from "react-icons/io5";
import { Checkbox } from "@nextui-org/checkbox";
import ValidationComponent from "../../../components/ValidationComponent";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import { useNavigate } from "react-router-dom";
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
          "/api/v1/master/menus/and/actions/",
          // "/api/master/menus-and-actions/",
          {}
        );
        if (response.data.responseCode === "201") {
          setMenusAndActions(response.data.data);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.messages);
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
        const response = await axiosInstance.post("/api/v1/role/get/all", {});
        // const response = await axiosInstance.post("/api/roles/get/all", {});
        if (response.data.responseCode === "200") {
          setRoleData(response.data.datalist);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.messages);
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
      const response = await axiosInstance.post("/api/role/register", newRole, {
        // const response = await axiosInstance.post("/api/v1/role/save", newRole, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.responseCode === "201") {
        setRoleData((prevRoles) => [...prevRoles, response.data]);
        toast.success(response.data.message);
        setRoleName("");
        setRoleDescription("");
        setAddRole(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
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
        `/api/v1/role/update/${editingRoleId}`,
        updatedPosition,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.responseCode === "200") {
        toast.success(response.data.messages);
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
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating position:", error);
      toast.error(error.response?.data?.message);
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
            `/api/v1/role/delete/${role.roleId}`
          );
          if (response.data.responseCode === "204") {
            toast.success(response.data.message);
          } else {
            toast.error(response.data.messages);
          }
        } catch (error) {
          console.error("Error deleting position:", error);
          toast.error(error.response?.data?.messages);
        }
        break;
      // End Of Delete Operation
      default:
        console.log("Unknown action");
    }
  };
  const navigate = useNavigate();
  const hasaccess = false;

  useEffect(() => {
    if (!hasaccess) {
      navigate("/");
    }
  }, []);
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "MasterData", href: "" },
    { label: "Roles", href: "/master-data/Roles" },
  ];

  return (
    <>
      <ValidationComponent>
        {isLoading && <Loader message="Loading data, please wait..." />}
        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
              <BreadcrumbsComponent items={breadcrumbItems} />
              <h2 className="page-title">Roles</h2>
            </div>
            <Button
              className="button bg-green-700 tracking-normal
  hover:bg-green-900"
              onPress={() => setAddRole(!addRole)}
            >
              {addRole ? (
                <>
                  <IoReturnDownBack className="text-white h-24 w-24" />
                  <span className="text-white font-Poppins text-xl">
                    return
                  </span>
                </>
              ) : (
                <>
                  <IoMdAdd className="text-white h-24 w-24" />
                  <span className="text-white font-Poppins text-xl">Add</span>
                </>
              )}
            </Button>
          </div>
          {/**Edit Form */}
          {showEditForm && (
            <div>
              <Form
                onSubmit={handleEditRole}
                className="mb-6 p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto"
              >
                <h2 className="text-xl font-semibold mb-6 text-center md:text-left text-gray-800">
                  Edit Role
                </h2>
                <div className="grid grid-cols-1 gap-6 w-full">
                  <div className="flex flex-col gap-6 w-full">
                    <div>
                      <label
                        htmlFor="roleName"
                        className="text-sm font-medium text-gray-700 mb-2 block"
                      >
                        Role Name
                      </label>
                      <Input
                        id="name"
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
                        className="text-sm font-medium text-gray-700 mb-2 block"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        placeholder="Provide a brief description"
                        value={roleDescription}
                        onChange={(e) => setRoleDescription(e.target.value)}
                        className="input border border-gray-300 rounded-lg px-4 py-3 h-32 focus:outline-none resize-none w-full"
                        required
                      ></textarea>
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
                                  <span className="ml-2">
                                    {action.actionName}
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
                {/**Save or delete button */}
                <div className="flex justify-center items-center gap-x-4">
                  <Button
                    type="submit"
                    className="button bg-bgprimary text-white rounded-lg px-6 py-3 hover:bg-bgprimaryhover transition w-full md:w-auto "
                  >
                    Update Role
                  </Button>
                  <Button
                    type="button"
                    className="button bg-gray-500 text-white rounded-lg px-6 py-2 hover:bg-gray-600 transition w-full md:w-auto"
                    onPress={() => setShowEditForm(false)}
                  >
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
              className="mb-6 p-6 bg-white shadow-md rounded-lg  mx-auto max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-xl font-semibold mb-6 text-center md:text-left text-gray-800">
                Add New Role
              </h2>
              <div className="grid grid-cols-1 gap-6 w-full">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Input Fields */}

                  <div className="flex flex-col flex-1 gap-4">
                    <Input
                      id="name"
                      type="text"
                      label="Enter Role Name "
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      className="rounded-xl shadow-md  focus:outline-none w-full"
                      required
                    />
                    <Textarea
                      id="description"
                      label="Role Description"
                      value={roleDescription}
                      onChange={(e) => setRoleDescription(e.target.value)}
                      className="border rounded-xl shadow-md focus:outline-none resize-none w-full"
                      required
                    ></Textarea>
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
                        <ul className="flex flex-row mt-4">
                          {menu.actions.map((action) => (
                            <li key={action.actionId} className="mb-3">
                              <label className="flex items-center justify-between text-sm text-gray-700">
                                <Checkbox
                                  type="checkbox"
                                  className="checkbox"
                                  onChange={(e) => {
                                    action.selected = e.target.checked;
                                    setMenusAndActions([...menusAndActions]);
                                  }}
                                />
                                <span className="mr-4">
                                  {action.actionName}
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
              <b
                type="submit"
                className="button bg-bgprimary text-white rounded-lg px-6  hover:bg-bgprimaryhover transition w-full md:w-auto mt-6"
              >
                Submit
              </b>
            </Form>
          ) : (
            <div className="container mx-auto mt-8">
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
                        className="border border-gray-300 px-4 py-2 text-center"
                      >
                        No roles found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </ValidationComponent>
    </>
  );
};

export default Roles;
