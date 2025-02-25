import { BrowserRouter } from "react-router-dom";
import "./App.css";
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import HeroSection from "./Components/HeroSection/HeroSection";
import LocationSection from "./Components/LocationSection/LocationSection";
import BlogPostSection from "./Components/BlogPostSection/BlogPostSection";
import Footer from "./Components/Footer/Footer";

function App() {
  return (
    <BrowserRouter>
      <MainNavbar />
      <HeroSection />
      <LocationSection />
      <BlogPostSection />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
