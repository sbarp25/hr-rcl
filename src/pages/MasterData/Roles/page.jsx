import React from "react";

const Roles = () => {
  // JSON data
  const rolesData = [
    {
      roleId: 1,
      roleName: "Admin",
      permissions: {
        create: true,
        read: true,
        update: true,
        delete: true,
      },
    },
    {
      roleId: 2,
      roleName: "Editor",
      permissions: {
        create: true,
        read: true,
        update: true,
        delete: false,
      },
    },
    {
      roleId: 3,
      roleName: "Viewer",
      permissions: {
        create: false,
        read: true,
        update: false,
        delete: false,
      },
    },
    {
      roleId: 4,
      roleName: "Contributor",
      permissions: {
        create: true,
        read: true,
        update: false,
        delete: false,
      },
    },
    {
      roleId: 5,
      roleName: "Moderator",
      permissions: {
        create: false,
        read: true,
        update: true,
        delete: true,
      },
    },
  ];

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Roles and Permissions</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Role ID
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Role Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Create
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Read
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Update
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {rolesData.map((role) => (
            <tr key={role.roleId}>
              <td className="border border-gray-300 px-4 py-2">
                {role.roleId}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {role.roleName}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {role.permissions.create ? "✔️" : "❌"}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {role.permissions.read ? "✔️" : "❌"}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {role.permissions.update ? "✔️" : "❌"}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {role.permissions.delete ? "✔️" : "❌"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Roles;
