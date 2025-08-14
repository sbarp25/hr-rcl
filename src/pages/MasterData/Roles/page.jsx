import { useEffect, useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { BiData } from "react-icons/bi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { toast } from "sonner";
import {
  Accordion,
  AccordionItem,
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
import {
  hasCreateAccess,
  hasDeleteAccess,
  hasReadAccess,
  hasUpdateAccess,
  MENU_NAMES,
} from "../../../utils/permissionUtils.js";
import { useDeleteRoles, useFetchRoles } from "../../../hooks/useAuth.js";

const Roles = () => {
  const [roleId, setRoleId] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [filteredPagination, setFilteredPagination] = useState(null);

  const dropdownItems = [5, 10, 20, 30, 50, 100];
  const [currentPage, setCurrentPage] = useState(1);
  const [rolesPerPage, setRolesPerPage] = useState(10);

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

  // Fix: Properly destructure the delete function from the hook
  const { mutate: deleteRole, isLoading: isDeleting } = useDeleteRoles();

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

  // Fix: Create a proper delete handler function
  const handleDelete = async () => {
    if (roleId) {
      try {
        await deleteRole(roleId, {
          onSuccess: () => {
            refetch(); // Refresh the data
            onClose(); // Close the modal
            setRoleId(null); // Clear the roleId
          },
          onError: (error) => {
            const errorMessage =
              error.response?.data?.error?.errorList?.[0]?.errorMessage ||
              error.message ||
              "Something went wrong. Try again.";
            toast.error(errorMessage);
          },
        });
      } catch (error) {
        const errorMessage =
          error.response?.data?.error?.errorList?.[0]?.errorMessage ||
          error.message ||
          "Something went wrong. Try again.";
        toast.error(errorMessage);
      }
    }
  };

  const navigateAdd = () => {
    if (hasRoleAddAccess) {
      navigate("/master-data/Roles/add");
    } else {
      toast.error("You don't have Create Access");
    }
  };

  const loading = isLoading || isDeleting;
  return (
    <>
      {/* {isDeleteLoading || isDeleting ? (
        <Loader />
      ) : ( */}
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
                  className="flex bg-black text-white dark:bg-white dark:text-black w-full sm:w-auto"
                  onPress={navigateAdd}>
                  <div className="flex justify-center items-center gap-2">
                    <IoIosAddCircleOutline className=" text-xl" />
                    <span className="font-normal">Add Role</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-black rounded-lg overflow-y-auto p-2">
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
                    items={loading ? [] : roleData}
                    isLoading={loading}
                    loadingContent={<SkeletonLoader />}>
                    {roleData?.map((role, index) => (
                      <TableRow
                        key={role.roleId}
                        className="h-14 justify-center items-center border-b-2 border-gray-300 dark:border-neutral-600">
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
                                  ? "text-black dark:text-white cursor-pointer hover:text-green-500 dark:hover:text-green-500 text-xl mr-2"
                                  : "text-xl mr-2 text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed"
                              }`}
                              title="Edit"
                              onClick={() => handleAction("edit", role)}
                            />
                            <MdDelete
                              className={`${
                                hasRoleDeleteAccess
                                  ? "text-black dark:text-white  cursor-pointer hover:text-red-500 dark:hover:text-green-500 text-xl ml-2"
                                  : "text-xl ml-2 text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed"
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
                  <TableBody
                    items={loading ? [] : roleData}
                    isLoading={loading}
                    loadingContent={<SkeletonLoader />}>
                    {roleData?.map((role) => (
                      <TableRow
                        key={role.roleId}
                        className="h-14  border-b-2 border-gray-300 dark:border-neutral-600">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{role.roleName}</span>
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
                                  ? "text-black dark:text-white cursor-pointer hover:text-green-500 dark:hover:text-green-500 text-xl mr-2"
                                  : "text-xl mr-2 text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed"
                              }`}
                              title="Edit"
                              onClick={() => handleAction("edit", role)}
                            />
                            <MdDelete
                              className={`${
                                hasRoleDeleteAccess
                                  ? "text-black dark:text-white cursor-pointer hover:text-red-700 dark:hover:text-green-500 text-xl ml-2"
                                  : "text-xl ml-2 text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed"
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
                {loading && <SkeletonLoader />}
                <Accordion variant="bordered">
                  {roleData?.map((role) => (
                    <AccordionItem
                      key={role.roleId}
                      aria-label={role.roleName}
                      title={role.roleName}>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="font-medium">Description:</div>
                        <div className="bg-gray-50 dark:bg-neutral-500 p-2 rounded">
                          {role.roleDescription}
                        </div>
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>

                {(!roleData || roleData.length === 0) && !isLoading && (
                  <div className="p-8 text-center text-gray-500">
                    No Data available
                  </div>
                )}
              </div>
            </div>

            {/* Pagination - Responsive for all screens */}
            {roleData && roleData.length > 0 && (
              <div className="mt-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3 relative z-10 bg-white dark:bg-black pb-4">
                <div className="text-sm font-medium text-gray-600 dark:text-white flex items-center">
                  <span className="mr-1">Showing:</span>
                  <span className="font-bold mx-1">
                    {totalRecords < rolesPerPage ? totalRecords : rolesPerPage}
                  </span>
                  <span className="mr-1">of</span>
                  <span className="font-bold ">{totalRecords}</span>
                </div>

                <div className="w-full sm:w-auto flex justify-center order-1 sm:order-2">
                  <Pagination
                    showControls
                    total={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    classNames={{
                      cursor: "bg-active text-white",
                    }}
                    size="sm"
                  />
                </div>
                <div className="flex justify-center items-center order-3">
                  <span className="text-xs mr-2">Lines Per Page:</span>
                  <DropDownComp
                    items={dropdownItems}
                    selectedValue={rolesPerPage}
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
                    <Button
                      color="danger"
                      onPress={handleDelete}
                      isLoading={isDeleting}
                      disabled={isDeleting}>
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                    <Button onPress={onClose} disabled={isDeleting}>
                      Cancel
                    </Button>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
      {/* )} */}
    </>
  );
};

export default Roles;
