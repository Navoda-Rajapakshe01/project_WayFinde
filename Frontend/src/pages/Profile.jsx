import { useLocation } from "react-router-dom";
import ProfileHeadSection from "../Components/UserProfileComponents/ProfileHeadsection/ProfileHeadsection";
import "./CSS/Profile.css";

const Profile = () => {
  const location = useLocation(); // Get current URL path
  const stats = [
    { name: "Posts", value: 10, path: "/profile/posts" },
    { name: "Blogs", value: 5, path: "/profile/blogs" },
    { name: "Followers", value: 100, path: "/profile/followers" },
    { name: "Following", value: 120, path: "/profilefollowing" },
  ];

  return (
    <div className="page-container">
      <ProfileHeadSection />
    </div>
  );
};

export default Profile;
