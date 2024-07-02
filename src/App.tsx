import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import BotsList from "./pages/botsList/botsList";
import { AgentsProvider } from "./context/botsContext";
import "./App.css";

function App() {
  return (
    <AgentsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/List" element={<BotsList />} />
        </Routes>
      </Router>
    </AgentsProvider>
  );
}

export default App;
