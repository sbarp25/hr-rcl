import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
  Tooltip,
} from "@heroui/react";
import BreadcrumbsComponent from "../../../components/ui/BreadCrumbsComp.jsx";
import Search from "../../../components/Search";
import Filter from "../../../components/Filter";
import { useEffect, useState } from "react";
import { GrView } from "react-icons/gr";
import { FaEdit, FaChevronDown } from "react-icons/fa";
import DropDownComp from "../../../components/ui/Dropdown.jsx";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../../../components/Loader/SkeletonLoader.jsx";
import {
  hasApproveAccess,
  hasReadAccess,
  hasUpdateAccess,
  hasViewone,
  hasViewSingleAccess,
  MENU_NAMES,
} from "../../../utils/permissionUtils.js";
import { useFetchEKYE } from "../../../hooks/useAuth.js";
import { toast } from "sonner";
import truncateText from "../../../utils/truncateText";

const Page = () => {
  const breadcrumbItems = [{ label: "EKYE", href: "/AdminEkye" }];
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [ekyeDashboardDataPerPage, setEkyeDashboardDataPerPage] = useState(10);
  const [filters, setFilters] = useState({ department: "", position: "" });
  const [searchData, setSearchData] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isSearched, setIsSearched] = useState(false);

  const dropdownItems = [5, 10, 20, 30, 50, 100];

  const hasaccess = hasReadAccess(MENU_NAMES.EKYE);
  const hasViewAccess = hasViewone(MENU_NAMES.EKYE);
  const hasActionAccess = hasApproveAccess(MENU_NAMES.EKYE);

  const {
    data: apiData,
    isLoading: isEKYELoading,
    error: ekyeError,
    refetch: ekyeRefetch,
  } = useFetchEKYE(currentPage, ekyeDashboardDataPerPage);

  const currentData = searchData || apiData;

  const paginatedEkye = currentData?.data || currentData?.datalist || [];
  const totalPages = currentData?.totalPages || 1;
  const totalRecords = currentData?.totalRecords || 0;

  const displayData = paginatedEkye.length > 0 ? paginatedEkye : [];

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setEkyeDashboardDataPerPage(newSize);
    setCurrentPage(1);
    setSearchData(null);
  };

  const handleChange = (action, rclId) => {
    switch (action) {
      case "view":
        if (hasViewAccess) {
          navigate(`/View/${rclId}`);
        } else {
          toast.error("Access denied for view");
        }
        break;
      case "action":
        if (hasActionAccess) {
          navigate(`/EkyeAction/${rclId}`);
        } else {
          toast.error("Access denied for action");
        }
        break;
      default:
        console.log("Invalid action");
    }
  };

  const handleApplySearch = (result) => {
    if (result && result.data && result.data.length >= 0) {
      setSearchData(result);
      setIsSearched(true);
      setCurrentPage(1);
    } else if (result && result.datalist && result.datalist.length >= 0) {
      setSearchData(result);
      setIsSearched(true);
      setCurrentPage(1);
    } else {
      setSearchData(null);
      setIsSearched(false);
      ekyeRefetch();
    }
  };

  const handleApplyFilters = (result) => {
    if (result && (result.data || result.datalist)) {
      setSearchData(result);
      setIsFiltered(true);
      setCurrentPage(1);
    } else {
      setFilters(result || { department: "", position: "" });
      setIsFiltered(false);
      setCurrentPage(1);
      setSearchData(null);
      ekyeRefetch();
    }
  };

  const toggleExpandedRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const startRecord = (currentPage - 1) * ekyeDashboardDataPerPage + 1;
  const endRecord = Math.min(
    currentPage * ekyeDashboardDataPerPage,
    totalRecords
  );
  const displayedRecords = totalRecords > 0 ? `${endRecord}` : "0";

  return (
    <div>
      <div className="max-h-[90vh] overflow-y-auto">
        {/* Page Section */}
        <div className="flex flex-col space-y-4">
          <div className="text-sm">
            <BreadcrumbsComponent items={breadcrumbItems} />
          </div>
          <div className="flex flex-col justify-between sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center page-title -pl-2">
              <h1 className="page-title">EKYE</h1>
            </div>
            <div className="flex gap-x-2 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <Search
                  onApplySearch={handleApplySearch}
                  url="/api/v1/admin/completed_ekye_users"
                  searchFields={[
                    "fullName",
                    "email",
                    "rclId",
                    "departmentName",
                    "positionName",
                  ]}
                  placeholder="Search employees..."
                  pageSize={ekyeDashboardDataPerPage}
                  currentPage={currentPage}
                />
                <Filter
                  onApplyFilters={handleApplyFilters}
                  url="/api/v1/admin/completed_ekye_users"
                  className="w-full sm:w-auto"
                  pageSize={ekyeDashboardDataPerPage}
                  currentPage={currentPage}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-black rounded-lg p-2">
          {/* Large screens - Full table */}
          <div className="hidden lg:block">
            <div className="shadow-md rounded-lg  overflow-y-auto text-left">
              <Table
                bordered
                aria-label="List of Employees who have Completed EKYE"
                className="">
                <TableHeader>
                  <TableColumn>S.N</TableColumn>
                  <TableColumn>RCL-ID</TableColumn>
                  <TableColumn>Name</TableColumn>
                  <TableColumn>Email</TableColumn>
                  <TableColumn>Department</TableColumn>
                  <TableColumn>Position</TableColumn>
                  <TableColumn>Action</TableColumn>
                </TableHeader>
                <TableBody
                  items={displayData}
                  isLoading={isEKYELoading}
                  loadingContent={<SkeletonLoader />}>
                  {(data) => {
                    const index = displayData.indexOf(data);
                    const serialNumber =
                      (currentPage - 1) * ekyeDashboardDataPerPage + index + 1;

                    return (
                      <TableRow
                        key={data.rclId || Math.random()}
                        className="h-14 border-b-2 border-gray-300">
                        <TableCell>{serialNumber}</TableCell>
                        <TableCell>{data.rclId || "N/A"}</TableCell>
                        <TableCell>
                          {data?.fullName?.length < 15 ? (
                            data?.fullName
                          ) : (
                            <Tooltip content={data?.fullName}>
                              {truncateText(data?.fullName, 15)}
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell>
                          {data?.email?.length < 20 ? (
                            data?.email
                          ) : (
                            <Tooltip content={data?.email}>
                              {truncateText(data?.email, 20)}
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell>
                          {data?.departmentName &&
                          !data.departmentName.includes("color=") &&
                          !data.departmentName.match(/^\d{4}-\d{2}-\d{2}$/) ? (
                            data.departmentName.length < 12 ? (
                              data.departmentName
                            ) : (
                              <Tooltip content={data.departmentName}>
                                {truncateText(data.departmentName, 12)}
                              </Tooltip>
                            )
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>
                          {data?.positionName &&
                          !data.positionName.includes("@") ? (
                            data.positionName.length < 12 ? (
                              data.positionName
                            ) : (
                              <Tooltip content={data.positionName}>
                                {truncateText(data.positionName, 12)}
                              </Tooltip>
                            )
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <GrView
                              className={`text-xl ${
                                hasViewAccess
                                  ? "text-green-500 cursor-pointer hover:text-green-700"
                                  : "text-gray-400 cursor-not-allowed"
                              }`}
                              title={
                                hasViewAccess ? "View" : "No permission to view"
                              }
                              onClick={() =>
                                hasViewAccess &&
                                handleChange("view", data.rclId)
                              }
                            />
                            <FaEdit
                              className={`text-xl ${
                                hasActionAccess
                                  ? "text-amber-600 dark:text-amber-500 cursor-pointer hover:text-amber-800 dark:hover:text-amber-300"
                                  : "text-gray-400 cursor-not-allowed"
                              }`}
                              title={
                                hasActionAccess
                                  ? "Edit"
                                  : "No permission to edit"
                              }
                              onClick={() =>
                                hasActionAccess &&
                                handleChange("action", data.rclId)
                              }
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Medium screens - Simplified table */}
          <div className="hidden md:block lg:hidden">
            <div className="shadow-md rounded-lg  overflow-y-auto text-left">
              <Table
                bordered
                aria-label="List of Employees who have Completed EKYE">
                <TableHeader>
                  <TableColumn>RCL-ID</TableColumn>
                  <TableColumn>Name</TableColumn>
                  <TableColumn>Department</TableColumn>
                  <TableColumn>Email</TableColumn>
                  <TableColumn>Action</TableColumn>
                </TableHeader>
                <TableBody
                  items={displayData}
                  isLoading={isEKYELoading}
                  loadingContent={<SkeletonLoader />}>
                  {(data) => (
                    <TableRow
                      key={data.rclId || Math.random()}
                      className="hover:bg-gray-50">
                      <TableCell>{data.rclId || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {data?.fullName || "N/A"}
                          </span>
                          <span className="text-sm text-gray-500">
                            {data?.positionName &&
                            !data.positionName.includes("@")
                              ? data.positionName
                              : "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {data?.departmentName &&
                        !data.departmentName.includes("color=") &&
                        !data.departmentName.match(/^\d{4}-\d{2}-\d{2}$/)
                          ? data.departmentName
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {data?.email?.length < 7 ? (
                          data?.email
                        ) : (
                          <Tooltip content={data?.email}>
                            {truncateText(data?.email, 7)}
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <GrView
                            className={`text-lg ${
                              hasViewAccess
                                ? "text-green-500 cursor-pointer hover:text-green-700"
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                            onClick={() =>
                              hasViewAccess && handleChange("view", data.rclId)
                            }
                          />
                          <FaEdit
                            className={`text-lg ${
                              hasActionAccess
                                ? "text-yellow-500 cursor-pointer hover:text-yellow-700"
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                            onClick={() =>
                              hasActionAccess &&
                              handleChange("action", data.rclId)
                            }
                          />
                        </div>
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
              {displayData.map((data) => (
                <div
                  key={data.rclId || Math.random()}
                  className="border rounded-lg overflow-hidden shadow-sm">
                  <div
                    className="flex justify-between items-center p-3 cursor-pointer bg-gray-50 dark:bg-slate-600"
                    onClick={() => toggleExpandedRow(data.rclId)}>
                    <div className="font-medium">{data.fullName || "N/A"}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {data.rclId || "N/A"}
                      </span>
                      <FaChevronDown
                        size={16}
                        className={`transition-transform ${
                          expandedRow === data.rclId ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                  <div
                    className={`${
                      expandedRow === data.rclId ? "block" : "hidden"
                    } p-3 space-y-2 text-sm`}>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">RCL-ID:</div>
                      <div>{data?.rclId || "N/A"}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Email:</div>
                      <div className="break-all">{data?.email || "N/A"}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Department:</div>
                      <div>
                        {data?.departmentName &&
                        !data.departmentName.includes("color=") &&
                        !data.departmentName.match(/^\d{4}-\d{2}-\d{2}$/)
                          ? data.departmentName
                          : "N/A"}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Position:</div>
                      <div>
                        {data?.positionName && !data.positionName.includes("@")
                          ? data.positionName
                          : "N/A"}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      {hasViewAccess && (
                        <Button
                          size="sm"
                          color="success"
                          variant="flat"
                          onPress={() => handleChange("view", data.rclId)}>
                          View
                        </Button>
                      )}
                      {hasActionAccess && (
                        <Button
                          size="sm"
                          color="warning"
                          variant="flat"
                          onPress={() => handleChange("action", data.rclId)}>
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!isEKYELoading && (!paginatedEkye || paginatedEkye.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              {ekyeError
                ? "Error loading data. Please try again."
                : "No Data available"}
            </div>
          )}

          {/* Pagination Section - Responsive for all screens */}
          {paginatedEkye && paginatedEkye.length > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-sm font-medium text-gray-600 dark:text-white flex items-center">
                <span className="mr-1">Showing:</span>
                <span className="font-bold  mx-1">{displayedRecords}</span>
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
                  isDisabled={isEKYELoading}
                />
              </div>
              <div className="flex justify-center items-center order-3">
                <span className="text-xs mr-2">Lines Per Page:</span>
                <DropDownComp
                  items={dropdownItems}
                  selectedValue={ekyeDashboardDataPerPage}
                  onSelect={handlePageSizeChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
