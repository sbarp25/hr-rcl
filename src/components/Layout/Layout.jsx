import MobileNavigation from "../MobileNavigation";
import Sidebar from "../Sidebar";

// import Notices from "./src/pages/Notices/page.jsx";
export const Layout = ({ className, children }) => {
  return (
    <div className={`flex h-screen ${className}`}>
      <div className="flex md:hidden mb-1">
        <MobileNavigation />
      </div>
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <main className="flex-1 p-4 bg-gray-200">{children}</main>
    </div>
  );
};
