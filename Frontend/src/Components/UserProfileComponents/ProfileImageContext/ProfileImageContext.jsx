import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

// Create context with default values
export const ProfileImageContext = createContext({
  profileImage: "/default-profile.png",
  setProfileImage: () => {},
});

// ✅ Add this hook to fix the import error in MainNavbar
export const useProfileImage = () => useContext(ProfileImageContext);

// Provider component
export const ProfileImageProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState("/default-profile.png");

  // You can add logic here to load profile image from localStorage or API
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  return (
    <ProfileImageContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileImageContext.Provider>
  );
};

ProfileImageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
