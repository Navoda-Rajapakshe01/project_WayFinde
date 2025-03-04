import MainNavbar from "../Components/MainNavbar/MainNavbar";
import FirstSection from "../Components/ThingsToDo/FirstSection/FirstSection";
import BestLocations from "../Components/ThingsToDo/BestLocations/BestLocations";

const ThingsToDo = () => {
  return (
    <div className="page-container">
      <MainNavbar />
      <FirstSection />
      <BestLocations />
    </div>
  );
};

export default ThingsToDo;
