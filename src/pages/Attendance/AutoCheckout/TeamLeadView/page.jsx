import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { hasReadAccess, MENU_NAMES } from "../../../../utils/permissionUtils";
import { useNavigate } from "react-router-dom";
import BreadcrumbsComponent from "../../../../components/ui/BreadCrumbsComp";
import Search from "../../../../components/Search";
import { IoIosPeople } from "react-icons/io";
import Filter from "../../../../components/Filter";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import SkeletonLoader from "../../../../components/Loader/SkeletonLoader";
import { FaChevronDown } from "react-icons/fa6";
import { Pagination } from "@heroui/pagination";
import DropDownComp from "../../../../components/ui/Dropdown";
import { autoCheckout } from "../../../../api/auth";
import { useAutoCheckout } from "../../../../hooks/useAuth";

const AutoCheckout = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [autoCheckOutDataPerPage, setAutoCheckOutDataPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchFilters, setSearchFilters] = useState(null);
  const [activeFilters, setActiveFilters] = useState(null);

  const navigate = useNavigate();
  const dropdownItems = [5, 10, 20, 30, 50, 100];

  const breadcrumbItems = [
    { label: "Attendance", href: "" },
    { label: "Auto-Checkout", href: "/autoCheckOut" },
  ];

  // Main query for auto checkout data
  const {
    data: autoCheckoutResponse,
    isLoading,
    error,
    refetch,
  } = useAutoCheckout(
    currentPage,
    autoCheckOutDataPerPage,
    searchFilters,
    activeFilters
  );

  // Permission check
  // const hasaccess = true;
  const hasaccess = hasReadAccess(MENU_NAMES.SELFCHECKOUT);

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  // Reset to first page when filters change
  useEffect(() => {
    if (searchFilters || activeFilters) {
      setCurrentPage(1);
    }
  }, [searchFilters, activeFilters]);

  const toggleExpandedRow = (rclId) => {
    setExpandedRow(expandedRow === rclId ? null : rclId);
  };

  const handleApplySearch = (result) => {
    if (result.data) {
      setSearchFilters(result);
      setActiveFilters(null); // Clear other filters
    } else {
      setSearchFilters(null);
      // This will trigger a refetch with the base query
    }
  };

  const handleApplyFilters = async (result) => {
    if (result.data) {
      setActiveFilters(result);
      setSearchFilters(null); // Clear search filters
    } else {
      setActiveFilters(null);
      // This will trigger a refetch with the base query
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setAutoCheckOutDataPerPage(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Derived data from the query response
  const displayData = autoCheckoutResponse?.datalist || [];
  const totalPages = autoCheckoutResponse?.totalPages || 1;
  const totalRecords = autoCheckoutResponse?.totalRecords || 0;

  return (
    <div>
      <div className="flex flex-col space-y-4">
        <div className="text-sm">
          <BreadcrumbsComponent items={breadcrumbItems} />
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div className="flex items-center page-title -pl-2">
            <IoIosPeople className="text-2xl" />
            <span className="page-title">Auto Checkout</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 dark:bg-black">
              <Search
                onApplySearch={handleApplySearch}
                url="/api/auto-checkout/records"
                searchFields={[
                  "rclId",
                  "fullName",
                  "attendanceDate",
                  "departmentName",
                ]}
                placeholder="Search employees..."
              />
              <Filter
                onApplyFilters={handleApplyFilters}
                url="/api/v1/users/list"
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

      {/* Auto Checkout Table - Large screens */}
      <div className="hidden xl:block bg-white dark:bg-black rounded-lg p-2 pb-4 overflow-y-auto">
        <Table bordered aria-label="List of Employees">
          <TableHeader>
            <TableColumn>S.N</TableColumn>
            <TableColumn>RCL-ID</TableColumn>
            <TableColumn>Name</TableColumn>
            <TableColumn>Attendance Date</TableColumn>
            <TableColumn>Department</TableColumn>
          </TableHeader>
          <TableBody
            items={isLoading ? [] : displayData}
            isLoading={isLoading}
            loadingState={isLoading}
            loadingContent={<SkeletonLoader />}>
            {displayData?.map((employee, index) => (
              <TableRow
                key={employee.rclId}
                className="h-14 border-b-2 border-gray-300">
                <TableCell>
                  {(currentPage - 1) * autoCheckOutDataPerPage + index + 1}
                </TableCell>
                <TableCell>{employee.rclId}</TableCell>
                <TableCell>{employee.fullName}</TableCell>
                <TableCell>{employee.attendanceDate}</TableCell>
                <TableCell>{employee.departmentName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!isLoading && displayData.length === 0 && (
          <div className="p-8 text-center text-gray-500">No Data available</div>
        )}
      </div>

      {/* Auto Checkout - Medium screens */}
      <div className="hidden lg:block xl:hidden bg-white dark:bg-black rounded-lg p-2 pb-4 overflow-y-auto">
        <Table bordered aria-label="List of Employees">
          <TableHeader className="bg-gray-50 dark:bg-black">
            <TableColumn>Name</TableColumn>
            <TableColumn>Attendance Date</TableColumn>
            <TableColumn>Department</TableColumn>
          </TableHeader>
          <TableBody
            items={isLoading ? [] : displayData}
            isLoading={isLoading}
            loadingContent={<SkeletonLoader />}>
            {displayData?.map((employee, index) => (
              <TableRow
                key={employee.rclId}
                className="hover:bg-gray-50 dark:hover:bg-slate-400">
                <TableCell>
                  <div>
                    <div className="font-medium">{employee.fullName}</div>
                    <div className="text-sm text-gray-500">
                      {employee.rclId}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{employee.attendanceDate}</TableCell>
                <TableCell>
                  <div>
                    <div>{employee.departmentName}</div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!isLoading && displayData.length === 0 && (
          <div className="p-8 text-center text-gray-500">No Data available</div>
        )}
      </div>

      {/* Auto Checkout - Small screens */}
      <div className="block lg:hidden pb-4 mt-4">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {displayData?.map((employee, index) => (
              <div
                key={employee.rclId}
                className="border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-black">
                <div
                  className="flex justify-between items-center p-3 cursor-pointer bg-gray-50 dark:bg-black"
                  onClick={() => toggleExpandedRow(employee.rclId)}>
                  <div>
                    <div className="font-medium">{employee.fullName}</div>
                    <div className="text-sm text-gray-500">
                      {employee.rclId}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {employee.attendanceDate}
                    </div>
                    <FaChevronDown
                      size={16}
                      className={`transition-transform ${
                        expandedRow === employee.rclId ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
                <div
                  className={`${
                    expandedRow === employee.rclId ? "block" : "hidden"
                  } p-3 space-y-3 text-sm`}>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Department:
                      </span>
                      <span className="text-right">
                        {employee.departmentName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {displayData.length === 0 && (
              <div className="p-8 text-center text-gray-500 bg-white  dark:bg-black rounded-lg">
                No Data available
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination and controls */}
      {displayData.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-sm font-medium text-gray-600 dark:text-white  order-2 sm:order-1 flex items-center">
            <span className="mr-1">Showing</span>
            <span className="font-bold mx-1">
              {Math.min(totalRecords, autoCheckOutDataPerPage)}
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
              classNames={{
                cursor: "bg-active text-white",
              }}
            />
          </div>
          <div className="flex justify-center items-center order-3">
            <span className="text-xs mr-2">Lines Per Page:</span>
            <DropDownComp
              items={dropdownItems}
              selectedValue={autoCheckOutDataPerPage}
              onSelect={handlePageSizeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoCheckout;
