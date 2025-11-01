import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import './styles/index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* We'll add more routes later */}
      </Routes>
    </Router>
  );
};

export default App;
