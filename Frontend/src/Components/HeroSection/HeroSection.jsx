import SearchBar from "../Searchbar/Searchbar";
import "./HeroSection.css";

const HeroSection = ({ title, subtitle, backgroundImage,placeHolder }) => {
  return (
    <>
      <div
        className="hero"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {title}
          {/* Discover. Explore. Experience. <br />
          Your Perfect Journey Starts Here! */}
        </h1>
        <p className="text-lg mb-6">{subtitle}</p> <br />
        <SearchBar placeHolder={placeHolder} />
      </div>
    </>
  );
};

export default HeroSection;
