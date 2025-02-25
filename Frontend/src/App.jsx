import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import Accommodation from "./pages/Accommodation";
import Blog from "./pages/Blog";
import Home from "./pages/Home";
import PlanTrip from "./pages/PlanTrip";
import ThingsToDo from "./pages/ThingsToDo";
import Vehicle from "./pages/Vehicle";

function App() {
  //const [count, setCount] = useState(0);

  return (
    <>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} exact />
            <Route path="/home" element={<Home />} exact />
            <Route path="/plantrip" element={<PlanTrip />} exact />
            <Route path="/blog" element={<Blog />} />
            <Route path="/accommodation" element={<Accommodation />} />
            <Route path="/thingstodo" element={<ThingsToDo />} />
            <Route path="/vehicle" element={<Vehicle />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
