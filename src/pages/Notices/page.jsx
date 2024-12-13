import { MdArticle } from "react-icons/md";

const page = () => {
  const Notice = [
    {
      id: 1,
      title: "Annual Leave Policy Update",
      date: "2024-12-11",
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
      date: "2024-12-11",
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
      date: "2024-12-11",
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

  return (
    <div className="container">
      {/* Notice Heading section */}
      <div className="flex bg-bgprimary font-bold text-white rounded-lg p-4 w-fit tracking-[5px] gap-2">
        <MdArticle />
        <p className="-mt-1">Notices</p>
      </div>
      <div className="bg-white h-auto rounded-md mt-8">
        <div
          className="notices-container p-4"
          style={{ maxHeight: "600px", overflowY: "auto" }}>
          {Notice.map((notice) => (
            <div
              key={notice.id}
              className="notice-item border border-gray-300 rounded-lg p-4 mb-4 shadow-md flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0 w-32 h-64 border-r-2 border-red-600 flex items-center justify-center">
                <p className="text-xl font-bold text-gray-900 mb-1 leading-10">
                  {notice.date}
                </p>
              </div>
              <div className="flex-grow">
                <p>By: {notice.author}</p>
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
      </div>
    </div>
  );
};

export default page;
