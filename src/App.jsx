import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import AppLayout from "./components/layout/AppLayout";
import { GlobalStyles } from "./components/ui/GlobalStyles";
import { theme } from "./components/ui/Theme";
// PAGES
import Login from "./pages/Login";
import Employees from "./pages/Employees";
import EmployeeDetail from "./pages/employees/EmployeeDetail";
import ConsolidatedEmployees from "./pages/ConsolidatedEmployees";
import Payrolls from "./pages/Payrolls";
import Branches from "./pages/Branches";
import Positions from "./pages/Positions";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Routes>
        {/* Vista sin sidebar */}
        <Route path="/login" element={<Login />} />

        {/* Vistas con sidebar */}
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/usuarios" replace />} />
          <Route path="empleados" element={<Employees />} />
          <Route path="/empleados/:employeeId" element={<EmployeeDetail />} />
          <Route path="empleados/consolidados" element={<ConsolidatedEmployees />} />
          <Route path="planillas" element={<Payrolls />} />
          <Route path="sucursales" element={<Branches />} />
          <Route path="posiciones" element={<Positions />} />
          <Route path="usuarios" element={<Users />} />
          <Route path="configuracion" element={<Settings />} />
        </Route>

        {/* Ruta inexistente */}
        <Route path="*" element={<Navigate to="/usuarios" replace />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;