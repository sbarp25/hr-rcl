import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import BreadcrumbsComponent from "../../../components/ui/BreadCrumbsComp.jsx";
import Search from "../../../components/Search";
import Filter from "../../../components/Filter";
import { useEffect, useState } from "react";
import { GrView } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import DropDownComp from "../../../components/ui/Dropdown.jsx";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../../../components/Loader/SkeletonLoader.jsx";
import {
  hasReadAccess,
  hasUpdateAccess,
  hasViewSingleAccess,
  MENU_NAMES,
} from "../../../utils/permissionUtils.js";
import { useFetchEKYE } from "../../../hooks/useAuth.js";
import { toast } from "sonner";

const Page = () => {
  const breadcrumbItems = [{ label: "EKYE", href: "/AdminEkye" }];
  const navigate = useNavigate();

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [ekyeDashboardDataPerPage, setEkyeDashboardDataPerPage] = useState(10);
  const [filters, setFilters] = useState({ department: "", position: "" });
  const [searchData, setSearchData] = useState(null); // For storing search results

  const dropdownItems = [5, 10, 20, 30, 50, 100];

  // Permission checks
  const hasaccess = hasReadAccess(MENU_NAMES.EKYE);
  const hasViewAccess = hasViewSingleAccess(MENU_NAMES.EKYE);
  const hasActionAccess = hasUpdateAccess(MENU_NAMES.EKYE);

  // Fetch data using React Query
  const {
    data: apiData,
    isLoading: isEKYELoading,
    error: ekyeError,
    refetch: ekyeRefetch,
  } = useFetchEKYE(currentPage, ekyeDashboardDataPerPage);

  // Use search data if available, otherwise use API data
  const currentData = searchData || apiData;

  // Handle different data structures: try both 'data' and 'datalist' properties
  const paginatedEkye = currentData?.data || currentData?.datalist || [];
  const totalPages = currentData?.totalPages || 1;
  const totalRecords = currentData?.totalRecords || 0;

  // Access control
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  // Reset to first page when page size changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [ekyeDashboardDataPerPage, currentPage]);

  // REMOVED: The problematic useEffect that was clearing search data
  // useEffect(() => {
  //   if (searchData) {
  //     setSearchData(null); // This was clearing search results when page changes
  //   }
  // }, [currentPage, searchData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setEkyeDashboardDataPerPage(newSize);
    setCurrentPage(1); // Reset to first page
    setSearchData(null); // Clear search data when changing page size
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
    if (result?.data) {
      setSearchData(result);
      setCurrentPage(1);
    } else if (result?.datalist) {
      setSearchData(result);
      setCurrentPage(1);
    } else {
      setSearchData(null);
      ekyeRefetch();
    }
  };

  const handleApplyFilters = (result) => {
    if (result?.data || result?.datalist) {
      setSearchData(result);
      setCurrentPage(1);
    } else {
      setFilters(result);
      setCurrentPage(1);
      setSearchData(null); // Clear search when applying filters
      ekyeRefetch();
    }
  };

  // Calculate display values for pagination info
  const startRecord = (currentPage - 1) * ekyeDashboardDataPerPage + 1;
  const endRecord = Math.min(
    currentPage * ekyeDashboardDataPerPage,
    totalRecords
  );
  const displayedRecords =
    totalRecords > 0 ? `${startRecord}-${endRecord}` : "0";

  return (
    <div className="px-4 md:px-8 max-h-[85vh] overflow-y-auto space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-center px-8">
        <div className="flex flex-col space-y-10">
          <BreadcrumbsComponent items={breadcrumbItems} />
          <h1 className="page-title">EKYE</h1>
        </div>

        <div className="flex items-center space-x-4">
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
          />
          <Filter
            onApplyFilters={handleApplyFilters}
            url="/api/v1/admin/completed_ekye_users"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="px-1 bg-white dark:bg-black rounded-xl">
        <div className="max-h-[90vh] mt-4 rounded-3xl max-w-[100%]">
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
              items={paginatedEkye}
              isLoading={isEKYELoading}
              loadingContent={<SkeletonLoader />}>
              {paginatedEkye?.map((data, index) => {
                const serialNumber =
                  (currentPage - 1) * ekyeDashboardDataPerPage + index + 1;

                return (
                  <TableRow
                    key={data.rclId || index}
                    className="h-16 justify-center items-center border-b-2 border-gray-300">
                    <TableCell>{serialNumber}</TableCell>
                    <TableCell>{data.rclId || "N/A"}</TableCell>
                    <TableCell>{data.fullName || "N/A"}</TableCell>
                    <TableCell>{data.email || "N/A"}</TableCell>
                    <TableCell>
                      {/* Handle invalid department data */}
                      {data.departmentName &&
                      !data.departmentName.includes("color=") &&
                      !data.departmentName.match(/^\d{4}-\d{2}-\d{2}$/)
                        ? data.departmentName
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {/* Handle cases where positionName might be an email */}
                      {data.positionName && !data.positionName.includes("@")
                        ? data.positionName
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-start gap-4">
                        <GrView
                          className={`${
                            hasViewAccess
                              ? "text-green-500 cursor-pointer hover:text-green-700"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                          title={
                            hasViewAccess ? "View" : "No permission to view"
                          }
                          onClick={() =>
                            hasViewAccess && handleChange("view", data.rclId)
                          }
                        />
                        <FaEdit
                          className={`${
                            hasActionAccess
                              ? "text-yellow-500 cursor-pointer hover:text-yellow-700"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                          title={
                            hasActionAccess ? "Edit" : "No permission to edit"
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
              })}
            </TableBody>
          </Table>

          {/* No Data Message */}
          {!isEKYELoading && (!paginatedEkye || paginatedEkye.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              {ekyeError
                ? "Error loading data. Please try again."
                : "No Data available"}
            </div>
          )}
        </div>

        {/* Pagination Section */}
        <div className="flex justify-between items-center mt-4 px-2 py-4">
          <div className="text-sm font-medium text-gray-600 dark:text-white flex items-center">
            <span className="mr-1">Showing:</span>
            <span className="font-bold mx-1">{displayedRecords}</span>
            <span className="mr-1">of</span>
            <span className="font-bold">{totalRecords}</span>
          </div>

          <Pagination
            showControls
            total={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            isDisabled={isEKYELoading}
          />

          <div className="flex justify-center items-center">
            <span className="text-xs mr-2">Lines Per Page:</span>
            <DropDownComp
              items={dropdownItems}
              selectedValue={ekyeDashboardDataPerPage}
              onSelect={handlePageSizeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
