import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { GlobalStyle } from "./components/ui/GlobalStyle";
import { useLoginStore } from "./components/store/loginStore";

import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Receipts from "./pages/Receipts";
import MarginProfit from "./pages/MarginProfit";
import Customer from "./pages/Customer";
import DetailCustomer from "./pages/DetailCustomer";
import Costs from "./pages/Costs";
import Locations from "./pages/Locations";
import Transfer from "./pages/Transfer";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import InventoryFisico from "./pages/InventoryFisico";
import MatrizVenta from "./pages/MatrizVenta";
import Brands from "./pages/Brands";
import Quotations from "./pages/Quotations";
import InventoryValorado from "./pages/InventoryValorado";
import CruceInventario from "./pages/CurceInventario";
import CreditPlans from "./pages/CreditPlans";
import LocalSalesPurchases from "./pages/LocalSalesPurchases";
import MarginProfitSimulator from "./pages/MarginProfitSimulator.jsx";
import UnitPresentation from "./pages/UnitPresentation.jsx";

import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";
import { socket } from "./services/SocketIOConnection.ts";
import { cerrarSesion } from "./services/CerrarSesion.ts";
import { useEffect } from "react";

const queryClient = new QueryClient();

function App() {
  const { isLoggedIn, level } = useLoginStore();
 
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />

      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
        />

        {/* APP PROTECTED */}
        {isLoggedIn && (
          <></>
        )}

        {/* FALLBACK */}
        {!isLoggedIn && <Route path="*" element={<Navigate to="/login" />} />}
        {isLoggedIn && <Route path="*" element={<Navigate to="/products" />} />}
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
