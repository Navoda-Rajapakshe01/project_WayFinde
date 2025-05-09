import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../Components/Authentication/AuthContext/AuthContext";
import ProfileHeadSection from "../../Components/UserProfileComponents/ProfileHeadsection/ProfileHeadsection";
import "../CSS/Profile.css"; // Import your CSS file for styling

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="page-container">
      <ProfileHeadSection />
    </div>
  );
};

export default Profile;
