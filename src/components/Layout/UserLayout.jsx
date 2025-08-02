import UserSidebar from "../Sidebar/UserSidebar";

const UserLayout = ({ className, children }) => {
  return (
    <div className={`flex h-screen  ${className}`}>
      <div className="hidden md:flex flex-shrink-0">
        <UserSidebar />
      </div>
      <main className="flex-1 p-4 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
};

export default UserLayout;
