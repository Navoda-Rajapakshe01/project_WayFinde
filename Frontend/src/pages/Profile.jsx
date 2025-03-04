// import { Link, useLocation } from "react-router-dom";
// import "./profile.css";

// const Profile = () => {
//   const location = useLocation(); // Get current URL path
//   const stats = [
//     { name: "Posts", value: 10, path: "/posts" },
//     { name: "Blogs", value: 5, path: "/blogs" },
//     { name: "Followers", value: 100, path: "/followers" },
//     { name: "Following", value: 120, path: "/following" },
//   ];
//   return (
//     <div className="page-container">
//       {/* profile image part */}
//       <div className="profile_container">
//         <img
//           src="https://static.flashintel.ai/image/9/4/5/945db06270b111fab0848c6d2a3f8f74.jpeg"
//           alt="profile image"
//           className="profile_image"
//         />
//         <div className="profile_info">
//           <div className="profile_name">Writer name</div>
//           <div className="grid grid-cols-4 gap-4 text-center">
//             {stats.map((stat) => (
//               <Link key={stat.name} to={stat.path} className="cursor-pointer">
//                 <div
//                   className={`p-2 transition duration-300 hover:bg-gray-200 rounded-lg ${
//                     location.pathname === stat.path
//                       ? "underline font-bold text-blue-600"
//                       : ""
//                   }`}
//                 >
//                   <p className="text-lg font-bold">{stat.value}</p>
//                   <p>{stat.name}</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//           <div className="edit_profile_button">
//             <button class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br  focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">
//               Edit Profile
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
