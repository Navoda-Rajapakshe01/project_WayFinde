
import ProfileHeadSection from "../Components/UserProfileComponents/ProfileHeadsection/ProfileHeadsection";
import "./CSS/Profile.css";
import { useContext } from "react";
import { AuthContext } from "../Components/Authentication/AuthContext/AuthContext";

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
