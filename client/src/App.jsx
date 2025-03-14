import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Appointement from "./pages/Appointement";
import MyAppointements from "./pages/MyAppointements";
import Login from "./pages/Login";
import Doctors from "./pages/Doctors";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
const App = () => {
  return (
    <div className="container mx-auto px-[20px]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/appointement/:docId" element={<Appointement />} />
        <Route path="/my-appointement" element={<MyAppointements />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
