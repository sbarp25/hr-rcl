const AuthLayout = ({ children }) => {
  return (
    <div className="">
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default AuthLayout;
