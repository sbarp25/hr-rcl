import { useEffect, useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "sonner";
import { IoIosAddCircleOutline } from "react-icons/io";
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
import Filter from "../../../components/Filter";
import Search from "../../../components/Search";
import { BiData } from "react-icons/bi";
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
import { useDeletePosition, useFetchPosition } from "../../../hooks/useAuth.js";
const TotalPage = () => {
  const [positionId, setPositionId] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [filteredPagination, setFilteredPagination] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const dropdownItems = [5, 10, 20, 30, 50, 100];
  const [currentPage, setCurrentPage] = useState(1);
  const [positionPerPage, setPositionPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { mutate: deletePosition } = useDeletePosition();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: "MasterData", href: "" },
    { label: "Position", href: "/master-data/Position" },
  ];

  /**Permission Check  */
  const hasPositioncreateaccess = hasCreateAccess(MENU_NAMES.POSITION);
  // const hasaccess = true;
  const hasaccess = hasReadAccess(MENU_NAMES.POSITION);
  const hasPositionEditAccess = hasUpdateAccess(MENU_NAMES.POSITION);
  const hasPositionDeleteAccess = hasDeleteAccess(MENU_NAMES.POSITION);

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  const { data, isLoading, refetch } = useFetchPosition(
    currentPage,
    positionPerPage
  );
  const positionData = filteredData || data?.datalist || [];
  const totalPages = filteredPagination?.totalPages || data?.totalPages || 1;
  const totalRecords =
    filteredPagination?.totalRecords || data?.totalRecords || 0;

  const handleAction = async (action, position) => {
    switch (action) {
      // Start Of Edit Operation
      case "edit":
        if (hasPositionEditAccess) {
          navigate(`/master-data/Position/Edit/${position.id}`);
        } else {
          toast.error("Access denied");
        }
        break;

      // Start Of Delete Operation
      case "delete":
        if (hasPositionDeleteAccess) {
          setPositionId(position.id);
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

  const onDelete = async () => {
    setIsDeleteLoading(true);
    try {
      if (hasPositionDeleteAccess) {
        deletePosition(positionId, {
          onSuccess: () => {
            onClose();
          },
          onSettled: () => {
            setIsDeleteLoading(false);
          },
        });
      } else {
        toast.error("Access denied");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting position.");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handlePageChange = (page) => {
    //To change the page as well as to reset the data
    setCurrentPage(page);
    setFilteredData(null);
    setFilteredPagination(null);
  };
  const handleApplyFilters = (result) => {
    if (result.data) {
      setFilteredData(result.data);
      setFilteredPagination({
        totalPages: result.totalPages,
        totalRecords: result.totalRecords,
      });
    } else {
      // Reset case - refetch original data
      setFilteredData(null);
      setFilteredPagination(null);
      refetch();
    }
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
  const navigateAdd = () => {
    if (hasPositioncreateaccess) {
      navigate("/master-data/AddPosition");
    } else {
      toast.error("You don't have Create Access");
    }
  };

  const toggleExpandedRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const loading = isDeleteLoading || isLoading;
  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <>
        <div className="px-2 md:px-8  space-y-4">
          {/* Header Section */}
          <div className="flex flex-col space-y-4">
            <div className="text-sm">
              <BreadcrumbsComponent items={breadcrumbItems} />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center page-title -pl-2">
                <BiData className="text-2xl" />
                <span className="page-title">Position</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-y-2 sm:gap-x-4 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  <Search
                    onApplySearch={handleApplySearch}
                    url="/api/v1/positions/list"
                    searchFields={["positionName", "description"]}
                    placeholder="Search Position..."
                  />
                  <Filter
                    onApplyFilters={handleApplyFilters}
                    url="/api/v1/positions/list"
                    fieldNames={{
                      departmentField: "id",
                      fromDateField: "createdAt",
                      toDateField: "toDate",
                      positionField: "id",
                    }}
                    className="w-full sm:w-auto"
                  />
                </div>
                <Button
                  className="flex text-white bg-black dark:bg-white dark:text-black dark:hover:text-white hover:bg-active dark:hover:dark:bg-active w-full sm:w-auto"
                  onPress={navigateAdd}>
                  <div className="flex justify-center items-center gap-2">
                    <IoIosAddCircleOutline className=" text-xl" />
                    <span className=" font-normal">Add Position</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-black rounded-lg  p-2">
            {/* Large screens - Full table */}
            <div className="hidden lg:block">
              <div className="rounded-lg  text-left">
                <Table bordered aria-label="Position Table">
                  <TableHeader>
                    <TableColumn>S.N</TableColumn>
                    <TableColumn>Position Name</TableColumn>
                    <TableColumn>Description</TableColumn>
                    <TableColumn>User Action</TableColumn>
                  </TableHeader>
                  <TableBody
                    items={loading ? [] : positionData}
                    isLoading={loading}
                    loadingContent={<SkeletonLoader />}>
                    {positionData
                      .filter((position) => !position.isDeleted)
                      .map((position, index) => (
                        <TableRow
                          key={position.id}
                          className="h-14 justify-center items-center border-b-2 border-gray-300">
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {position?.positionName?.length < 15 ? (
                              position?.positionName
                            ) : (
                              <Tooltip content={position.positionName}>
                                {truncateText(position.positionName, 15)}
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell>
                            {position.description.length < 30 ? (
                              position.description
                            ) : (
                              <Tooltip content={position.description}>
                                {truncateText(position.description, 30)}
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex">
                              <HiPencilSquare
                                className={`${
                                  hasPositionEditAccess
                                    ? "text-black dark:text-white cursor-pointer hover:text-green-500 dark:hover:text-green-500 text-xl mr-2"
                                    : "text-xl mr-2 text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed"
                                }`}
                                title="Edit"
                                onClick={() => handleAction("edit", position)}
                              />
                              <MdDelete
                                className={`${
                                  hasPositionDeleteAccess
                                    ? "text-black dark:text-white cursor-pointer hover:text-red-500 dark:hover:text-red-500 text-xl ml-2"
                                    : "text-xl ml-2 text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed"
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
            </div>

            {/* Medium screens - Simplified table */}
            <div className="hidden md:block lg:hidden">
              <div className="shadow-md rounded-lg text-left">
                <Table bordered aria-label="Position Table">
                  <TableHeader>
                    <TableColumn>Position</TableColumn>
                    <TableColumn>Description</TableColumn>
                    <TableColumn>Actions</TableColumn>
                  </TableHeader>
                  <TableBody
                    items={loading ? [] : positionData}
                    isLoading={loading}
                    loadingContent={<SkeletonLoader />}>
                    {positionData.map((position, index) => (
                      <TableRow
                        key={position.id}
                        className=" h-14 hover:bg-gray-50 dark:hover:bg-slate-500 border-b ">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {position.positionName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {position.description.length < 20 ? (
                            position.description
                          ) : (
                            <Tooltip content={position.description}>
                              {truncateText(position.description, 20)}
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex">
                            <HiPencilSquare
                              className={`${
                                hasPositionEditAccess
                                  ? "text-black dark:text-white cursor-pointer hover:text-green-500 dark:hover:text-green-500 text-xl mr-2"
                                  : "text-xl mr-2 text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed"
                              }`}
                              title="Edit"
                              onClick={() => handleAction("edit", position)}
                            />
                            <MdDelete
                              className={`${
                                hasPositionDeleteAccess
                                  ? "text-black dark:text-white cursor-pointer hover:text-red-500 dark:hover:text-red-500 text-xl ml-2"
                                  : "text-xl ml-2 text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed"
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
            </div>

            {/* Small screens - Card-like view */}
            <div className="block md:hidden">
              <div className="space-y-4">
                {loading ? (
                  <SkeletonLoader />
                ) : (
                  <>
                    {positionData.map((position, index) => (
                      <div
                        key={position.id}
                        className="border rounded-lg overflow-hidden shadow-sm">
                        <div
                          className="flex justify-between items-center p-3 cursor-pointer bg-gray-50 dark:bg-slate-600"
                          onClick={() => toggleExpandedRow(position.id)}>
                          <div className="font-medium">
                            {position.positionName}
                          </div>
                          <div className="flex items-center gap-2">
                            <FaChevronDown
                              size={16}
                              className={`transition-transform ${
                                expandedRow === position.id ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </div>
                        <div
                          className={`${
                            expandedRow === position.id ? "block" : "hidden"
                          } p-3 space-y-2 text-sm`}>
                          <div className="grid grid-cols-1 gap-2">
                            <div className="font-medium">Description:</div>
                            <div className="bg-gray-50 dark:bg-slate-600 p-2 rounded">
                              {position.description}
                            </div>
                          </div>
                          <div className="flex justify-end gap-4 mt-2">
                            <Button
                              size="sm"
                              color="success"
                              variant="flat"
                              className={`${
                                !hasPositionEditAccess
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onPress={() =>
                                hasPositionEditAccess &&
                                handleAction("edit", position)
                              }
                              disabled={!hasPositionEditAccess}>
                              <HiPencilSquare className="w-4 h-4" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              variant="flat"
                              className={`${
                                !hasPositionDeleteAccess
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onPress={() =>
                                hasPositionDeleteAccess &&
                                handleAction("delete", position)
                              }
                              disabled={!hasPositionDeleteAccess}>
                              <MdDelete className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {(!positionData || positionData.length === 0) && !isLoading && (
                  <div className="p-8 text-center text-gray-500">
                    No Data available
                  </div>
                )}
              </div>
            </div>

            {/* Pagination - Responsive for all screens */}
            {positionData && positionData.length > 0 && (
              <div className="mt-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3 relative z-10 bg-white dark:bg-black pb-4">
                <div className="text-sm font-medium text-gray-800 dark:text-white flex items-center">
                  <span className="mr-1">Showing:</span>
                  <span className="font-bold  mx-1">
                    {totalRecords < positionPerPage
                      ? totalRecords
                      : positionPerPage}
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
                    selectedValue={positionPerPage}
                    onSelect={setPositionPerPage}
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
                  <p>Are you sure you want to delete this position?</p>
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
    </div>
  );
};
export default TotalPage;
