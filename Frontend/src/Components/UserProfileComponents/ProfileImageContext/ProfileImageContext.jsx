import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types'; // ✅ Import PropTypes

export const ProfileImageContext = createContext();

export const ProfileImageProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState('/profile.jpg'); // default

  return (
    <ProfileImageContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileImageContext.Provider>
  );
};

// ✅ Add PropTypes validation
ProfileImageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
