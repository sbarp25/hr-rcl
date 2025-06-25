import { useEffect, useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { BiData } from "react-icons/bi";
import { IoIosAddCircleOutline } from "react-icons/io";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "sonner";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import BreadcrumbsComponent from "../../../components/ui/BreadCrumbsComp.jsx";
import DropDownComp from "../../../components/ui/Dropdown.jsx";
import Search from "../../../components/Search";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../../../components/Loader/SkeletonLoader.jsx";
import truncateText from "../../../utils/truncateText";
import Loader from "../../../components/Loader/Loader.jsx";
import {
  hasCreateAccess,
  hasDeleteAccess,
  hasReadAccess,
  hasUpdateAccess,
  MENU_NAMES,
} from "../../../utils/permissionUtils.js";
import { useEmployeeDelete, useFetchRoles } from "../../../hooks/useAuth.js";
const Roles = () => {
  const [roleId, setRoleId] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [filteredPagination, setFilteredPagination] = useState(null);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const dropdownItems = [5, 10, 20, 30, 50, 100];
  const [currentPage, setCurrentPage] = useState(1);
  const [rolesPerPage, setRolesPerPage] = useState(10);

  const [expandedRow, setExpandedRow] = useState(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: "MasterData", href: "" },
    { label: "Roles", href: "/master-data/Roles" },
  ];

  /**Permission Checking */
  const hasRoleAddAccess = hasCreateAccess(MENU_NAMES.ROLES);
  /**To read the Data */
  // const hasaccess = true;
  const hasaccess = hasReadAccess(MENU_NAMES.ROLES);
  /**To check edit status */
  const hasRoleEditAccess = hasUpdateAccess(MENU_NAMES.ROLES);
  /**To check Delete Access */
  const hasRoleDeleteAccess = hasDeleteAccess(MENU_NAMES.ROLES);

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  const { data, isLoading, refetch } = useFetchRoles();
  const roleData = filteredData || data?.datalist || [];
  const totalPages = filteredPagination?.totalPages || data?.totalPages || 1;
  const totalRecords =
    filteredPagination?.totalRecords || data?.totalRecords || 0;

  useEffect(() => {
    setFilteredData(null);
    setFilteredPagination(null);
  }, [currentPage, rolesPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setFilteredData(null);
    setFilteredPagination(null);
  };
  const handleApplySearch = (result) => {
    if (result.data) {
      setFilteredData(result.data);
      setFilteredPagination({
        totalPages: result.totalPages,
        totalRecords: result.totalRecords,
      });
    } else {
      setFilteredData(null);
      setFilteredPagination(null);
      refetch();
    }
  };

  const toggleExpandedRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleAction = async (action, role) => {
    switch (action) {
      // Start Of Edit Operation
      case "edit":
        if (hasRoleEditAccess) {
          navigate(`/master-data/Roles/edit/${role.roleId}`);
        } else {
          toast.error("Access denied");
        }
        break;

      // Start Of Delete Operation
      case "delete":
        if (hasRoleDeleteAccess) {
          setRoleId(role.roleId);
          onOpen();
        } else {
          toast.error("Access denied");
        }
        break;
      // End Of Delete Operation
      default:
        console.log("Unknown action");
    }
  };
  const onDelete = useEmployeeDelete();
  const navigateAdd = () => {
    if (hasRoleAddAccess) {
      navigate("/master-data/Roles/add");
    } else {
      toast.error("You don't have Create Access");
    }
  };

  return (
    <>
      {isDeleteLoading ? (
        <Loader />
      ) : (
        <>
          <div className="px-2 md:px-8 max-h-[85vh] space-y-4">
            {/* Header Section */}
            <div className="flex flex-col space-y-4">
              <div className="text-sm">
                <BreadcrumbsComponent items={breadcrumbItems} />
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center page-title -pl-2">
                  <BiData className="text-2xl" />
                  <span className="page-title">Roles</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-y-2 sm:gap-x-4 w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <Search
                      onApplySearch={handleApplySearch}
                      url="/api/v1/role/get/all"
                      searchFields={["roleName", "roleDescription"]}
                      placeholder="Search Roles..."
                    />
                  </div>
                  <Button
                    className="flex bg-black text-white w-full sm:w-auto"
                    onPress={navigateAdd}>
                    <div className="flex justify-center items-center gap-2">
                      <IoIosAddCircleOutline className="text-white text-xl" />
                      <span className="text-white font-normal">Add Role</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-y-auto p-2">
              {/* Large screens - Full table */}
              <div className="hidden lg:block">
                <div className="rounded-lg  text-left">
                  <Table bordered aria-label="Roles Table">
                    <TableHeader>
                      <TableColumn>S.N</TableColumn>
                      <TableColumn>Role Name</TableColumn>
                      <TableColumn>Description</TableColumn>
                      <TableColumn>User Action</TableColumn>
                    </TableHeader>
                    <TableBody
                      items={isLoading ? [] : roleData}
                      isLoading={isLoading}
                      loadingContent={<SkeletonLoader />}>
                      {roleData?.map((role, index) => (
                        <TableRow
                          key={role.roleId}
                          className="h-14 justify-center items-center border-b-2 border-gray-300">
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {role?.roleName?.length < 7 ? (
                              role?.roleName
                            ) : (
                              <Tooltip content={role.roleName}>
                                {truncateText(role?.roleName, 15)}
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell>
                            {role.roleDescription.length < 30 ? (
                              role.roleDescription
                            ) : (
                              <Tooltip content={role.roleDescription}>
                                {truncateText(role.roleDescription, 30)}
                              </Tooltip>
                            )}
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
                                onClick={() => handleAction("edit", role)}
                              />
                              <MdDelete
                                className={`${
                                  hasRoleDeleteAccess
                                    ? "text-red-500 cursor-pointer hover:text-red-700 text-xl ml-2"
                                    : "text-xl ml-2"
                                }`}
                                title="Delete"
                                onClick={() => handleAction("delete", role)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Medium screens - Simplified table */}
              <div className="hidden md:block lg:hidden">
                <div className="shadow-md rounded-lg text-left">
                  <Table bordered aria-label="Roles Table">
                    <TableHeader>
                      <TableColumn>Role</TableColumn>
                      <TableColumn>Description</TableColumn>
                      <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {roleData?.map((role) => (
                        <TableRow
                          key={role.roleId}
                          className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {role.roleName}
                              </span>
                              <span className="text-xs text-gray-500">
                                ID: {role.roleId}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {role.roleDescription.length < 20 ? (
                              role.roleDescription
                            ) : (
                              <Tooltip content={role.roleDescription}>
                                {truncateText(role.roleDescription, 20)}
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex">
                              <HiPencilSquare
                                className={`${
                                  hasRoleEditAccess
                                    ? "text-yellow-500 cursor-pointer hover:text-green-700 text-xl mr-2"
                                    : "text-xl mr-2"
                                }`}
                                title="Edit"
                                onClick={() => handleAction("edit", role)}
                              />
                              <MdDelete
                                className={`${
                                  hasRoleDeleteAccess
                                    ? "text-red-500 cursor-pointer hover:text-red-700 text-xl ml-2"
                                    : "text-xl ml-2"
                                }`}
                                title="Delete"
                                onClick={() => handleAction("delete", role)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Small screens - Card-like view */}
              <div className="block md:hidden">
                <div className="space-y-4">
                  {roleData?.map((role) => (
                    <div
                      key={role.roleId}
                      className="border rounded-lg overflow-hidden shadow-sm">
                      <div
                        className="flex justify-between items-center p-3 cursor-pointer bg-gray-50"
                        onClick={() => toggleExpandedRow(role.roleId)}>
                        <div className="font-medium">{role.roleName}</div>
                        <div className="flex items-center gap-2">
                          <FaChevronDown
                            size={16}
                            className={`transition-transform ${
                              expandedRow === role.roleId ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                      <div
                        className={`${
                          expandedRow === role.roleId ? "block" : "hidden"
                        } p-3 space-y-2 text-sm`}>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="font-medium">Description:</div>
                          <div className="bg-gray-50 p-2 rounded">
                            {role.roleDescription}
                          </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-2">
                          <Button
                            size="sm"
                            color="warning"
                            className={`${
                              !hasRoleEditAccess
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onPress={() =>
                              hasRoleEditAccess && handleAction("edit", role)
                            }
                            disabled={!hasRoleEditAccess}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            className={`${
                              !hasRoleDeleteAccess
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onPress={() =>
                              hasRoleDeleteAccess &&
                              handleAction("delete", role)
                            }
                            disabled={!hasRoleDeleteAccess}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!roleData || roleData.length === 0) && !isLoading && (
                    <div className="p-8 text-center text-gray-500">
                      No Data available
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination - Responsive for all screens */}
              {roleData && roleData.length > 0 && (
                <div className="mt-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3 relative z-10 bg-white pb-4">
                  <div className="text-sm font-medium text-gray-600 flex items-center">
                    <span className="mr-1">Showing:</span>
                    <span className="font-bold text-gray-800 mx-1">
                      {totalRecords < rolesPerPage
                        ? totalRecords
                        : rolesPerPage}
                    </span>
                    <span className="mr-1">of</span>
                    <span className="font-bold text-gray-800">
                      {totalRecords}
                    </span>
                  </div>

                  <div className="w-full sm:w-auto flex justify-center order-1 sm:order-2">
                    <Pagination
                      showControls
                      total={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      size="sm"
                    />
                  </div>
                  <div className="flex justify-center items-center order-3">
                    <span className="text-xs mr-2">Lines Per Page:</span>
                    <DropDownComp
                      items={dropdownItems}
                      onSelect={setRolesPerPage}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={true}
            isKeyboardDismissDisabled={false}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalBody>
                    <p>Are you sure you want to delete this role?</p>
                    <div className="flex gap-2 justify-end mt-4">
                      <Button color="danger" onPress={() => onDelete()}>
                        Delete
                      </Button>
                      <Button onPress={onClose}>Cancel</Button>
                    </div>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

export default Roles;
