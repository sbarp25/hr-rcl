import Sidebar from "../Sidebar";

export const Layout = ({ className, children }) => {
  return (
    <div className={`flex h-screen  ${className}`}>
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <main className="flex-1 p-4 ">{children}</main>
    </div>
  );
};
