import { Routes, Route } from "react-router-dom";
import LandingScreen from "./screens/LandingScreen";
import LoginScreen from "./screens/LoginScreen";
import SignScreen from "./screens/SignScreen";
import FormScreen from "./screens/FormScreen";
import StartScreen from "./screens/StartScreen";
import AskAI from "./screens/AskAI";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<SignScreen />} />
      <Route path="/form" element={<FormScreen />} />
      <Route path="/start" element={<StartScreen />} />
      <Route path="/lumi" element={<AskAI />} />
    </Routes>
  );
}

export default App;
