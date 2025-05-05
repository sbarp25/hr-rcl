import UserSidebar from "../Sidebar/UserSidebar";

const UserLayout = ({ className, children }) => {
  return (
    <div className={`flex h-screen  ${className}`}>
      <div className="hidden md:flex">
        <UserSidebar />
      </div>
      <main className="flex-1 p-4 ">{children}</main>
    </div>
  );
};

export default UserLayout;
