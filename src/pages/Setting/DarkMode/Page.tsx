import React from "react";
import GoBack from "../../../components/GoBack";
import { IoInformationCircle, IoMoon, IoSunny } from "react-icons/io5";
import { ThemeSwitcher } from "../../../components/ThemeSwitcher";

const DarkMode = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 ">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 ">
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    Appearance
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Customize your visual experience
                  </p>
                </div>
              </div>
              <GoBack />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Theme Switcher Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2  dark:bg-gray-700 rounded-lg">
                    <IoMoon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Dark Mode
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Switch between light and dark themes
                    </p>
                  </div>
                </div>
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DarkMode;
// import React, { useState, useEffect } from "react";
// import { BiCheck, BiCheckCircle, BiShield, BiUser } from "react-icons/bi";
// import { FiZap } from "react-icons/fi";
// // import { Check, User, Shield, Zap, CheckCircle } from "lucide-react";

// const PlayfulRecaptchaUI = () => {
//   const [stage, setStage] = useState("initial"); // initial, checking, verified, error
//   const [progress, setProgress] = useState(0);
//   const [showSparkles, setShowSparkles] = useState(false);

//   const handleVerification = () => {
//     if (stage === "initial") {
//       setStage("checking");
//       setProgress(0);

//       // Simulate verification process
//       const interval = setInterval(() => {
//         setProgress((prev) => {
//           if (prev >= 100) {
//             clearInterval(interval);
//             setStage("verified");
//             setShowSparkles(true);
//             setTimeout(() => setShowSparkles(false), 2000);
//             return 100;
//           }
//           return prev + 10;
//         });
//       }, 150);
//     }
//   };

//   const resetVerification = () => {
//     setStage("initial");
//     setProgress(0);
//     setShowSparkles(false);
//   };

//   return (
//     <>
//       <div className="flex items-center justify-center min-h-screen bg-white p-4">
//         <div className="relative">
//           {/* Sparkles animation */}
//           {showSparkles && (
//             <div className="absolute inset-0 pointer-events-none">
//               {[...Array(6)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="absolute w-2 h-2 bg-rose-400 rounded-full animate-ping"
//                   style={{
//                     left: `${20 + Math.random() * 60}%`,
//                     top: `${20 + Math.random() * 60}%`,
//                     animationDelay: `${i * 0.2}s`,
//                     animationDuration: "1s",
//                   }}
//                 />
//               ))}
//             </div>
//           )}

//           {/* Main container */}
//           <div
//             className={`
//           relative bg-white rounded-2xl shadow-2xl p-8 transition-all duration-500 transform
//           ${stage === "checking" ? "scale-105" : "scale-100"}
//           ${stage === "verified" ? "bg-white border border-rose-200" : ""}
//           max-w-md w-full
//         `}>
//             {/* Header */}
//             <div className="text-center mb-8">
//               <div className="flex items-center justify-center mb-4">
//                 <BiShield className="w-8 h-8 text-gray-800 mr-2" />
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   Human Verification
//                 </h2>
//               </div>
//               <p className="text-gray-700">
//                 {stage === "initial" && "Click to verify you're human"}
//                 {stage === "checking" && "Analyzing human patterns..."}
//                 {stage === "verified" && (
//                   <>
//                     <BiCheckCircle className="inline w-5 h-5 mr-1" />{" "}
//                     Verification complete!
//                   </>
//                 )}
//               </p>
//             </div>

//             {/* Main verification area */}
//             <div className="relative">
//               {/* Initial state */}
//               {stage === "initial" && (
//                 <button
//                   onClick={handleVerification}
//                   className="w-full p-6 border-2 border-dashed border-gray-400 rounded-xl hover:border-gray-700 hover:bg-gray-50 transition-all duration-300 group">
//                   <div className="flex items-center justify-center space-x-3">
//                     <BiUser className="w-8 h-8 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
//                     <span className="text-lg font-medium text-gray-700 group-hover:text-gray-900">
//                       I'm not a robot
//                     </span>
//                   </div>
//                 </button>
//               )}

//               {/* Checking state */}
//               {stage === "checking" && (
//                 <div className="text-center py-6">
//                   <div className="relative inline-block mb-6">
//                     <div className="w-20 h-20 border-4 border-gray-300 rounded-full animate-spin">
//                       <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-gray-800 rounded-full animate-spin"></div>
//                     </div>
//                     <FiZap className="absolute inset-0 m-auto w-8 h-8 text-gray-800 animate-pulse" />
//                   </div>

//                   {/* Progress bar */}
//                   <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
//                     <div
//                       className="bg-gradient-to-r from-gray-700 to-gray-900 h-3 rounded-full transition-all duration-300"
//                       style={{ width: `${progress}%` }}></div>
//                   </div>

//                   <div className="space-y-2">
//                     <p className="text-sm text-gray-700">
//                       Checking browser behavior...
//                     </p>
//                     <p className="text-sm text-gray-700">
//                       Analyzing mouse patterns...
//                     </p>
//                     <p className="text-sm text-gray-700">
//                       Verifying human interaction...
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Verified state */}
//               {stage === "verified" && (
//                 <div className="text-center py-6">
//                   <div className="relative inline-block mb-6">
//                     <div className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center animate-bounce">
//                       <BiCheck className="w-10 h-10 text-white animate-pulse" />
//                     </div>
//                     <div className="absolute -inset-2 bg-rose-300 rounded-full animate-ping opacity-75"></div>
//                   </div>

//                   <h3 className="text-xl font-bold text-rose-700 mb-2">
//                     Verification Successful!
//                   </h3>
//                   <p className="text-rose-600 mb-4">
//                     You've been verified as human{" "}
//                     <BiCheckCircle className="inline w-4 h-4 ml-1" />
//                   </p>

//                   <button
//                     onClick={resetVerification}
//                     className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors duration-300">
//                     Verify Again
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="mt-8 text-center">
//               <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
//                 <BiShield className="w-4 h-4" />
//                 <span>Protected by HumanCAPTCHA</span>
//               </div>
//             </div>
//           </div>

//           {/* Floating elements */}
//           <div className="absolute -top-4 -right-4 w-8 h-8 bg-rose-200 rounded-full animate-float opacity-70"></div>
//           <div
//             className="absolute -bottom-4 -left-4 w-6 h-6 bg-gray-300 rounded-full animate-float opacity-70"
//             style={{ animationDelay: "1s" }}></div>
//         </div>

//         <style>{`
//           @keyframes float {
//             0%,
//             100% {
//               transform: translateY(0px);
//             }
//             50% {
//               transform: translateY(-20px);
//             }
//           }
//           .animate-float {
//             animation: float 3s ease-in-out infinite;
//           }
//         `}</style>
//       </div>
//     </>
//   );
// };

// export default PlayfulRecaptchaUI;
