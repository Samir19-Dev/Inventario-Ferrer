import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import CambiarClave from "./pages/CambiarClave";
import Dashboard from "./pages/Dashboard";
import Categorias from "./pages/Categorias";
import Productos from "./pages/Productos";
import Proveedores from "./pages/Proveedores";
import Clientes from "./pages/Clientes";
import Compras from "./pages/Compras";
import Ventas from "./pages/Ventas";
import MovimientosInventario from "./pages/MovimientosInventario";

function App() {
  const checkAuth = () => !!localStorage.getItem("token");
  const [auth, setAuth] = useState(checkAuth());

  useEffect(() => {
    setAuth(checkAuth());
  }, []);

  const getHomeRoute = () => {
    if (!checkAuth()) return "/";
    return localStorage.getItem("mustChangePassword") === "true"
      ? "/cambiar-clave"
      : "/dashboard";
  };

  const ProtectedLayout = ({ roles = [] }) => (
    <ProtectedRoute allowedRoles={roles}>
      <>
        <Navbar setAuth={setAuth} />
        <div className="app-shell">
          <div className="page-shell">
            <Outlet />
          </div>
        </div>
      </>
    </ProtectedRoute>
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          auth ? (
            <Navigate to={getHomeRoute()} replace />
          ) : (
            <Login setAuth={setAuth} />
          )
        }
      />

      <Route
        element={
          <ProtectedLayout
            roles={["ROLE_ADMIN", "ROLE_BODEGUERO", "ROLE_VENDEDOR"]}
          />
        }
      >
        <Route path="/cambiar-clave" element={<CambiarClave />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/ventas" element={<Ventas />} />
      </Route>

      <Route
        element={
          <ProtectedLayout roles={["ROLE_ADMIN", "ROLE_BODEGUERO"]} />
        }
      >
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/compras" element={<Compras />} />
        <Route
          path="/movimientos-inventario"
          element={<MovimientosInventario />}
        />
      </Route>

      <Route path="*" element={<Navigate to={getHomeRoute()} replace />} />
    </Routes>
  );
}

export default App;