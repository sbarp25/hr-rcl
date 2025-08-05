import { useEffect, useState } from "react";
import BreadcrumbsComponent from "../../../components/ui/BreadCrumbsComp.jsx";
import Search from "../../../components/Search";
import Filter from "../../../components/Filter";
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
import SkeletonLoader from "../../../components/Loader/SkeletonLoader.jsx";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaCheckCircle, FaChevronDown, FaRegEye } from "react-icons/fa";
import { FaCircleCheck, FaXmark } from "react-icons/fa6";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import DropDownComp from "../../../components/ui/Dropdown.jsx";
import { toast } from "sonner";
import axiosInstance from "../../../lib/axios-Instance";
import TextAreaComp from "../../../components/ui/TextAreaComp.jsx";
import axios from "axios";
import truncateText from "../../../utils/truncateText";
import {
  hasApproveAccess,
  hasReadAccess,
  hasUpdateAccess,
  MENU_NAMES,
} from "../../../utils/permissionUtils.js";
import { IoIosRemoveCircle } from "react-icons/io";
import Loader from "../../../components/Loader/Loader.jsx";

const WorkFromHomeStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWorkFromHome, setSelectedWorkFromHome] = useState(null);
  const [workFromHome, setWorkFromHome] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [WFHDataPerPage, setWFHDataPerPage] = useState(10);
  const [originalWorkFromHomeData, setOriginalWorkFromHomeData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isSearched, setIsSearched] = useState(false);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isRejectOpen,
    onOpen: onRejectOpen,
    onOpenChange: onRejectOpenChange,
    onClose: onRejectClose,
  } = useDisclosure();
  const navigate = useNavigate();

  const { reset, control, handleSubmit } = useForm();
  const breadcrumbItems = [
    { label: "WFH", href: "" },
    { label: "Review WFH", href: "/WFH/Status" },
  ];

  // Fixed handleApplyFilters function
  const handleApplyFilters = (result) => {
    if (result && result.data && result.data.length >= 0) {
      // Filter component returned filtered data
      setWorkFromHome(result.data);
      setIsFiltered(true);

      // Update pagination info if provided
      if (result.totalPages !== undefined) setTotalPages(result.totalPages);
      if (result.totalRecords !== undefined)
        setTotalRecords(result.totalRecords);
    } else {
      // Reset case - restore original data or refetch
      setIsFiltered(false);
      if (originalWorkFromHomeData.length > 0) {
        setWorkFromHome(originalWorkFromHomeData);
        // Reset pagination to original values
        fetchWorkFromHome();
      } else {
        fetchWorkFromHome();
      }
    }
  };

  // Fixed handleApplySearch function
  const handleApplySearch = (result) => {
    if (result && result.data && result.data.length >= 0) {
      // Search component returned filtered data
      setWorkFromHome(result.data);
      setIsSearched(true);

      // Update pagination info if provided
      if (result.totalPages !== undefined) setTotalPages(result.totalPages);
      if (result.totalRecords !== undefined)
        setTotalRecords(result.totalRecords);
    } else {
      // Reset case - restore original data or refetch
      setIsSearched(false);
      if (originalWorkFromHomeData.length > 0) {
        setWorkFromHome(originalWorkFromHomeData);
        // Reset pagination to original values
        fetchWorkFromHome();
      } else {
        fetchWorkFromHome();
      }
    }
  };

  const dropdownItems = [5, 10, 20, 30, 50, 100];

  const displayData = workFromHome.length > 0 ? workFromHome : [];

  const handleAction = (action, data) => {
    setSelectedWorkFromHome(data);
    switch (action) {
      case "approve":
        onOpen();
        break;
      case "reject":
        onRejectOpen();
        break;
      case "view":
        navigate(`/WRH/view/${data.rclId}`);
        break;
      default:
        console.log("Unknown action");
    }
  };

  const onApprove = async () => {
    if (!selectedWorkFromHome) return;

    setIsLoading(true);
    const updateWFH = {
      data: {
        workFromHomeId: selectedWorkFromHome.id,
        approvalStatus: "APPROVED",
      },
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Authentication is missing.");
        return;
      }
      const response = await axiosInstance.post(
        "/api/work_from_home/update_status",
        updateWFH,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response?.data?.responseCode === "200") {
        // toast.success(response?.data?.message);
        fetchWorkFromHome();
        onClose();
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onReject = async (formData) => {
    if (!selectedWorkFromHome) return;

    setIsLoading(true);
    const RejectLeave = {
      data: {
        workFromHomeId: selectedWorkFromHome.id,
        approvalStatus: "REJECTED",
        remark: formData.reason,
      },
    };
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Authentication is missing.");
        return;
      }
      const response = await axiosInstance.post(
        "/api/work_from_home/update_status",
        RejectLeave,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response?.data?.responseCode === "200") {
        // toast.success(response?.data?.message);
        fetchWorkFromHome();
        onRejectClose();
        reset();
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "APPROVED")
      return "bg-green-100 border border-green-600 text-green-600";
    if (status === "REJECTED")
      return "bg-red-100 border border-red-600 text-red-600";
    return "bg-yellow-100 border border-yellow-500 text-yellow-500";
  };

  const toggleExpandedRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Don't clear the array immediately, let the useEffect handle it
  };

  const fetchWorkFromHome = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        `/api/v1/work-from-home/by-role`,
        {
          pageIndex: currentPage,
          pageSize: WFHDataPerPage,
        }
      );

      if (response.data.responseCode === "200") {
        setWorkFromHome(response.data.datalist || []);
        setOriginalWorkFromHomeData(response.data.datalist || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalRecords(response.data.totalRecords || 0);
      } else {
        toast.error(response.data.message || "Failed to fetch data");
        setWorkFromHome([]);
        setOriginalWorkFromHomeData([]);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
      setWorkFromHome([]);
      setOriginalWorkFromHomeData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if not currently filtered or searched
    if (!isFiltered && !isSearched) {
      fetchWorkFromHome();
    }
  }, [currentPage, WFHDataPerPage]);

  const hasWorkFromHomeReviewAccess = hasApproveAccess(MENU_NAMES.WFHSTATUS);
  const hasaccess = hasApproveAccess(MENU_NAMES.WFHSTATUS);

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  const isAssociateTeamLead =
    LocalStorageUtil.getItem("position") === "Associate Team Lead";

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <>
            <div className="container px-2 md:px-8 max-h-[85vh] space-y-4">
              {/**Page Section */}
              <div className="flex flex-col space-y-4">
                <div className="text-sm">
                  <BreadcrumbsComponent items={breadcrumbItems} />
                </div>
                <div className="flex flex-col justify-between sm:flex-row items-start sm:items-center gap-2">
                  <div className="flex items-center page-title -pl-2">
                    <h1 className="page-title">Review WFH</h1>
                  </div>
                  <div className="flex gap-x-2 w-full sm:w-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                      <Search
                        onApplySearch={handleApplySearch}
                        url="/api/v1/work_from_home/list"
                        searchFields={[
                          "userFullName",
                          "departmentName",
                          "requestDate",
                          "workFromHomeStartDate",
                          "workFromHomeEndDate",
                        ]}
                        placeholder="Search Employee..."
                        pageSize={WFHDataPerPage}
                        currentPage={currentPage}
                      />
                      <Filter
                        onApplyFilters={handleApplyFilters}
                        url="/api/v1/work_from_home/list"
                        className="w-full sm:w-auto"
                        pageSize={WFHDataPerPage}
                        currentPage={currentPage}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/**Table Section */}
              <div className="bg-white dark:bg-black rounded-lg p-2">
                {/* Large screens - Full table */}
                <div className="hidden lg:block">
                  <div className="shadow-md rounded-lg max-h-[80vh] overflow-y-auto text-left">
                    <Table
                      bordered
                      aria-label="Table of WFH"
                      className="max-h-[75vh]">
                      <TableHeader>
                        <TableColumn>S.N</TableColumn>
                        <TableColumn>Full Name</TableColumn>
                        <TableColumn>Department</TableColumn>
                        <TableColumn>Request Date</TableColumn>
                        <TableColumn>WFH Start Date</TableColumn>
                        <TableColumn>WFH End Date</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Action</TableColumn>
                      </TableHeader>
                      <TableBody
                        items={displayData}
                        isLoading={isLoading}
                        loadingContent={<SkeletonLoader />}>
                        {(item) => (
                          <TableRow
                            key={item.rclId || Math.random()}
                            className="h-14 border-b-2 border-gray-300">
                            <TableCell>
                              {displayData.indexOf(item) + 1}
                            </TableCell>
                            <TableCell>
                              {item?.userFullName?.length < 7 ? (
                                item?.userFullName
                              ) : (
                                <Tooltip content={item?.userFullName}>
                                  {truncateText(item?.userFullName, 7)}
                                </Tooltip>
                              )}
                            </TableCell>
                            <TableCell>
                              {item?.departmentName?.length < 7 ? (
                                item?.departmentName
                              ) : (
                                <Tooltip content={item?.departmentName}>
                                  {truncateText(item?.departmentName, 7)}
                                </Tooltip>
                              )}
                            </TableCell>
                            <TableCell>{item?.requestDate || "N/A"}</TableCell>
                            <TableCell>
                              {item?.workFromHomeStartDate || "N/A"}
                            </TableCell>
                            <TableCell>
                              {item?.workFromHomeEndDate || "N/A"}
                            </TableCell>
                            <TableCell>
                              <div
                                className={`px-3 py-1.5 rounded-full text-xs font-medium text-center w-fit ${getStatusClass(
                                  item?.approvalStatus
                                )}`}>
                                {item?.approvalStatus === "PENDING"
                                  ? "Pending"
                                  : item?.approvalStatus === "APPROVED"
                                  ? "Approved"
                                  : item?.approvalStatus === "REJECTED"
                                  ? "Rejected"
                                  : "N/A"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <>
                                <div className="flex gap-2">
                                  {isAssociateTeamLead &&
                                  item?.approvalStatus === "PENDING" &&
                                  hasWorkFromHomeReviewAccess ? (
                                    <>
                                      {item?.approvedByAssociateTeamLead ===
                                      true ? (
                                        <FaCircleCheck className="text-green-500 w-5 h-5" />
                                      ) : item?.rejectedByAssociateTeamLead ===
                                        true ? (
                                        <IoIosRemoveCircle className="text-red-500 w-5 h-5" />
                                      ) : (
                                        <>
                                          <FaCheckCircle
                                            className="text-lg text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 cursor-pointer"
                                            onClick={() =>
                                              handleAction("approve", item)
                                            }
                                          />
                                          <FaXmark
                                            className="text-xl text-red-600 hover:text-red-800 cursor-pointer"
                                            onClick={() =>
                                              handleAction("reject", item)
                                            }
                                          />
                                        </>
                                      )}
                                    </>
                                  ) : item?.approvalStatus === "PENDING" &&
                                    hasWorkFromHomeReviewAccess ? (
                                    <>
                                      <FaCheckCircle
                                        className="text-lg text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 cursor-pointer"
                                        onClick={() =>
                                          handleAction("approve", item)
                                        }
                                      />
                                      <FaXmark
                                        className="text-xl text-red-600 hover:text-red-800 cursor-pointer"
                                        onClick={() =>
                                          handleAction("reject", item)
                                        }
                                      />
                                    </>
                                  ) : (
                                    ""
                                  )}{" "}
                                </div>
                              </>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Medium screens - Simplified table */}
                <div className="hidden md:block lg:hidden">
                  <div className="shadow-md rounded-lg max-h-[80vh] overflow-y-auto text-left">
                    <Table bordered aria-label="Table of WFH">
                      <TableHeader>
                        <TableColumn>Full Name</TableColumn>
                        <TableColumn>Start Date</TableColumn>
                        <TableColumn>End Date</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Action</TableColumn>
                      </TableHeader>
                      <TableBody
                        items={displayData}
                        isLoading={isLoading}
                        loadingContent={<SkeletonLoader />}>
                        {(item) => (
                          <TableRow
                            key={item.rclId || Math.random()}
                            className="hover:bg-gray-50">
                            <TableCell>{item?.userFullName}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>
                                  {item?.workFromHomeStartDate || "N/A"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span>{item?.workFromHomeEndDate || "N/A"}</span>
                            </TableCell>
                            <TableCell>
                              <div
                                className={`px-3 py-1.5 rounded-full text-xs font-medium text-center w-fit ${getStatusClass(
                                  item?.approvalStatus
                                )}`}>
                                {item?.approvalStatus || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <>
                                <div className="flex gap-2">
                                  {isAssociateTeamLead &&
                                  item?.approvalStatus === "PENDING" &&
                                  hasWorkFromHomeReviewAccess ? (
                                    <>
                                      {item?.approvedByAssociateTeamLead ===
                                      true ? (
                                        <FaCircleCheck className="text-green-500 w-5 h-5" />
                                      ) : item?.rejectedByAssociateTeamLead ===
                                        true ? (
                                        <IoIosRemoveCircle className="text-red-500 w-5 h-5" />
                                      ) : (
                                        <>
                                          <FaCheckCircle
                                            className="text-lg text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 cursor-pointer"
                                            onClick={() =>
                                              handleAction("approve", item)
                                            }
                                          />
                                          <FaXmark
                                            className="text-xl text-red-600 hover:text-red-800 cursor-pointer"
                                            onClick={() =>
                                              handleAction("reject", item)
                                            }
                                          />
                                        </>
                                      )}
                                    </>
                                  ) : item?.approvalStatus === "PENDING" &&
                                    hasWorkFromHomeReviewAccess ? (
                                    <>
                                      <FaCheckCircle
                                        className="text-lg text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 cursor-pointer"
                                        onClick={() =>
                                          handleAction("approve", item)
                                        }
                                      />
                                      <FaXmark
                                        className="text-xl text-red-600 hover:text-red-800 cursor-pointer"
                                        onClick={() =>
                                          handleAction("reject", item)
                                        }
                                      />
                                    </>
                                  ) : (
                                    ""
                                  )}{" "}
                                </div>
                              </>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Small screens - Card-like view */}
                <div className="block md:hidden overflow-y-auto">
                  <div className="space-y-4">
                    {displayData.map((WFH) => (
                      <div
                        key={WFH.id || Math.random()}
                        className="border rounded-lg overflow-hidden shadow-sm">
                        <div
                          className="flex justify-between items-center p-3 cursor-pointer bg-gray-50 dark:bg-slate-600"
                          onClick={() => toggleExpandedRow(WFH.id)}>
                          <div className="font-medium">
                            {WFH.userFullName || "N/A"}
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`${getStatusClass(
                                WFH?.approvalStatus
                              )} text-center py-1 px-2 text-xs rounded-md w-fit`}>
                              {WFH?.approvalStatus || "N/A"}
                            </div>
                            <FaChevronDown
                              size={16}
                              className={`transition-transform ${
                                expandedRow === WFH.id ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </div>
                        <div
                          className={`${
                            expandedRow === WFH.id ? "block" : "hidden"
                          } p-3 space-y-2 text-sm`}>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Request Date:</div>
                            <div>{WFH?.requestDate || "N/A"}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Start Date:</div>
                            <div>{WFH?.workFromHomeStartDate || "N/A"}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">End Date:</div>
                            <div>{WFH?.workFromHomeEndDate || "N/A"}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Department:</div>
                            <div>{WFH?.departmentName || "N/A"}</div>
                          </div>
                          <div className="flex justify-end gap-2 mt-4">
                            <>
                              <>
                                <div className="flex gap-2">
                                  {isAssociateTeamLead &&
                                  WFH?.approvalStatus === "PENDING" &&
                                  hasWorkFromHomeReviewAccess ? (
                                    <>
                                      {WFH?.approvedByAssociateTeamLead ===
                                      true ? (
                                        <FaCircleCheck className="text-green-500 w-5 h-5" />
                                      ) : WFH?.rejectedByAssociateTeamLead ===
                                        true ? (
                                        <IoIosRemoveCircle className="text-red-500 w-5 h-5" />
                                      ) : (
                                        <>
                                          <Button
                                            size="sm"
                                            color="success"
                                            variant="flat"
                                            onPress={() =>
                                              handleAction("approve", WFH)
                                            }>
                                            Approve
                                          </Button>
                                          <Button
                                            size="sm"
                                            color="danger"
                                            variant="flat"
                                            onPress={() =>
                                              handleAction("reject", WFH)
                                            }>
                                            Reject
                                          </Button>
                                        </>
                                      )}
                                    </>
                                  ) : WFH?.approvalStatus === "PENDING" &&
                                    hasWorkFromHomeReviewAccess ? (
                                    <>
                                      <Button
                                        size="sm"
                                        color="success"
                                        variant="flat"
                                        onPress={() =>
                                          handleAction("approve", WFH)
                                        }>
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        color="danger"
                                        variant="flat"
                                        onPress={() =>
                                          handleAction("reject", WFH)
                                        }>
                                        Reject
                                      </Button>
                                    </>
                                  ) : (
                                    ""
                                  )}{" "}
                                </div>
                              </>
                            </>
                            {/* {WFH?.approvalStatus === "PENDING" &&
                              hasWorkFromHomeReviewAccess && (
                                <>
                                  <Button
                                    size="sm"
                                    color="success"
                                    variant="flat"
                                    onPress={() =>
                                      handleAction("approve", WFH)
                                    }>
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    color="danger"
                                    variant="flat"
                                    onPress={() => handleAction("reject", WFH)}>
                                    Reject
                                  </Button>
                                </>
                              )} */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {!isLoading && (!workFromHome || workFromHome.length === 0) && (
                  <div className="p-8 text-center text-gray-500">
                    No Data available
                  </div>
                )}

                {/**Pagination Section - Responsive for all screens */}
                {workFromHome && workFromHome.length > 0 && (
                  <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="text-sm font-medium text-gray-600  dark:text-white flex items-center">
                      <span className="mr-1">Showing:</span>
                      <span className="font-bold mx-1">
                        {totalRecords < WFHDataPerPage
                          ? totalRecords
                          : WFHDataPerPage}
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
                        size="sm"
                      />
                    </div>
                    <div className="flex justify-center items-center order-3">
                      <span className="text-xs mr-2">Lines Per Page:</span>
                      <DropDownComp
                        items={dropdownItems}
                        selectedValue={WFHDataPerPage}
                        onSelect={setWFHDataPerPage}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Approve Modal */}
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              size="4xl"
              isDismissable={true}
              isKeyboardDismissDisabled={false}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalBody>
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Work From Home Approval
                        </h3>
                        <p>Are you sure you want to approve this WFH?</p>
                        {selectedWorkFromHome && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-gray-50 dark:bg-slate-500 p-3 rounded-md gap-3">
                            <div>
                              <span className="font-medium mr-1">
                                Request ID:
                              </span>
                              <span>{selectedWorkFromHome?.rclId}</span>
                            </div>
                            <div>
                              <span className="font-medium mr-1">
                                Employee:
                              </span>
                              <span>{selectedWorkFromHome?.userFullName}</span>
                            </div>
                            <div>
                              <span className="font-medium mr-1">
                                Start Date:
                              </span>
                              <span>
                                {selectedWorkFromHome?.workFromHomeStartDate}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium mr-1">
                                End Date:
                              </span>
                              <span>
                                {selectedWorkFromHome?.workFromHomeEndDate}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium mr-1">
                                Requested On:
                              </span>
                              <span>{selectedWorkFromHome?.requestDate}</span>
                            </div>
                            <div className="col-span-1 md:col-span-2 lg:col-span-3">
                              <span className="font-medium mr-1">
                                Reason/Email:
                              </span>
                              <span>{selectedWorkFromHome?.reason}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 justify-end mt-4">
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50  dark:bg-black shadow-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-gray-700 dark:text-white">
                              Team Lead:
                            </span>
                            {selectedWorkFromHome?.approvedByTeamLead ===
                            true ? (
                              <FaCircleCheck className="text-green-500 w-5 h-5" />
                            ) : selectedWorkFromHome?.rejectedByTeamLead ===
                              true ? (
                              <IoIosRemoveCircle className="text-red-500 w-5 h-5" />
                            ) : (
                              <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-2xl border-2 border-yellow-300">
                                Pending
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-gray-700 dark:text-white">
                              Associate Team Lead:
                            </span>
                            {selectedWorkFromHome?.approvedByAssociateTeamLead ===
                            true ? (
                              <FaCircleCheck className="text-green-500 w-5 h-5" />
                            ) : selectedWorkFromHome?.rejectedByAssociateTeamLead ===
                              true ? (
                              <IoIosRemoveCircle className="text-red-500 w-5 h-5" />
                            ) : (
                              <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-2xl border-2 border-yellow-300">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          className="text-white bg-black dark:bg-white dark:text-black dark:hover:text-white hover:bg-active dark:hover:dark:bg-active"
                          onPress={() => onApprove()}>
                          Approve
                        </Button>
                        <Button onPress={onClose}>Cancel</Button>
                      </div>
                    </ModalBody>
                  </>
                )}
              </ModalContent>
            </Modal>

            {/* Reject Modal */}
            <Modal
              isOpen={isRejectOpen}
              onOpenChange={onRejectOpenChange}
              isDismissable={true}
              size="4xl"
              isKeyboardDismissDisabled={false}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalBody>
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Work From Home Rejection
                        </h3>
                        <p>
                          Please review the following WFH request details before
                          rejection:
                        </p>
                        {selectedWorkFromHome && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-gray-50 dark:bg-slate-500 p-3 rounded-md gap-3">
                            <div>
                              <span className="font-medium mr-1">
                                Request ID:
                              </span>
                              <span>{selectedWorkFromHome?.rclId}</span>
                            </div>
                            <div>
                              <span className="font-medium mr-1">
                                Employee:
                              </span>
                              <span>{selectedWorkFromHome?.userFullName}</span>
                            </div>
                            <div>
                              <span className="font-medium mr-1">
                                Start Date:
                              </span>
                              <span>
                                {selectedWorkFromHome?.workFromHomeStartDate}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium mr-1">
                                End Date:
                              </span>
                              <span>
                                {selectedWorkFromHome?.workFromHomeEndDate}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium mr-1">
                                Requested On:
                              </span>
                              <span>{selectedWorkFromHome?.requestDate}</span>
                            </div>
                            <div className="col-span-1 md:col-span-2 lg:col-span-3">
                              <span className="font-medium mr-1">
                                Reason/Email:
                              </span>
                              <span>{selectedWorkFromHome?.reason}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <form onSubmit={handleSubmit(onReject)}>
                        <TextAreaComp
                          name="reason"
                          label="Rejection Reason"
                          control={control}
                          placeholder="Enter reason for rejection"
                          rules={{
                            required: "Reason is required",
                            minLength: {
                              value: 10,
                              message:
                                "Reason must be at least 10 characters long.",
                            },
                          }}
                        />
                        <div className="flex gap-2 justify-end mt-4">
                          <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50  dark:bg-black shadow-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-gray-700 dark:text-white">
                                Team Lead:
                              </span>
                              {selectedWorkFromHome?.approvedByTeamLead ===
                              true ? (
                                <FaCircleCheck className="text-green-500 w-5 h-5" />
                              ) : selectedWorkFromHome?.rejectedByTeamLead ===
                                true ? (
                                <IoIosRemoveCircle className="text-red-500 w-5 h-5" />
                              ) : (
                                <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-2xl border-2 border-yellow-300">
                                  Pending
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-gray-700 dark:text-white">
                                Associate Team Lead:
                              </span>
                              {selectedWorkFromHome?.approvedByAssociateTeamLead ===
                              true ? (
                                <FaCircleCheck className="text-green-500 w-5 h-5" />
                              ) : selectedWorkFromHome?.rejectedByAssociateTeamLead ===
                                true ? (
                                <IoIosRemoveCircle className="text-red-500 w-5 h-5" />
                              ) : (
                                <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-2xl border-2 border-yellow-300">
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            className="text-white bg-black dark:bg-white dark:text-black dark:hover:text-white hover:bg-active dark:hover:dark:bg-active"
                            type="submit">
                            Reject
                          </Button>
                          <Button onPress={onClose}>Cancel</Button>
                        </div>
                      </form>
                    </ModalBody>
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
        </div>
      )}
    </>
  );
};

export default WorkFromHomeStatus;
