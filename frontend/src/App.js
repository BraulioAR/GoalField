import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Services from './pages/Services';
import Booking from './pages/Booking';

function App() {
  return (
    <Router>
      <div className="min-h-screen relative">
        {/* Fondo global con césped blur */}
        <div className="fixed inset-0 -z-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-green-50 to-emerald-100"></div>
          <div className="absolute inset-0 backdrop-blur-2xl"></div>
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(34, 197, 94, 0.15) 3px,
                rgba(34, 197, 94, 0.15) 6px
              )`
            }}
          ></div>
        </div>

        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/services" element={<Services />} />
          <Route path="/booking/:serviceId" element={<Booking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
