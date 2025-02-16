// import {
//   Button,
//   Input,
//   Pagination,
//   Table,
//   TableBody,
//   TableCell,
//   TableColumn,
//   TableHeader,
//   TableRow,
// } from "@nextui-org/react";
// import { BsFilter } from "react-icons/bs";
// import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
// import Search from "../../../components/Search";
// import Filter from "../../../components/Filter";
// import { useEffect, useState } from "react";
// import axiosInstance from "../../../lib/axios-Instance";
// import { toast } from "react-toastify";
// import { GrView } from "react-icons/gr";
// import { FaEdit } from "react-icons/fa";
// import DropDownComp from "../../../components/Dropdown";
// import { useNavigate } from "react-router-dom";
// const Page = () => {
//   const breadcrumbItems = [
//     { label: "Dashboard", href: "/" },
//     { label: "EKYE", href: "/EKYE" },
//   ];

//   const navigate = useNavigate();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [ekyeDashboardDataPerPage, setEkyeDashboardDataPerPage] = useState(10);
//   const startIndex = (currentPage - 1) * ekyeDashboardDataPerPage;
//   const endIndex = startIndex + ekyeDashboardDataPerPage;
//   const TotalEmployee = 30;
//   const employeesPerPage = ekyeDashboardDataPerPage;
//   const dropdownItems = [5, 10, 20, 30, 50, 100];
//   const [filters, setFilters] = useState({ department: "", position: "" });

//   const [eKyeData, setEkyeData] = useState([]);

//   const paginatedEkye = eKyeData?.slice(startIndex, endIndex);

//   const handlePageChange = (EkyeDashboard) => {
//     setCurrentPage(EkyeDashboard);
//   };
//   const handleChange = (action, rclId) => {
//     switch (action) {
//       case "view":
//         navigate(`/View/${rclId}`); // Pass the RCLID dynamically in the route
//         break;
//       case "action":
//         navigate(`/EkyeAction/${rclId}`);
//         console.log(`Edit action for RCLID: ${rclId}`); // Optional for handling the edit case
//         break;
//       default:
//         console.log("Invalid action");
//     }
//   };
//   const handleApplySearch = (searchData) => {
//     console.log("Search applied with:", searchData);
//     // Perform additional filtering or update state in the parent component
//   };

//   useEffect(() => {
//     const FetchAllEKYE = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axiosInstance.get(
//           "/api/v1/admin/completed_ekye_users",
//           // "/api/v1/admin/completedEkyeUsers",
//           {}
//         );
//         if (response?.data?.responseCode === "200") {
//           setEkyeData(response?.data?.data?.content);
//           setEkyeData(response?.data?.data);
//           setEkyeDashboardDataPerPage(response?.data?.data?.pageable?.pageSize);
//         } else {
//           toast.error(response?.data?.message);
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("An error occurred while fetching EKYE data");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     FetchAllEKYE();
//   }, []);
//   console.log(eKyeData);
//   const headeritem = [
//     { label: "Dashboard", href: "/" },
//     { label: "Notice", href: "/notice" },
//   ];
//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axiosInstance.get(
//         "/api/v1/admin/completed_ekye_users",
//         // "/api/v1/admin/completedEkyeUsers",
//         {
//           filterCriteria: {
//             departmentName: filters.department || "",
//             positionName: filters.position || "",
//           },
//         }
//       );

//       if (response?.data?.responseCode === "200") {
//         setEkyeData(response?.data?.data?.content);
//       } else {
//         toast.error(response?.data?.message);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Error fetching data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData(); // Fetch data when filters change
//   }, [filters]);
//   return (
//     <div className=" max-w-[200vh] max-h-[450vh] h-full w-full ">
//       <div className="flex justify-between items-center px-8 py-4">
//         {/* Left Text */}
//         <div className="flex flex-col">
//           <BreadcrumbsComponent items={breadcrumbItems} />
//           <h1 className="page-title">EKYE</h1>
//         </div>

//         {/* Right Controls */}
//         <div className="flex items-center space-x-4">
//           <Search onApplySearch={handleApplySearch} />
//           <Filter onApplyFilters={setFilters} />
//         </div>
//       </div>

