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
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import paymentCanceled from './pages/paymentCanceled';
import PaymentaymentCanceled from "./pages/paymentCanceled";
import PaymentComplete from "./pages/paymentComplete";
const App = () => {
  return (
    <div className="container mx-auto px-[20px]">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
      />
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
        <Route path="/pay-canceled" element={<PaymentaymentCanceled />} />
        <Route path="/pay-complete" element={<PaymentComplete />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
