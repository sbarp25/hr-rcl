import { useEffect, useState } from "react";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";
import axiosInstance from "../../../../lib/axios-Instance";
import BreadcrumbsComponent from "../../../../components/ui/BreadCrumbsComp.jsx";
import Search from "../../../../components/Search";
import Filter from "../../../../components/Filter";
import DropDownComp from "../../../../components/ui/Dropdown.jsx";
import LocalStorageUtil from "../../../../utils/LocalStorageUtil";
import SkeletonLoader from "../../../../components/Loader/SkeletonLoader.jsx";
import truncateText from "../../../../utils/truncateText";
import ButtonComponent from "../../../../components/ui/ButtonComp.jsx";
import { useNavigate } from "react-router-dom";

const SelfWorkFromHome = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [workFromHome, setWorkFromHome] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [WFHDataPerPage, setWFHDataPerPage] = useState(10);
  const [originalWorkFromHomeData, setOriginalLeaveData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const breadcrumbItems = [
    { label: "WFH", href: "" },
    { label: "WFH Status", href: "/WFH/Status" },
  ];

  const navigate = useNavigate();

  const handleApplyFilters = (result) => {
    if (result.data) {
      // Filter component returned filtered data
      setWorkFromHome(result.data);
      if (result.totalPages) setTotalPages(result.totalPages);
      if (result.totalRecords) setTotalRecords(result.totalRecords);
    } else {
      // Reset case - restore original data
      setWorkFromHome(originalWorkFromHomeData);
    }
  };

  const dropdownItems = [5, 10, 20, 30, 50, 100];

  const displayData = workFromHome.length > 0 && workFromHome;

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
    setWorkFromHome([]);
    setCurrentPage(page);
  };

  const fetchWorkFromHome = async () => {
    setIsLoading(true);
    try {
      // const response = await axiosInstance.post(`/api/v1/work_from_home/list`, {
      //   pageIndex: currentPage,
      //   pageSize: WFHDataPerPage,
      // });
      const response = await axiosInstance.get(`/api/work_from_home/requests`);
      if (response.data.responseCode === "200") {
        setWorkFromHome(response.data.datalist);
        setOriginalLeaveData(response.data.datalist);
        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkFromHome();
  }, [currentPage, WFHDataPerPage]);

  const menu = LocalStorageUtil.getItem("menu");

  const hasaccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 80)
  );
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  const handleApplySearch = (result) => {
    if (result.data) {
      // Search component returned filtered data
      setOriginalLeaveData(result.data);
      if (result.totalPages) setTotalPages(result.totalPages);
      if (result.totalRecords) setTotalRecords(result.totalRecords);
    } else {
      fetchWorkFromHome();
    }
  };
  const onNavigate = () => {
    navigate("/WFH/Add");
  };
  return (
    <div>
      {" "}
      <>
        <div className="container px-2 md:px-8 max-h-[85vh] space-y-4">
          {/**Page Section */}
          <div className="flex flex-col space-y-4">
            <div className="text-sm">
              <BreadcrumbsComponent items={breadcrumbItems} />
            </div>
            <div className="flex flex-col justify-between sm:flex-row  items-start sm:items-center gap-2">
              <div className="flex items-center page-title -pl-2">
                <h1 className="page-title">WFH Status</h1>
              </div>
              <div className="flex gap-x-2 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  <Search
                    onApplySearch={handleApplySearch}
                    url="/api/work_from_home/review"
                    searchFields={[
                      "fullName",
                      "email",
                      "rclId",
                      "Department",
                      "position",
                    ]}
                    placeholder="Search Employee..."
                  />
                  <Filter
                    onApplyFilters={handleApplyFilters}
                    url="/api/work_from_home/review"
                    className="w-full sm:w-auto"
                  />
                  <ButtonComponent
                    className="bg-black text-white"
                    onPress={onNavigate}
                    content="Apply WFH"
                  />
                </div>
              </div>
            </div>
          </div>

          {/**Table Section */}
          <div className="bg-white rounded-lg p-2">
            {/* Large screens - Full table */}
            <div className="hidden lg:block">
              <div className="shadow-md rounded-lg max-h-[80vh] overflow-y-auto text-left">
                <Table
                  bordered
                  aria-label="Table of Leave"
                  className="max-h-[75vh]">
                  <TableHeader>
                    <TableColumn>S.N</TableColumn>
                    <TableColumn>Full Name</TableColumn>
                    <TableColumn>Department</TableColumn>
                    <TableColumn>Request Date</TableColumn>{" "}
                    <TableColumn>WRH Start Date</TableColumn>
                    <TableColumn>WRH End Date</TableColumn>
                    <TableColumn>Status</TableColumn>
                  </TableHeader>
                  <TableBody
                    items={isLoading ? [] : workFromHome}
                    isLoading={isLoading}
                    loadingContent={<SkeletonLoader />}>
                    {(item) => (
                      <TableRow
                        key={item.rclId}
                        className="h-14 border-b-2 border-gray-300">
                        <TableCell>{displayData.indexOf(item) + 1}</TableCell>
                        <TableCell>
                          {item?.userFullName.length < 7 ? (
                            item?.userFullName
                          ) : (
                            <Tooltip content={item?.userFullName}>
                              {truncateText(item?.userFullName, 7)}
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell>
                          {item?.departmentName.length < 7 ? (
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
                          {" "}
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
              <div className="shadow-md rounded-lg max-h-[80vh] overflow-y-auto text-left">
                <Table bordered aria-label="Table of Leave">
                  <TableHeader>
                    <TableColumn>Full Name</TableColumn>
                    <TableColumn>Start Date</TableColumn>
                    <TableColumn>End Date</TableColumn>
                    <TableColumn>Status</TableColumn>
                  </TableHeader>
                  <TableBody
                    items={isLoading ? [] : workFromHome}
                    isLoading={isLoading}
                    loadingContent={<SkeletonLoader />}>
                    {(item) => (
                      <TableRow
                        key={Math.random()}
                        className="hover:bg-gray-50">
                        <TableCell>{item?.fullName}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{item?.workFromHomeStartDate || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span>{item?.workFromHomeEndDate || "N/A"}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full font-bold shadow-md text-base ${getStatusClass(
                                item?.approvalStatus
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
            <div className="block md:hidden overflow-y-auto">
              <div className="space-y-4">
                {workFromHome.map((WFH) => (
                  <div
                    key={WFH.rclId}
                    className="border rounded-lg overflow-hidden shadow-sm">
                    <div
                      className="flex justify-between items-center p-3 cursor-pointer bg-gray-50"
                      onClick={() => toggleExpandedRow(WFH.rclId)}>
                      <div className="font-medium">{WFH.fullName || "N/A"}</div>
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
                            expandedRow === WFH.rclId ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                    <div
                      className={`${
                        expandedRow === WFH.rclId ? "block" : "hidden"
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
                        <div className="font-medium">Team Leader:</div>
                        <div>{WFH?.teamLeaderName || "N/A"}</div>
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
                <div className="text-sm font-medium text-gray-600  flex items-center">
                  <span className="mr-1">Showing:</span>
                  <span className="font-bold text-gray-800 mx-1">
                    {totalRecords < WFHDataPerPage
                      ? totalRecords
                      : WFHDataPerPage}
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
                    onSelect={setWFHDataPerPage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    </div>
  );
};

export default SelfWorkFromHome;
