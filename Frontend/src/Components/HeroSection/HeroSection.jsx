import SearchBar from "../Searchbar/Searchbar";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <>
      <div className="hero">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Discover. Explore. Experience. <br />
          Your Perfect Journey Starts Here!
        </h1>
        <p className="text-lg mb-6">Plan your trips easily</p> <br />
        <SearchBar />
      </div>
    </>
  );
};

export default HeroSection;
