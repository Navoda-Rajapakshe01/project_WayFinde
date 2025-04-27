import { Link, useLocation} from "react-router-dom";

import "./ProfileHeadsection.css";

const ProfileHeadSection = () => {
  // const navigate = useNavigate(); // Used to redirect
  const location = useLocation(); // Get current URL path
  const stats = [
    { name: "Posts", value: 10, path: "/posts" },
    { name: "Blogs", value: 5, path: "/blogs" },
    { name: "Followers", value: 100, path: "/followers" },
    { name: "Following", value: 120, path: "/following" },
  ];

  // Redirect to "/posts" if the current path is not in stats
  // useEffect(() => {
  //   const isValidPath = stats.some((stat) => stat.path === location.pathname);
  //   if (!isValidPath) {
  //     navigate("/posts", { replace: true }); // Redirect to "/posts"
  //   }
  // }, [location.pathname, navigate]);
  return (
    <div className="page-container">
      {/* profile image part */}
      <div className="profile_container">
        <img
          src="https://static.flashintel.ai/image/9/4/5/945db06270b111fab0848c6d2a3f8f74.jpeg"
          alt="profile image"
          className="profile_image"
        />
        <div className="profile_info">
          <div className="profile_name">Writer name</div>
          <div className="grid grid-cols-4 gap-4 text-center">
            {stats.map((stat) => (
              <Link key={stat.name} to={stat.path} className="cursor-pointer">
                <div
                  className={`p-2 transition duration-300 hover:bg-gray-200 rounded-lg ${
                    location.pathname === stat.path
                      ? "underline font-bold text-blue-600"
                      : ""
                  }`}
                >
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p>{stat.name}</p>
                </div>
              </Link>
            ))}
          </div>
          <div>
            <button className="editProfilebutton">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeadSection;
