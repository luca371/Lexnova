import { Routes, Route } from "react-router-dom";
import LandingScreen from "./screens/LandingScreen";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingScreen />} />
    </Routes>
  );
}

export default App;
