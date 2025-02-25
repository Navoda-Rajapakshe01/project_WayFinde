import { BrowserRouter } from "react-router-dom";
import "./App.css";
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import HeroSection from "./Components/HeroSection/HeroSection";

function App() {
  return (
    <>
      <BrowserRouter>
        <MainNavbar />
      </BrowserRouter>
      <HeroSection />
    </>
  );
}

export default App;
