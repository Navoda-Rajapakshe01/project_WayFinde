import SearchBar from "../../Searchbar/Searchbar";
import "./FirstSection.css";

const FirstSection = () => {
  return (
    <>
      <div className="hero">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Discover & Explore: Unmissable Experiences Await!
        </h1>
        <br />
        <br />
        <SearchBar />
      </div>
    </>
  );
};

export default FirstSection;
