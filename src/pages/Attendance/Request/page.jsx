import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Accordion,
  AccordionItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
  Tooltip,
} from "@heroui/react";

import DropDownComp from "../../../components/ui/Dropdown.jsx";
import BreadcrumbsComponent from "../../../components/ui/BreadCrumbsComp.jsx";
import Search from "../../../components/Search";
import Filter from "../../../components/Filter";
import { IoIosPeople } from "react-icons/io";
import { hasReadAccess, MENU_NAMES } from "../../../utils/permissionUtils.js";
import { useFetchLateCheckin } from "../../../hooks/useAuth.js";

import { useQueryClient } from "@tanstack/react-query";
import SkeletonLoader from "../../../components/Loader/SkeletonLoader.jsx";

const AttendanceRequest = () => {
  const [filteredData, setFilteredData] = useState(null);
  const [filteredPagination, setFilteredPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lateCheckInDataPerPage, setLateCheckInDataPerPage] = useState(10);
  const dropdownItems = [5, 10, 20, 30, 50, 100];
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // Move query invalidation to useEffect
  useEffect(() => {
    // Invalidate queries when component mounts to ensure fresh data
    queryClient.invalidateQueries({ queryKey: ["FetchTeamLeadLateChekin"] });
  }, [queryClient]);

  const breadcrumbItems = [
    { label: "Attendance", href: "" },
    { label: "Late Checkin", href: "/Attendance/Request" },
  ];

  const hasaccess = hasReadAccess(MENU_NAMES.LATECHECKIN);

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  const { data, isLoading, refetch } = useFetchLateCheckin(
    currentPage,
    lateCheckInDataPerPage
  );
  const lateCheckinData = filteredData || data?.datalist || [];
  const totalPages = filteredPagination?.totalPages || data?.totalPages || 1;
  const totalRecords =
    filteredPagination?.totalRecords || data?.totalRecords || 0;

  // Reset filtered data when page size changes
  useEffect(() => {
    setFilteredData(null);
    setFilteredPagination(null);
  }, [currentPage, lateCheckInDataPerPage]);

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

  const truncateText = (text, maxLength) =>
    text?.length > maxLength ? `${text?.slice(0, maxLength)}` : text;

  return (
    <div className="max-h-[85vh] overflow-y-auto">
      <div className="px-2 md:px-8 max-h-[85vh] space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="text-sm">
            <BreadcrumbsComponent items={breadcrumbItems} />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center page-title -pl-2">
              <IoIosPeople className="text-2xl" />
              <span className="page-title">Late Check in</span>
            </div>
            <div className="flex gap-x-2 w-full sm:w-auto">
              <div className="flex flex-col justify-between sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <Search
                  onApplySearch={handleApplySearch}
                  url="/api/v1/attendance/late-check-in/late-attendance/list"
                  searchFields={[
                    "rclId",
                    "departmentName",
                    "email",
                    "attendanceDate",
                    "expectedCheckInTime",
                    "status",
                    "checkInTime",
                    "lateReason",
                  ]}
                  placeholder="Search employees..."
                />
                <Filter
                  onApplyFilters={handleApplyFilters}
                  url="/api/v1/attendance/late-check-in/late-attendance/list"
                  fieldNames={{
                    departmentField: "departmentId",
                    fromDateField: "createdAt",
                    toDateField: "createdto",
                    positionField: "positionId",
                  }}
                  className="w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-black rounded-lg p-2">
          {/* Large screens - Full table */}
          <div className="hidden lg:block">
            <div className="shadow-md rounded-lg text-left">
              <Table bordered aria-label="List of Review for Late Checkin">
                <TableHeader>
                  <TableColumn>S.N</TableColumn>
                  <TableColumn>RCL-ID</TableColumn>
                  <TableColumn>Department</TableColumn>
                  <TableColumn>Email</TableColumn>
                  <TableColumn>Attendance Date</TableColumn>
                  <TableColumn>Expected CheckInTime</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Actual CheckInTime</TableColumn>
                  <TableColumn>Justification</TableColumn>
                </TableHeader>
                <TableBody
                  items={isLoading ? [] : lateCheckinData}
                  isLoading={isLoading}
                  loadingState={isLoading}
                  loadingContent={<SkeletonLoader />}>
                  {lateCheckinData
                    ?.filter(
                      (lateCHeckin) => lateCHeckin?.status !== "APPROVED"
                    )
                    .map((late, index) => (
                      <TableRow
                        key={late?.lateCheckInId}
                        className="h-14 border-b-2 border-gray-300 dark:border-neutral-500">
                        <TableCell>
                          {(currentPage - 1) * lateCheckInDataPerPage +
                            index +
                            1}
                        </TableCell>
                        <TableCell>
                          {late?.rclId?.length < 7 ? (
                            late?.rclId
                          ) : (
                            <Tooltip content={late?.rclId}>
                              {truncateText(late?.rclId, 7)}
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell>
                          {late?.departmentName?.length < 7 ? (
                            late?.departmentName
                          ) : (
                            <Tooltip content={late?.departmentName}>
                              {truncateText(late?.departmentName, 7) || "N/A"}
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell>
                          {late?.email?.length < 7 ? (
                            late?.email
                          ) : (
                            <Tooltip content={late?.email}>
                              {truncateText(late?.email, 7)}
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell>{late?.attendanceDate}</TableCell>
                        <TableCell>{late?.expectedCheckInTime}</TableCell>

                        <TableCell>
                          <div
                            className={`px-3 py-1.5 text-xs font-medium rounded-full text-center inline-flex items-center justify-center shadow-sm ${
                              late?.status === "APPROVED"
                                ? "bg-green-400/10 border border-green-600 text-green-600"
                                : late?.status === "REJECTED"
                                ? "bg-red-400/10 border border-red-600 text-red-600"
                                : "bg-yellow-400/10 border border-yellow-500 text-yellow-500"
                            } text-center p-2 w-fit`}>
                            {late?.isApproved === true ? (
                              <span>Approved</span>
                            ) : late?.isApproved === false ? (
                              <span>Rejected</span>
                            ) : (
                              <span>Pending</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {late?.checkInTime?.length < 5 ? (
                            late?.checkInTime
                          ) : (
                            <Tooltip content={late?.checkInTime}>
                              {truncateText(late?.checkInTime, 7)}
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell>
                          {late?.lateReason?.length < 5 ? (
                            late?.lateReason
                          ) : (
                            <Tooltip content={late?.lateReason}>
                              {truncateText(late?.lateReason, 7)}
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Medium screens - Simplified table */}
          <div className="hidden md:block lg:hidden">
            <div className="shadow-md rounded-lg overflow-y-auto text-left">
              <Table bordered aria-label="List of Review for Late Checkin">
                <TableHeader>
                  <TableColumn>Employee</TableColumn>
                  <TableColumn>Department</TableColumn>
                  <TableColumn>Date</TableColumn>
                  <TableColumn>Check In</TableColumn>
                  <TableColumn>Reason</TableColumn>
                </TableHeader>
                <TableBody>
                  {lateCheckinData?.map((late) => (
                    <TableRow key={late?.lateCheckInId} className="">
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{late?.fullName}</span>
                          <span className="text-xs text-gray-500">
                            {late?.rclId}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {late?.departmentName.length < 7 ? (
                          late?.departmentName
                        ) : (
                          <Tooltip content={late?.departmentName}>
                            {truncateText(late?.departmentName, 7)}
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>{late?.attendanceDate}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>Expected: {late?.expectedCheckInTime}</span>
                          <span>Actual: {late?.checkInTime}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className="max-w-[150px] truncate"
                          title={late?.lateReason}>
                          {late?.lateReason}
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
            <div className="space-y-4 overflow-y-auto">
              <Accordion>
                {lateCheckinData?.map((late) => (
                  <AccordionItem
                    key={late?.lateCheckInId}
                    title={
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{late?.fullName}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-black dark:text-white">
                            {late?.attendanceDate}
                          </span>
                        </div>
                      </div>
                    }>
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">RCL-ID:</div>
                        <div>{late?.rclId}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Email:</div>
                        <div className="truncate">{late?.email}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Department:</div>
                        <div className="truncate">
                          {late?.departmentName.length < 7 ? (
                            late?.departmentName
                          ) : (
                            <Tooltip content={late?.departmentName}>
                              {truncateText(late?.departmentName, 7)}
                            </Tooltip>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Expected Time:</div>
                        <div>{late?.expectedCheckInTime}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Actual Time:</div>
                        <div>{late?.checkInTime}</div>
                      </div>
                      <div className="col-span-2 mt-2">
                        <div className="font-medium">Justification:</div>
                        <div className="mt-1 p-2 bg-gray-50 dark:bg-black rounded">
                          {late?.lateReason}
                        </div>
                      </div>
                    </>
                  </AccordionItem>
                ))}
              </Accordion>

              {(!lateCheckinData || lateCheckinData.length === 0) && (
                <div className="p-8 text-center text-gray-500">
                  No Data available
                </div>
              )}
            </div>
          </div>

          {/* Pagination - Responsive for all screens */}
          {lateCheckinData && lateCheckinData.length > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-sm font-medium text-gray-600 dark:text-white order-2 sm:order-1 flex items-center">
                <span className="mr-1">Showing</span>
                <span className="font-bold mx-1">
                  {Math.min(totalRecords, lateCheckInDataPerPage)}
                </span>
                <span className="mr-1">of</span>
                <span className="font-bold ">{totalRecords}</span>
              </div>

              <div className="w-full sm:w-auto flex justify-center order-1 sm:order-2">
                <Pagination
                  showControls
                  total={totalPages}
                  page={currentPage}
                  classNames={{
                    cursor: "bg-active text-white",
                  }}
                  onChange={handlePageChange}
                  size="sm"
                />
              </div>
              <div className="flex justify-center items-center order-3">
                <span className="text-xs mr-2">Lines Per Page:</span>
                <DropDownComp
                  items={dropdownItems}
                  selectedValue={lateCheckInDataPerPage}
                  onSelect={setLateCheckInDataPerPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceRequest;
