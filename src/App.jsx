import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import AppLayout from "./components/layout/AppLayout";
import { GlobalStyles } from "./components/ui/GlobalStyles";
import { theme } from "./components/ui/Theme";
import { ProtectedRoute } from "./routes/ProtectedRoute";
// PAGES
import Login from "./pages/Login";
import Employees from "./pages/Employees";
import EmployeeDetail from "./pages/employees/EmployeeDetail";
import ConsolidatedEmployees from "./pages/ConsolidatedEmployees";
import Payrolls from "./pages/Payrolls";
import Branches from "./pages/Branches";
import Areas from "./pages/Areas";
import JobTitles from "./pages/JobTitles";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Routes>
        {/* sin rutas protegidas */}
        <Route path="/" element={<Login />} />

        {/* con rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="empleados" element={<Employees />} />
            <Route path="/empleados/:employeeId" element={<EmployeeDetail />} />
            <Route path="empleados/consolidados" element={<ConsolidatedEmployees />} />
            <Route path="planillas" element={<Payrolls />} />
            <Route path="sucursales" element={<Branches />} />
            <Route path="areas" element={<Areas />} />
            <Route path="cargos" element={<JobTitles />} />
            <Route path="usuarios" element={<Users />} />
            <Route path="configuracion" element={<Settings />} />
          </Route>
        </Route>

        {/* Ruta inexistente */}
        <Route path="*" element={<Navigate to="/empleados" replace />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;