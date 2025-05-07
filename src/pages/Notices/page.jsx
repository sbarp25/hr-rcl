import { MdArticle } from "react-icons/md";
import { Pagination } from "@nextui-org/react";
import { useEffect, useState } from "react";
import BreadcrumbsComponent from "../../components/BreadCrumbsComp";
import LocalStorageUtil from "../../utils/LocalStorageUtil";
import { useNavigate } from "react-router-dom";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 3;
  const startIndex = (currentPage - 1) * noticesPerPage;
  const endIndex = startIndex + noticesPerPage;
  const navigate = useNavigate();

  const Notice = [
    {
      id: 1,
      title: "Annual Leave Policy Update",
      date: "2001-01-01",
      author: "HR Department",
      content:
        "The company has updated its annual leave policy effective January 1, 2025. Employees are encouraged to review the updated policy on the HR portal. For any questions, please contact the HR team.",
      attachments: [
        {
          name: "Annual_Leave_Policy.pdf",
          url: "https://example.com/files/Annual_Leave_Policy.pdf",
        },
      ],
      priority: "Medium",
      tags: ["Policy Update", "Leave", "HR"],
    },
    {
      id: 2,
      title: "Annual Leave Policy Update",
      date: "2002-02-02",
      author: "HR Department",
      content:
        "The company has updated its annual leave policy effective January 1, 2025. Employees are encouraged to review the updated policy on the HR portal. For any questions, please contact the HR team.",
      attachments: [
        {
          name: "Annual_Leave_Policy.pdf",
          url: "https://example.com/files/Annual_Leave_Policy.pdf",
        },
      ],
      priority: "Medium",
      tags: ["Policy Update", "Leave", "HR"],
    },
    {
      id: 3,
      title: "Annual Leave Policy Update",
      date: "2003-03-03",
      author: "HR Department",
      content:
        "The company has updated its annual leave policy effective January 1, 2025. Employees are encouraged to review the updated policy on the HR portal. For any questions, please contact the HR team.",
      attachments: [
        {
          name: "Annual_Leave_Policy.pdf",
          url: "https://example.com/files/Annual_Leave_Policy.pdf",
        },
      ],
      priority: "Medium",
      tags: ["Policy Update", "Leave", "HR"],
    },
    {
      id: 4,
      title: "Annual Leave Policy Update",
      date: "2004-04-04",
      author: "HR Department",
      content:
        "The company has updated its annual leave policy effective January 1, 2025. Employees are encouraged to review the updated policy on the HR portal. For any questions, please contact the HR team.",
      attachments: [
        {
          name: "Annual_Leave_Policy.pdf",
          url: "https://example.com/files/Annual_Leave_Policy.pdf",
        },
      ],
      priority: "Medium",
      tags: ["Policy Update", "Leave", "HR"],
    },
    {
      id: 5,
      title: "Annual Leave Policy Update",
      date: "2005-05-05",
      author: "HR Department",
      content:
        "The company has updated its annual leave policy effective January 1, 2025. Employees are encouraged to review the updated policy on the HR portal. For any questions, please contact the HR team.",
      attachments: [
        {
          name: "Annual_Leave_Policy.pdf",
          url: "https://example.com/files/Annual_Leave_Policy.pdf",
        },
      ],
      priority: "Medium",
      tags: ["Policy Update", "Leave", "HR"],
    },
    {
      id: 6,
      title: "Annual Leave Policy Update",
      date: "2006-06-06",
      author: "HR Department",
      content:
        "The company has updated its annual leave policy effective January 1, 2025. Employees are encouraged to review the updated policy on the HR portal. For any questions, please contact the HR team.",
      attachments: [
        {
          name: "Annual_Leave_Policy.pdf",
          url: "https://example.com/files/Annual_Leave_Policy.pdf",
        },
      ],
      priority: "Medium",
      tags: ["Policy Update", "Leave", "HR"],
    },
    {
      id: 7,
      title: "Annual Leave Policy Update",
      date: "2007-07-07",
      author: "HR Department",
      content:
        "The company has updated its annual leave policy effective January 1, 2025. Employees are encouraged to review the updated policy on the HR portal. For any questions, please contact the HR team.",
      attachments: [
        {
          name: "Annual_Leave_Policy.pdf",
          url: "https://example.com/files/Annual_Leave_Policy.pdf",
        },
      ],
      priority: "Medium",
      tags: ["Policy Update", "Leave", "HR"],
    },
    {
      id: 8,
      title: "Annual Leave Policy Update",
      date: "2008-08-08",
      author: "HR Department",
      content:
        "The company has updated its annual leave policy effective January 1, 2025. Employees are encouraged to review the updated policy on the HR portal. For any questions, please contact the HR team.",
      attachments: [
        {
          name: "Annual_Leave_Policy.pdf",
          url: "https://example.com/files/Annual_Leave_Policy.pdf",
        },
      ],
      priority: "Medium",
      tags: ["Policy Update", "Leave", "HR"],
    },
    {
      id: 9,
      title: "Annual Leave Policy Update",
      date: "2009-09-09",
      author: "HR Department",
      content:
        "The company has updated its annual leave policy effective January 1, 2025. Employees are encouraged to review the updated policy on the HR portal. For any questions, please contact the HR team.",
      attachments: [
        {
          name: "Annual_Leave_Policy.pdf",
          url: "https://example.com/files/Annual_Leave_Policy.pdf",
        },
      ],
      priority: "Medium",
      tags: ["Policy Update", "Leave", "HR"],
    },
    {
      id: 10,
      title: "Annual Leave Policy Update",
      date: "2010-10-10",
      author: "HR Department",
      content:
        "The company has updated its annual leave policy effective January 1, 2025. Employees are encouraged to review the updated policy on the HR portal. For any questions, please contact the HR team.",
      attachments: [
        {
          name: "Annual_Leave_Policy.pdf",
          url: "https://example.com/files/Annual_Leave_Policy.pdf",
        },
      ],
      priority: "Medium",
      tags: ["Policy Update", "Leave", "HR"],
    },
  ];

  const paginatedNotices = Notice.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const breadcrumbItems = [{ label: "Notice", href: "/notice" }];

  const menu = LocalStorageUtil.getItem("menu");
  /**To check Employee see status */
  const hasaccess = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 20)
  );
  const hasHandBookCreateAccess = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 19)
  );
  const hasHandBookEditAccess = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 21)
  );
  const hasHandBookDeleteAccess = menu?.some((menu) =>
    menu?.actionList?.some((action) => action.actionId === 22)
  );

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Notice Heading section */}
      <div className="flex flex-col space-y-4">
        <div className="text-sm">
          <BreadcrumbsComponent items={breadcrumbItems} />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MdArticle className="text-xl" />
            <p className="text-lg font-semibold">Notices</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md mt-4">
        <div className="p-4 max-h-[34rem] overflow-y-auto">
          {paginatedNotices.map((notice) => (
            <div
              key={notice.id}
              className="border border-gray-300 rounded-lg p-4 mb-4 shadow-md flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0 md:w-32 md:h-64 border-b-2 md:border-b-0 md:border-r-2 border-red-600 flex items-center justify-center">
                <p className="text-xl font-bold text-gray-900 leading-6 text-center">
                  {notice.date}
                </p>
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-bold mb-2">{notice.title}</h2>
                <p className="text-gray-800 mb-2">{notice.content}</p>
                {notice.attachments.length > 0 && (
                  <div className="attachments mt-2">
                    <p className="font-semibold">Attachments:</p>
                    <ul>
                      {notice.attachments.map((attachment, index) => (
                        <li key={index}>
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline">
                            {attachment.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="tags mt-2">
                  <p className="font-semibold">Tags:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {notice.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="priority mt-2">
                  <span
                    className={`text-sm font-semibold py-1 px-2 rounded-full ${
                      notice.priority === "High"
                        ? "bg-red-500 text-white"
                        : notice.priority === "Medium"
                        ? "bg-yellow-500 text-white"
                        : "bg-green-500 text-white"
                    }`}>
                    {notice.priority} Priority
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Pagination
            initialPage={1}
            total={Math.ceil(Notice.length / noticesPerPage)}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
