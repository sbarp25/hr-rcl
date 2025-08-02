import {
  Accordion,
  AccordionItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import BreadcrumbsComponent from "../../../../components/ui/BreadCrumbsComp.jsx";
import Filter from "../../../../components/Filter";
import Search from "../../../../components/Search";
import SkeletonLoader from "../../../../components/Loader/SkeletonLoader.jsx";
import truncateText from "../../../../utils/truncateText";
import DropDownComp from "../../../../components/ui/Dropdown.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../../../components/ui/ButtonComp.jsx";
import {
  hasReadAccess,
  MENU_NAMES,
} from "../../../../utils/permissionUtils.js";
import { useLeaveByList } from "../../../../hooks/useAuth.js";

const SelfLeaveStatus = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [leaveDataPerPage, setLeaveDataPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  const navigate = useNavigate();

  // React Query for fetching leave data
  const {
    data: leaveResponse,
    isLoading,
    refetch: fetchLeave,
  } = useLeaveByList(currentPage, leaveDataPerPage);

  // Extract data from response
  const originalLeaveData = leaveResponse?.datalist || [];
  const leaveData = isFiltered ? filteredData : originalLeaveData;
  const totalPages = leaveResponse?.totalPages || 1;
  const totalRecords = leaveResponse?.totalRecords || 0;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const breadcrumbItems = [
    { label: "Leave", href: "" },
    { label: "Leave Status", href: "/Leave/Status" },
  ];

  const dropdownItems = [5, 10, 20, 30, 50, 100];

  // const hasaccess = true;
  // const hasLeaveUpdateAccess = true;
  const hasaccess = hasReadAccess(MENU_NAMES.LEAVEREQUEST);

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  const handleApplyFilters = (result) => {
    if (result.data) {
      setFilteredData(result.data);
      setIsFiltered(true);
    } else {
      setFilteredData([]);
      setIsFiltered(false);
    }
  };

  // Use API data if available
  const displayData = leaveData.length > 0 && leaveData;

  const getStatusClass = (status) => {
    if (status === "APPROVED")
      return "bg-green-100 border border-green-600 text-green-600";
    if (status === "REJECTED")
      return "bg-red-100 border border-red-600 text-red-600";
    return "bg-yellow-100 border border-yellow-500 text-yellow-500";
  };
  const navigateToAdd = () => {
    navigate("/Leave/addRequest");
  };

  const handleApplySearch = (result) => {
    if (result.data) {
      setFilteredData(result.data);
      setIsFiltered(true);
    } else {
      setFilteredData([]);
      setIsFiltered(false);
    }
  };
  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <div className="container px-2 md:px-8">
        {/**Page Section */}
        <div className="flex flex-col space-y-4">
          <div className="text-sm">
            <BreadcrumbsComponent items={breadcrumbItems} />
          </div>
          <div className="flex flex-col justify-between sm:flex-row  items-start sm:items-center gap-2">
            <div className="flex items-center page-title -pl-2">
              <h1 className="page-title">Leave Status</h1>
            </div>
            <div className="flex gap-x-2 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <Search
                  onApplySearch={handleApplySearch}
                  className="w-full sm:w-auto"
                  url="/api/v1/leave_management/list"
                  searchFields={[
                    "fullName",
                    "departmentName",
                    "requestDate",
                    "leaveType",
                    "leaveStartDate",
                    "leaveEndDate",
                  ]}
                />
                <Filter
                  onApplyFilters={handleApplyFilters}
                  url="/api/v1/leave_management/list"
                  className="w-full sm:w-auto"
                />
                <ButtonComponent
                  className="bg-black text-white"
                  onPress={navigateToAdd}
                  content="Apply Leave"
                />
              </div>
            </div>
          </div>
        </div>

        {/**Table Section */}
        <div className="bg-white dark:bg-black rounded-lg p-2">
          {/* Large screens - Full table */}
          <div className="hidden lg:block">
            <div className="shadow-md rounded-lg   text-left">
              <Table bordered aria-label="Table of Leave" className="">
                <TableHeader>
                  <TableColumn>S.N</TableColumn>
                  <TableColumn>Full Name</TableColumn>
                  <TableColumn>Department</TableColumn>
                  <TableColumn>Request Date</TableColumn>
                  <TableColumn>Leave Type</TableColumn>
                  <TableColumn>Leave Start Date</TableColumn>
                  <TableColumn>Leave End Date</TableColumn>
                  <TableColumn>Status</TableColumn>
                  {/* <TableColumn>Approved by</TableColumn> */}
                </TableHeader>
                <TableBody
                  items={isLoading ? [] : leaveData}
                  isLoading={isLoading}
                  loadingContent={<SkeletonLoader />}>
                  {(item) => (
                    <TableRow
                      key={item.rclId}
                      className="h-14 border-b-2 border-gray-300">
                      <TableCell>{displayData.indexOf(item) + 1}</TableCell>
                      <TableCell>
                        {item?.fullName?.length < 7 ? (
                          item?.fullName
                        ) : (
                          <Tooltip content={item.fullName}>
                            {truncateText(item.fullName, 7)}
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
                      <TableCell>{item?.leaveType || "N/A"}</TableCell>
                      <TableCell>{item?.leaveStartDate || "N/A"}</TableCell>
                      <TableCell>{item?.leaveEndDate || "N/A"}</TableCell>
                      <TableCell>
                        {" "}
                        <div
                          className={`px-3 py-1.5 rounded-full text-xs font-medium text-center w-fit ${getStatusClass(
                            item?.leaveStatus
                          )}`}>
                          {item?.leaveStatus === "PENDING"
                            ? "Pending"
                            : item?.leaveStatus === "APPROVED"
                            ? "Approved"
                            : item?.leaveStatus === "REJECTED"
                            ? "Rejected"
                            : "N/A"}{" "}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Medium screens - Simplified table */}
          <div className="hidden md:block lg:hidden">
            <div className="shadow-md rounded-lg   text-left">
              <Table bordered aria-label="Table of Leave">
                <TableHeader>
                  <TableColumn>Leave</TableColumn>
                  <TableColumn>Date</TableColumn>
                  <TableColumn>Duration</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Team</TableColumn>
                </TableHeader>
                <TableBody
                  items={isLoading ? [] : leaveData}
                  isLoading={isLoading}
                  loadingContent={<SkeletonLoader />}>
                  {(item) => (
                    <TableRow key={item.rclId} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {item?.leaveType || "N/A"}
                          </span>
                          <span className="text-xs text-gray-500">
                            #{item.rclId}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>Start: {item?.leaveStartDate || "N/A"}</span>
                          <span>End: {item?.leaveEndDate || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span>{item?.Days || "N/A"} days</span>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`${getStatusClass(
                            item?.leaveStatus
                          )} text-center py-1 px-2 rounded-md w-fit`}>
                          {item?.leaveStatus || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full font-bold shadow-md text-base ${getStatusClass(
                              item?.leaveStatus
                            )}`}>
                            {item?.teamLeaderName?.charAt(0) || "?"}
                          </div>
                          <div className="text-sm truncate max-w-20">
                            {item?.teamLeaderName || "N/A"}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Small screens - Card-like view */}
          <div className="block md:hidden">
            <div>
              <Accordion variant="bordered">
                {leaveData.map((leave) => (
                  <AccordionItem
                    key={leave.leaveId}
                    aria-label={`${leave.leaveType} - ${leave.leaveStatus}`}
                    title={
                      <div className="flex justify-between items-center w-full">
                        <span className="font-medium">
                          {leave.leaveType || "N/A"}
                        </span>
                        <div
                          className={`${getStatusClass(
                            leave?.leaveStatus
                          )} text-center py-1 px-2 text-xs rounded-md`}>
                          {leave?.leaveStatus || "N/A"}
                        </div>
                      </div>
                    }>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Request Date:</div>
                        <div>{leave?.requestDate || "N/A"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Start Date:</div>
                        <div>{leave?.leaveStartDate || "N/A"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">End Date:</div>
                        <div>{leave?.leaveEndDate || "N/A"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Days:</div>
                        <div>{leave?.Days || "N/A"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Team Leader:</div>
                        <div>{leave?.teamLeaderName || "N/A"}</div>
                      </div>
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {!isLoading && (!leaveData || leaveData.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              No Data available
            </div>
          )}

          {/**Pagination Section - Responsive for all screens */}
          {leaveData && leaveData.length > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-sm font-medium text-gray-600 dark:text-white  flex items-center">
                <span className="mr-1">Showing:</span>
                <span className="font-bold text-gray-800  dark:text-white mx-1">
                  {totalRecords < leaveDataPerPage
                    ? totalRecords
                    : leaveDataPerPage}
                  {/* {leaveDataPerPage} */}
                </span>
                <span className="mr-1">of</span>
                <span className="font-bold text-gray-800 dark:text-white">
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
                  onSelect={setLeaveDataPerPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelfLeaveStatus;
