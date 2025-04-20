import HeroSection from "../../Components/HeroSection/HeroSection";
import MainNavbar from "../../Components/MainNavbar/MainNavbar";
import DistrictCard from "../../Components/ThingsToDo/DistrictCard";
import "../CSS/ThingsToDo.css";

const districts = [
  { name: "Ampara", image: "/DistrictImages/Ampara.jpg" },
  { name: "Anuradhapura", image: "/DistrictImages/Anuradhapura.jpeg" },
  { name: "Badulla", image: "/DistrictImages/Badulla.jpg" },
  { name: "Batticaloa", image: "/DistrictImages/Batticaloa.jpg" },
  { name: "Colombo", image: "/DistrictImages/colombo.jpg" },
  { name: "Galle", image: "/DistrictImages/galle.webp" },
  { name: "Gampaha", image: "/DistrictImages/gampaha.png" },
  { name: "Hambantota", image: "/DistrictImages/hambantota.webp" },
  { name: "Jaffna", image: "/DistrictImages/jaffna.jpg" },
  { name: "Kalutara", image: "/DistrictImages/Kalutara.webp" },
  { name: "Kandy", image: "/DistrictImages/kandy.jpg" },
  { name: "Kegalle", image: "/DistrictImages/Kegalle.webp" },
  { name: "Kilinochchi", image: "/DistrictImages/killinochchi.JPG" },
  { name: "Kurunegala", image: "/DistrictImages/Kurunegala.jpg" },
  { name: "Mannar", image: "/DistrictImages/mannar.jpg" },
  { name: "Matale", image: "/DistrictImages/matale.jpg" },
  { name: "Matara", image: "/DistrictImages/matara.jpg" },
  { name: "Moneragala", image: "/DistrictImages/Moneragala.jpg" },
  { name: "Mullaitivu", image: "/DistrictImages/Mullaitivu.jpg" },
  { name: "Nuwara Eliya", image: "/DistrictImages/nuwaraeliya.jpg" },
  { name: "Polonnaruwa", image: "/DistrictImages/Polonnaruwa.jpg" },
  { name: "Puttalam", image: "/DistrictImages/Puttalam.webp" },
  { name: "Ratnapura", image: "/DistrictImages/Ratnapura.webp" },
  { name: "Trincomalee", image: "/DistrictImages/Trincomalee.jpg" },
  { name: "Vauniya", image: "/DistrictImages/Vavuniya.jpg" },
];

const ThingsToDo = () => {
  return (
    <div className="page-container">
      <MainNavbar />
      <HeroSection
        title={<>Discover & Explore: Unmissable Experiences Await!</>}
        backgroundImage="https://res.cloudinary.com/enchanting/q_70,f_auto,c_lfill,g_auto/exodus-web/2022/05/sri-lanka.jpg"
        placeHolder="Search Your Destination Here..."
        color="black"
      />

      <div>
        <h2
          style={{
            textAlign: "center",
            marginTop: "40px",
            fontSize: "2.5rem",
            fontWeight: "600",
            color: "#2c3e50",
            letterSpacing: "1px",
            textTransform: "uppercase",
            position: "relative",
            paddingBottom: "10px",
          }}
        >
          Explore by District
        </h2>
        <section className="district-container">
          {districts.map((district, index) => (
            <DistrictCard
              key={index}
              name={district.name}
              image={district.image}
            />
          ))}
        </section>
      </div>
    </div>
  );
};

export default ThingsToDo;
