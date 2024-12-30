import Sidebar from "../Sidebar";

// import Notices from "./src/pages/Notices/page.jsx";
export const Layout = ({ className, children }) => {
  return (
    <div className={`flex h-screen ${className}`}>
      <Sidebar />
      <main className="flex-1 p-4 bg-gray-200">{children}</main>
    </div>
  );
};
