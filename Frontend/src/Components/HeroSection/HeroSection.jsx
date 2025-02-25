import SearchBar from "../Searchbar/Searchbar";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <>
      <div className="hero">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to WayFinde
        </h1>
        <p className="text-lg mb-6">Plan your trips easily</p>
        <SearchBar />
      </div>
    </>
  );
};

export default HeroSection;
