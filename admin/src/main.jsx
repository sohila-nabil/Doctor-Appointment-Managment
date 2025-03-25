import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AppContextProvidor, { AppContext } from "./context/AppContext.jsx";
import DoctorContextProvidor, { DoctorContext } from "./context/DoctorContext.jsx";
import AdminContextProvidor from "./context/AdminContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvidor>
      <DoctorContextProvidor>
        <AppContextProvidor>
          <App />
        </AppContextProvidor>
      </DoctorContextProvidor>
    </AdminContextProvidor>
  </BrowserRouter>
);
