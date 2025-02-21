import { useEffect } from "react";
import LocalStorageUtil from "../utils/LocalStorageUtil"; // Adjust the path as needed

const LocationComponent = () => {
  useEffect(() => {
    // Function to capture and store location data
    const storeLocationData = (position) => {
      const { latitude, longitude } = position.coords;
      LocalStorageUtil.setItem("latitude", latitude); // Use utility to set data
      LocalStorageUtil.setItem("longitude", longitude);
    };

    // Function to handle location errors
    const handleError = (error) => {
      console.error("Error getting location:", error);
    };

    // Get the current position and store it
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(storeLocationData, handleError, {
        enableHighAccuracy: true, // Get the most precise location possible
        timeout: 10000, // Timeout after 10 seconds
        maximumAge: 0, // Always fetch the latest location data
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    // Cleanup function to remove location data on component unmount
    // return () => {
    //   LocalStorageUtil.removeItem("latitude"); // Use utility to remove data
    //   LocalStorageUtil.removeItem("longitude");
    // };
  }, []);

  return <div></div>;
};

export default LocationComponent;
