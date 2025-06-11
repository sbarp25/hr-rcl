import { useEffect, useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "sonner";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoReturnDownBack } from "react-icons/io5";
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
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
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

const Position = () => {
  const [positionId, setPositionId] = useState(null);
  const [positionData, setPositionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const dropdownItems = [5, 10, 20, 30, 50, 100];
  const [currentPage, setCurrentPage] = useState(1);
  const [positionPerPage, setPositionPerPage] = useState(10);
  const [positionDataPerPage, setPositionDataPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [originalPositionsData, setOriginalPositionsData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const navigate = useNavigate();

  const handlePageChange = (page) => {
    setPositionData([]);
    setCurrentPage(page);
  };

  /**Start of Get API for Getting the Positions */
  const fetchPositions = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/api/v1/positions/list", {
        pageIndex: currentPage,
        pageSize: positionPerPage,
      });
      if (response.data.responseCode === "200") {
        setOriginalPositionsData(response?.data?.datalist || []); // Store original data
        setPositionData(response?.data?.datalist || []); // Initially set filtered data to original data
        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
      } else {
        toast.error(response?.data?.message || "Failed to fetch positions.");
      }
    } catch (error) {
      toast.error("Error fetching positions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [currentPage, positionPerPage]);

  // Enhanced filter handler to match Department implementation
  const handleApplyFilters = (result) => {
    if (result.data) {
      setPositionData(result.data);
      if (result.totalPages) setTotalPages(result.totalPages);
      if (result.totalRecords) setTotalRecords(result.totalRecords);
    } else {
      setPositionData(originalPositionsData);
    }
  };

  /**To check create status */
  const hasPositioncreateaccess = hasCreateAccess(MENU_NAMES.POSITION);
  /**To read the Data */
  // const hasaccess = true;
  const hasaccess = hasReadAccess(MENU_NAMES.POSITION);
  /**To check edit status */
  const hasPositionEditAccess = hasUpdateAccess(MENU_NAMES.POSITION);
  /**To check Delete Access */
  const hasPositionDeleteAccess = hasDeleteAccess(MENU_NAMES.POSITION);

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  /**Start Of handleActions*/
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
        const response = await axiosInstance.delete(
          `api/v1/positions/delete/${positionId}`
        );
        if (response.data.responseCode === "204") {
          toast.success(
            response.data.message || "Position deleted successfully!"
          );
          fetchPositions();
          onClose();

          // Refresh the data after deletion
          const updatedPage =
            positionData.length === 1 && currentPage > 1
              ? currentPage - 1
              : currentPage;

          setCurrentPage(updatedPage);
        } else {
          toast.error(
            response.data.message || "Failed to delete the position."
          );
        }
      } else {
        toast.error("Access denied");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting position.");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "MasterData", href: "" },
    { label: "Position", href: "/master-data/Position" },
  ];

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

  const handleApplySearch = (result) => {
    if (result.data) {
      // Search component returned filtered data
      setPositionData(result.data);
      if (result.totalPages) setTotalPages(result.totalPages);
      if (result.totalRecords) setTotalRecords(result.totalRecords);
    } else {
      fetchPositions();
    }
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      {isDeleteLoading ? (
        <Loader />
      ) : (
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
                    className="flex bg-black text-white w-full sm:w-auto"
                    onPress={navigateAdd}>
                    <div className="flex justify-center items-center gap-2">
                      <IoIosAddCircleOutline className="text-white text-xl" />
                      <span className="text-white font-normal">
                        Add Position
                      </span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg  p-2">
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
                      items={isLoading ? [] : positionData}
                      isLoading={isLoading}
                      loadingContent={<SkeletonLoader />}>
                      {positionData
                        .filter((position) => !position.isDeleted)
                        .map((position, index) => (
                          <TableRow
                            key={position.rclId}
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
                                      ? "text-orange-500 cursor-pointer hover:text-orange-700 text-xl mr-2"
                                      : "text-xl mr-2"
                                  }`}
                                  title="Edit"
                                  onClick={() => handleAction("edit", position)}
                                />
                                <MdDelete
                                  className={`${
                                    hasPositionDeleteAccess
                                      ? "text-red-500 cursor-pointer hover:text-red-700 text-xl ml-2"
                                      : "text-xl ml-2"
                                  }`}
                                  title="Delete"
                                  onClick={() =>
                                    handleAction("delete", position)
                                  }
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
                    <TableBody>
                      {positionData.map((position, index) => (
                        <TableRow
                          key={position.rclId}
                          className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {position.positionName}
                              </span>
                              <span className="text-xs text-gray-500">
                                ID: {position.rclId}
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
                                    ? "text-yellow-500 cursor-pointer hover:text-green-700 text-xl mr-2"
                                    : "text-xl mr-2"
                                }`}
                                title="Edit"
                                onClick={() => handleAction("edit", position)}
                              />
                              <MdDelete
                                className={`${
                                  hasPositionDeleteAccess
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
              </div>

              {/* Small screens - Card-like view */}
              <div className="block md:hidden">
                <div className="space-y-4">
                  {positionData.map((position, index) => (
                    <div
                      key={position.id}
                      className="border rounded-lg overflow-hidden shadow-sm">
                      <div
                        className="flex justify-between items-center p-3 cursor-pointer bg-gray-50"
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
                          <div className="bg-gray-50 p-2 rounded">
                            {position.description}
                          </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-2">
                          <Button
                            size="sm"
                            color="warning"
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
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
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
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!positionData || positionData.length === 0) &&
                    !isLoading && (
                      <div className="p-8 text-center text-gray-500">
                        No Data available
                      </div>
                    )}
                </div>
              </div>

              {/* Pagination - Responsive for all screens */}
              {positionData && positionData.length > 0 && (
                <div className="mt-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3 relative z-10 bg-white pb-4">
                  <div className="text-sm font-medium text-gray-600 flex items-center">
                    <span className="mr-1">Showing:</span>
                    <span className="font-bold text-gray-800 mx-1">
                      {totalRecords < positionPerPage
                        ? totalRecords
                        : positionPerPage}
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
      )}
    </div>
  );
};

export default Position;
