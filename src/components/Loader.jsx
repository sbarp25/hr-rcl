import Logo from "../assets/Images/Logo.png";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-bgprimary bg-opacity-85 flex justify-center items-center z-[1000]">
      <div className="text-center">
        {/* Fading logo */}
        <img
          src={Logo}
          alt="Rebooted Logo"
          className="h-auto animate-fade-in-out w-96"
        />
        {/* Optional loading message */}
        {message && (
          <p className="mt-5 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-900 ">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loader;
