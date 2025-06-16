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
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "sonner";
import { GrView } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import DropDownComp from "../../../components/ui/Dropdown.jsx";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../../../components/Loader/SkeletonLoader.jsx";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import {
  hasCreateAccess,
  hasDeleteAccess,
  hasReadAccess,
  hasUpdateAccess,
  hasViewSingleAccess,
  MENU_NAMES,
} from "../../../utils/permissionUtils.js";

const Page = () => {
  const breadcrumbItems = [{ label: "EKYE", href: "/AdminEkye" }];

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ department: "", position: "" });

  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [eKyeData, setEkyeData] = useState([]);
  const [ekyeDashboardDataPerPage, setEkyeDashboardDataPerPage] = useState(10);

  const paginatedEkye = eKyeData;

  const dropdownItems = [5, 10, 20, 30, 50, 100];

  const handlePageChange = (page) => {
    setEkyeData([]);
    setCurrentPage(page);
  };

  const handleChange = (action, rclId) => {
    switch (action) {
      case "view":
        if (hasViewAccess) {
          navigate(`/View/${rclId}`);
        } else {
          ("Access denied");
        }
        break;
      case "action":
        if (hasActionAccess) {
          navigate(`/EkyeAction/${rclId}`);
        } else {
          ("Access denied");
        }
        break;
      default:
        console.log("Invalid action");
    }
  };

  const fetchEkye = async () => {
    setEkyeData([]);
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/v1/admin/completed_ekye_users",
        {
          pageIndex: currentPage,
          pageSize: ekyeDashboardDataPerPage,
        }
      );
      if (response.data.responseCode === "200") {
        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
        setEkyeData(response?.data?.datalist || []);
      } else {
        toast.error(response?.data?.data?.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEkye();
  }, [currentPage, ekyeDashboardDataPerPage]);

  const handleApplySearch = (result) => {
    if (result.data) {
      // Search component returned filtered data
      setEkyeData(result.data);
      if (result.totalPages) setTotalPages(result.totalPages);
      if (result.totalRecords) setTotalRecords(result.totalRecords);
    } else {
      fetchEkye();
    }
  };
  // const hasaccess = true;
  const hasaccess = hasReadAccess(MENU_NAMES.EKYE);

  const hasViewAccess = hasViewSingleAccess(MENU_NAMES.EKYE);
  const hasActionAccess = hasUpdateAccess(MENU_NAMES.EKYE);

  // const hasUpdateAccess = hasUpdateAccess(MENU_NAMES.EKYE);
  // const hasCreateAccess = hasCreateAccess(MENU_NAMES.EKYE);
  // const hasDeleteAccess = hasDeleteAccess(MENU_NAMES.EKYE);
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);
  return (
    <div className="px-4 md:px-8 max-h-[85vh] overflow-y-auto space-y-4">
      <div className="flex justify-between items-center px-8">
        <div className="flex flex-col  space-y-10">
          <BreadcrumbsComponent items={breadcrumbItems} />
          <h1 className="page-title">EKYE</h1>
        </div>
        <div className="flex flex-col space-y-4"></div>
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
            onApplyFilters={setFilters}
            url="/api/v1/admin/completed_ekye_users"
          />
        </div>
      </div>

      <div className="px-1 bg-white rounded-xl">
        <div className="max-h-[90vh] mt-4 rounded-3xl max-w-[100%]">
          <Table
            bordered
            aria-label="List of Employees who have Completed EKYE"
            className="">
            <TableHeader className="">
              <TableColumn>S.N</TableColumn>
              <TableColumn>RCL-ID</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Department</TableColumn>
              <TableColumn>Position</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody
              items={isLoading ? [] : paginatedEkye}
              isLoading={isLoading}
              loadingContent={<SkeletonLoader />}>
              {paginatedEkye.map((data, index) => (
                <TableRow
                  key={data.rclId}
                  className="h-16 justify-center items-center border-b-2 border-gray-300">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{data.rclId}</TableCell>
                  <TableCell>{data.fullName}</TableCell>
                  <TableCell>{data.email}</TableCell>
                  <TableCell>{data.departmentName}</TableCell>
                  <TableCell>{data.positionName}</TableCell>
                  <TableCell>
                    <div className="flex justify-start gap-4">
                      <GrView
                        className={`${
                          hasViewAccess
                            ? "text-green-500 cursor-pointer hover:text-green-700"
                            : ""
                        }`}
                        title="View"
                        onClick={() => handleChange("view", data.rclId)}
                      />
                      <FaEdit
                        className={`${
                          hasActionAccess
                            ? "text-yellow-500 cursor-pointer hover:text-yellow-700"
                            : ""
                        }`}
                        title="Edit"
                        onClick={() => handleChange("action", data.rclId)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!isLoading && (!paginatedEkye || paginatedEkye.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              No Data available
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm font-medium text-gray-600  flex items-center">
            <span className="mr-1">Showing:</span>
            <span className="font-bold text-gray-800 mx-1">
              {totalRecords < ekyeDashboardDataPerPage
                ? totalRecords
                : ekyeDashboardDataPerPage}
              {/* {ekyeDashboardDataPerPage} */}
            </span>
            <span className="mr-1">of</span>
            <span className="font-bold text-gray-800">{totalRecords}</span>
          </div>
          <Pagination
            showControls
            total={totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
          <div className="flex justify-center items-center">
            <span className="text-xs mr-2">Lines Per Page: </span>
            <DropDownComp
              items={dropdownItems}
              onSelect={setEkyeDashboardDataPerPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
