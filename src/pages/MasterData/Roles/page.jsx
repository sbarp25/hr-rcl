import { useEffect, useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import Loader from "../../../components/Loader";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { IoMdAdd } from "react-icons/io";
import ValidationComponent from "../../../components/ValidationComponent";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import { useNavigate } from "react-router-dom";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import SkeletonLoader from "../../../components/SkeletonLoader";

const Roles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const navigate = useNavigate();

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/api/v1/role/get/all", {});
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

  const handleAction = async (action, role) => {
    switch (action) {
      // Now we'll navigate to edit page instead of showing edit form
      case "edit":
        if (hasRoleEditAccess) {
          navigate(`/master-data/Roles/edit/${role.roleId}`);
        } else {
          toast.error("Currently You dont have access to this setting.");
        }
        break;
      case "delete":
        if (hasRoleDeleteAccess) {
          try {
            // console.log(`Deleting position ID: ${role.roleId}`);
            const response = await axiosInstance.delete(
              `/api/v1/role/delete/${role.roleId}`
            );
            if (response.data.responseCode === "204") {
              toast.success(response.data.message);
              // Refresh the role list after successful deletion
              const updatedRoles = roleData.filter(
                (item) => item.roleId !== role.roleId
              );
              setRoleData(updatedRoles);
            } else {
              toast.error(response.data.messages);
            }
          } catch (error) {
            console.error("Error deleting position:", error);
            toast.error(error.response?.data?.messages);
          }
        } else {
          toast.error("Currently You dont have access to this setting.");
        }
        break;
      default:
        console.log("Unknown action");
    }
  };

  const menu = LocalStorageUtil.getItem("menu");

  const hasaccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 52)
  );
  const hasRoleAddAccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 51)
  );
  const hasRoleEditAccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 53)
  );
  const hasRoleDeleteAccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 54)
  );

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  const breadcrumbItems = [
    { label: "MasterData", href: "" },
    { label: "Roles", href: "/master-data/Roles" },
  ];

  const navigateAdd = () => {
    if (hasRoleAddAccess) {
      navigate("/master-data/Roles/add");
    } else {
      toast.error("Currently You dont have access to this setting.");
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

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
            <Button className="bg-black text-white" onPress={navigateAdd}>
              <IoMdAdd className="text-white h-24 w-24" />
              <span className="text-white font-Poppins text-xl">Add</span>
            </Button>
          </div>

          <Table bordered aria-label="Roles Table">
            <TableHeader>
              <TableColumn>S.N</TableColumn>
              <TableColumn>Position Name</TableColumn>
              <TableColumn>Description</TableColumn>
              <TableColumn>User Action</TableColumn>
            </TableHeader>
            <TableBody
              items={isLoading ? [] : roleData}
              isLoading={isLoading}
              loadingContent={<SkeletonLoader />}>
              {roleData.map((position, index) => (
                <TableRow
                  key={position.roleId || index}
                  className="h-14 justify-center items-center border-b-2 border-gray-300">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {position.positionName || position.roleName}
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      content={
                        position.description || position.roleDescription
                      }>
                      {truncateText(
                        position.description || position.roleDescription,
                        30
                      )}
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      <HiPencilSquare
                        className={`${
                          hasRoleEditAccess
                            ? "text-orange-500 cursor-pointer hover:text-orange-700 text-xl mr-2"
                            : "text-xl mr-2"
                        }`}
                        title="Edit"
                        onClick={() => handleAction("edit", position)}
                      />
                      <MdDelete
                        className={`${
                          hasRoleDeleteAccess
                            ? "text-red-500 cursor-pointer hover:text-red-700 text-xl ml-2"
                            : "text-xl ml-2"
                        }`}
                        title="Delete"
                        onClick={() => handleAction("delete", position)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ValidationComponent>
    </>
  );
};

export default Roles;
