import Sidebar from "../Sidebar";

export const Layout = ({ className, children }) => {
  return (
    <div className={`flex h-screen ${className}`}>
      <Sidebar />
      <main className="flex-1 p-4 bg-gray-200">{children}</main>
    </div>
  );
};
