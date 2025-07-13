// ProfileImageContext.js
import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";


// Create context with default values
export const ProfileBlogContext = createContext({
  profileImage: "/default-profile.png",
  setProfileImage: () => {}
});

// Provider component
export const ProfileImageProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState("/default-profile.png");

  // You can add logic here to load profile image from localStorage or API
  useEffect(() => {
    // Example: Load from localStorage if available
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  return (
    <ProfileBlogContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileBlogContext.Provider>
  );
};

ProfileImageProvider.propTypes = {
  children: PropTypes.node.isRequired
};