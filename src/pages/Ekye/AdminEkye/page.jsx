import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import Search from "../../../components/Search";
import Filter from "../../../components/Filter";
import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import { GrView } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import DropDownComp from "../../../components/Dropdown";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../../../components/SkeletonLoader";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";

const Page = () => {
  const breadcrumbItems = [{ label: "EKYE", href: "/AdminEkye" }];

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ department: "", position: "" });

  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [eKyeData, setEkyeData] = useState([]);
  const [ekyeDashboardDataPerPage, setEkyeDashboardDataPerPage] = useState(30);
  const startIndex = (currentPage - 1) * ekyeDashboardDataPerPage;
  const endIndex = startIndex + ekyeDashboardDataPerPage;
  const paginatedEkye = eKyeData.length
    ? eKyeData.slice(startIndex, endIndex)
    : [];

  const dropdownItems = [5, 10, 20, 30, 50, 100];

  const handlePageChange = (page) => {
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

  const handleApplySearch = (searchData) => {
    console.log("Search applied with:", searchData);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          "/api/v1/admin/non-approved-ekye",
          {
            // const response = await axiosInstance.post("/api/v1/ekye_status/list", {
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
        console.error("Error fetching departments:", error);
        toast.error("Error fetching departments.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, [currentPage, ekyeDashboardDataPerPage]);

  const menu = LocalStorageUtil.getItem("menu");

  // const hasaccess = true;
  const hasaccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 32)
  );

  const hasViewAccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 32)
  );
  const hasActionAccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 32)
  );

  const hasUpdateAccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 33)
  );
  const hasCreateAccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 31)
  );
  const hasDeleteAccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 34)
  );
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, []);
  return (
    <div className="px-4 md:px-8 max-h-[85vh] space-y-4">
      <div className="flex justify-between items-center px-8">
        <div className="flex flex-col  space-y-10">
          <BreadcrumbsComponent items={breadcrumbItems} />
          <h1 className="page-title">EKYE</h1>
        </div>
        <div className="flex flex-col space-y-4"></div>
        <div className="flex items-center space-x-4">
          <Search onApplySearch={handleApplySearch} />
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
            className="max-h-[75vh]">
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
                  <TableCell>{startIndex + index + 1}</TableCell>
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

        <div className="flex justify-between items-center">
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
            <span className="text-xs">Lines Per Page :</span>
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
