import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { VerDatos } from "./routes/Pantallas/VerDatos";
import { Asistencias } from "./routes/Pantallas/Asistencias";
import { DatosLaborales } from "./routes/Pantallas/DatosLaborales";
import { ReconocimientoFacial } from "./routes/Interfaces/RecoFacial";
import { Login } from "./routes/Interfaces/Login";
import { Signup } from "./routes/Interfaces/Signup";

import { Empleado } from "./routes/Interfaces/Empleado";
import { RegistroFacial } from "./routes/Interfaces/RegistroFacial";
import Verificacion from "./components/Verificacion";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<ReconocimientoFacial />} />
          <Route path="/registro-facial" element={<RegistroFacial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verificacion" element={<Verificacion />} />
          <Route path="/empleado" element={<Empleado />}>
            <Route path="verDatos" element={<VerDatos />}></Route>
            <Route path="asistencias" element={<Asistencias />}></Route>
            <Route path="datosLaborales" element={<DatosLaborales />}></Route>
            <Route path="" element={<Asistencias />}></Route>
            <Route path="*" element={<Asistencias />}></Route>
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
