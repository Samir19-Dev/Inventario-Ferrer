import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../styles/navbar.css";

function Navbar({ setAuth }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef(null);

  const username = localStorage.getItem("username") || "Usuario";
  const role = localStorage.getItem("role") || "";

  const esAdmin = role === "ROLE_ADMIN";
  const esBodeguero = role === "ROLE_BODEGUERO";
  const esVendedor = role === "ROLE_VENDEDOR";

  const puedeGestionarCatalogos = esAdmin || esBodeguero;
  const puedeGestionarProveedores = esAdmin || esBodeguero;
  const puedeGestionarCompras = esAdmin || esBodeguero;
  const puedeGestionarMovimientos = esAdmin || esBodeguero;

  const puedeGestionarClientes = esAdmin || esBodeguero || esVendedor;
  const puedeGestionarVentas = esAdmin || esBodeguero || esVendedor;
  const puedeVerInventario = esAdmin || esBodeguero || esVendedor;

  const toggleDropdown = (menu) => {
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };

  const closeAllMenus = () => {
    setOpenDropdown(null);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("mustChangePassword");
    setAuth(false);
    closeAllMenus();
    navigate("/");
  };

  useEffect(() => {
    closeAllMenus();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinkClass = ({ isActive }) =>
    `nav-link navbar-link-custom ${isActive ? "active" : ""}`;

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark inventory-navbar"
      ref={navbarRef}
    >
      <div className="container">
        <Link
          className="navbar-brand inventory-brand d-flex align-items-center"
          to={esVendedor ? "/productos" : "/dashboard"}
          onClick={closeAllMenus}
        >
          <span className="brand-icon">🛠</span>
          <span>Ferretería Ferrer</span>
        </Link>

        <button
          className="navbar-toggler inventory-toggler"
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${mobileOpen ? "show" : ""}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 navbar-menu-custom">
            {!esVendedor && (
              <li className="nav-item">
                <NavLink
                  className={navLinkClass}
                  to="/dashboard"
                  onClick={closeAllMenus}
                >
                  Dashboard
                </NavLink>
              </li>
            )}

            {puedeGestionarCatalogos && (
              <li className="nav-item dropdown position-relative">
                <button
                  className="nav-link dropdown-toggle btn btn-link border-0 bg-transparent navbar-link-custom"
                  type="button"
                  onClick={() => toggleDropdown("catalogos")}
                >
                  Catálogos
                </button>

                {openDropdown === "catalogos" && (
                  <ul className="dropdown-menu show inventory-dropdown">
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/categorias"
                        onClick={closeAllMenus}
                      >
                        Categorías
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/productos"
                        onClick={closeAllMenus}
                      >
                        Productos
                      </Link>
                    </li>
                    {puedeGestionarProveedores && (
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/proveedores"
                          onClick={closeAllMenus}
                        >
                          Proveedores
                        </Link>
                      </li>
                    )}
                    {puedeGestionarClientes && (
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/clientes"
                          onClick={closeAllMenus}
                        >
                          Clientes
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            )}

            {puedeVerInventario && (
              <li className="nav-item">
                <NavLink
                  className={navLinkClass}
                  to="/productos"
                  onClick={closeAllMenus}
                >
                  Inventario
                </NavLink>
              </li>
            )}

            {puedeGestionarCompras && (
              <li className="nav-item">
                <NavLink
                  className={navLinkClass}
                  to="/compras"
                  onClick={closeAllMenus}
                >
                  Compras
                </NavLink>
              </li>
            )}

            {puedeGestionarVentas && (
              <li className="nav-item">
                <NavLink
                  className={navLinkClass}
                  to="/ventas"
                  onClick={closeAllMenus}
                >
                  Ventas
                </NavLink>
              </li>
            )}

            {puedeGestionarMovimientos && (
              <li className="nav-item">
                <NavLink
                  className={navLinkClass}
                  to="/movimientos-inventario"
                  onClick={closeAllMenus}
                >
                  Movimientos
                </NavLink>
              </li>
            )}
          </ul>

          <ul className="navbar-nav navbar-menu-custom">
            <li className="nav-item dropdown position-relative">
              <button
                className="nav-link dropdown-toggle btn btn-link border-0 bg-transparent navbar-link-custom profile-trigger"
                type="button"
                onClick={() => toggleDropdown("perfil")}
              >
                <i className="bi bi-person-circle me-1"></i>
                {username}
              </button>

              {openDropdown === "perfil" && (
                <ul className="dropdown-menu dropdown-menu-end show inventory-dropdown">
                  {!esVendedor && (
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/dashboard"
                        onClick={closeAllMenus}
                      >
                        Dashboard
                      </Link>
                    </li>
                  )}

                  <li>
                    <Link
                      className="dropdown-item"
                      to="/cambiar-clave"
                      onClick={closeAllMenus}
                    >
                      Cambiar contraseña
                    </Link>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;