import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/Home";
import ChatPage from "./pages/Chat";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