//       <div className="px-8 ">
//         <div className="max-h-[90vh] overflow-auto mt-4 rounded-3xl max-w-[100%] ">
//           <Table
//             bordered
//             aria-label="List of Employees who have Completed into EKYE"
//           >
//             <TableHeader>
//               <TableColumn>S.N</TableColumn>
//               <TableColumn>RCL-ID</TableColumn>
//               <TableColumn>Name</TableColumn>
//               <TableColumn>Email</TableColumn>
//               <TableColumn>Department</TableColumn>
//               <TableColumn>Position</TableColumn>
//               <TableColumn>Action</TableColumn>
//             </TableHeader>
//             <TableBody>
//               {paginatedEkye?.map((data, index) => (
//                 <TableRow
//                   key={data.rclId}
//                   className="h-14" // Adjusts row height
//                 >
//                   <TableCell>{startIndex + index + 1}</TableCell>
//                   <TableCell>{data.rclId}</TableCell>
//                   <TableCell>{data.fullName}</TableCell>
//                   <TableCell>{data.email}</TableCell>
//                   <TableCell>{data.departmentName}</TableCell>
//                   <TableCell>{data.positionName}</TableCell>
//                   <TableCell>
//                     {data.Action}
//                     <div className="flex justify-start gap-4">
//                       <GrView
//                         className="text-green-500 cursor-pointer hover:text-green-700"
//                         title="View"
//                         onClick={() => handleChange("view", data.RCLID)}
//                       />
//                       <FaEdit
//                         className="text-red-500 cursor-pointer hover:text-red-700"
//                         title="Edit"
//                         onClick={() => handleChange("action", data.RCLID)}
//                       />
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//         <div className=" flex mt-4 justify-between ">
//           <div>
//             <div className="flex text-xs">
//               <span>Showing:</span>
//               <div className="flex justify-between gap-x-1">
//                 <span className="font-bold">{employeesPerPage}</span>
//                 <span>of</span>
//                 <span>{TotalEmployee}</span>
//               </div>
//             </div>
//           </div>
//           <Pagination
//             initialPage={1}
//             total={Math.ceil(eKyeData?.length / ekyeDashboardDataPerPage)}
//             onChange={handlePageChange}
//           />
//           <div className="flex justify-center items-center">
//             <span className="text-xs">Lines Per Page :</span>
//             <div>
//               <DropDownComp
//                 items={dropdownItems}
//                 onSelect={(value) => setEkyeDashboardDataPerPage(value)}
//               />
//             </div>
//           </div>
//           {/* <EkyeAction /> */}
//           {/* <Filter /> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;

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

const Page = () => {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "EKYE", href: "/EKYE" },
  ];

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [ekyeDashboardDataPerPage, setEkyeDashboardDataPerPage] = useState(10);
  const [filters, setFilters] = useState({ department: "", position: "" });
  const [eKyeData, setEkyeData] = useState([]);

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
        navigate(`/View/${rclId}`);
        break;
      case "action":
        navigate(`/EkyeAction/${rclId}`);
        break;
      default:
        console.log("Invalid action");
    }
  };

  const handleApplySearch = (searchData) => {
    console.log("Search applied with:", searchData);
  };

  const fetchData = async (signal) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        "/api/v1/admin/completed_ekye_users",
        {
          params: {
            departmentName: filters.department || "",
            positionName: filters.position || "",
          },
          signal, // Aborts previous request if a new one is made
        }
      );

      if (response?.data?.responseCode === "200") {
        setEkyeData(
          response?.data?.datalist || response?.data?.data?.content || []
        );
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Error fetching data");
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort(); // Cleanup function to cancel the request on unmount
  }, [filters]);

  return (
    <div className="max-w-[200vh] max-h-[450vh] h-full w-full">
      <div className="flex justify-between items-center px-8 py-4">
        <div className="flex flex-col">
          <BreadcrumbsComponent items={breadcrumbItems} />
          <h1 className="page-title">EKYE</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Search onApplySearch={handleApplySearch} />
          <Filter onApplyFilters={setFilters} />
        </div>
      </div>

      <div className="px-8">
        <div className="max-h-[90vh] overflow-auto mt-4 rounded-3xl max-w-[100%]">
          <Table
            bordered
            aria-label="List of Employees who have Completed EKYE">
            <TableHeader>
              <TableColumn>S.N</TableColumn>
              <TableColumn>RCL-ID</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Department</TableColumn>
              <TableColumn>Position</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody>
              {paginatedEkye.map((data, index) => (
                <TableRow key={data.rclId} className="h-14">
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>{data.rclId}</TableCell>
                  <TableCell>{data.fullName}</TableCell>
                  <TableCell>{data.email}</TableCell>
                  <TableCell>{data.departmentName}</TableCell>
                  <TableCell>{data.positionName}</TableCell>
                  <TableCell>
                    <div className="flex justify-start gap-4">
                      <GrView
                        className="text-green-500 cursor-pointer hover:text-green-700"
                        title="View"
                        onClick={() => handleChange("view", data.rclId)}
                      />
                      <FaEdit
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        title="Edit"
                        onClick={() => handleChange("action", data.rclId)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex mt-4 justify-between">
          <div className="flex text-xs">
            <span>Showing:</span>
            <span className="font-bold">{ekyeDashboardDataPerPage}</span>
            <span>of</span>
            <span>{eKyeData.length}</span>
          </div>
          <Pagination
            initialPage={1}
            total={Math.ceil(eKyeData.length / ekyeDashboardDataPerPage)}
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
