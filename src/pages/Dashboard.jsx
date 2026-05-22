import { useEffect, useState } from "react";
import { getDashboardResumen, getMovimientosInventario } from "../services/api";
import "../styles/dashboard.css";

function Dashboard() {
  const username = localStorage.getItem("username") || "Usuario";

  const [stats, setStats] = useState({
    totalProductos: 0,
    totalCategorias: 0,
    productosStockBajo: 0,
    totalUsuarios: 0,
  });

  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recargando, setRecargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Inventario Ferrer";
  }, []);

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return fecha;
    return date.toLocaleString("es-CO");
  };

  const obtenerClaseBadge = (tipo) => {
    const valor = String(tipo || "").toUpperCase();
    if (valor.includes("ENTRADA")) return "badge-soft-success";
    if (valor.includes("SALIDA")) return "badge-soft-danger";
    if (valor.includes("AJUSTE")) return "badge-soft-warning";
    return "badge-soft-secondary";
  };

  const cargarDashboard = async (silencioso = false) => {
    try {
      if (silencioso) {
        setRecargando(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [resumen, movimientosData] = await Promise.all([
        getDashboardResumen(),
        getMovimientosInventario(),
      ]);

      setStats({
        totalProductos: resumen?.totalProductos ?? 0,
        totalCategorias: resumen?.totalCategorias ?? 0,
        productosStockBajo: resumen?.productosStockBajo ?? 0,
        totalUsuarios: resumen?.totalUsuarios ?? 0,
      });

      setMovimientos(
        Array.isArray(movimientosData) ? movimientosData.slice(0, 5) : []
      );
    } catch (err) {
      setError(err.message || "No se pudo cargar la información del dashboard.");
    } finally {
      setLoading(false);
      setRecargando(false);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  if (loading) {
    return (
      <div className="container py-4">
        <h2 className="mb-3 text-white">Inventario Ferrer</h2>
        <p className="mb-0 text-light">Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="container py-4 dashboard-shell">
      <section className="dashboard-hero p-4 p-lg-5 mb-4">
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <span className="dashboard-eyebrow">Panel principal</span>
            <h2 className="dashboard-title mt-2 mb-2">
              Bienvenido, {username}
            </h2>
            <p className="dashboard-subtitle mb-0">
              Visualiza el estado general del inventario, supervisa movimientos
              recientes y mantén control operativo sobre Ferretería Ferrer.
            </p>
          </div>

          <div className="col-lg-4">
            <div className="dashboard-hero-side">
              <div className="dashboard-date-badge mb-3">
                {new Date().toLocaleDateString("es-CO", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <button
                className="btn btn-primary w-100"
                onClick={() => cargarDashboard(true)}
                disabled={recargando}
              >
                {recargando ? "Actualizando..." : "Actualizar panel"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {error && <div className="alert alert-danger">{error}</div>}

      <section className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <article className="dashboard-stat-card dashboard-primary p-4 h-100">
            <div className="dashboard-stat-top">
              <span className="dashboard-card-label">Productos</span>
              <i className="bi bi-box-seam dashboard-card-icon"></i>
            </div>
            <h3 className="dashboard-card-value">{stats.totalProductos}</h3>
            <p className="dashboard-card-meta mb-0">
              Total de referencias registradas.
            </p>
          </article>
        </div>

        <div className="col-md-6 col-xl-3">
          <article className="dashboard-stat-card dashboard-success p-4 h-100">
            <div className="dashboard-stat-top">
              <span className="dashboard-card-label">Categorías</span>
              <i className="bi bi-tags dashboard-card-icon"></i>
            </div>
            <h3 className="dashboard-card-value">{stats.totalCategorias}</h3>
            <p className="dashboard-card-meta mb-0">
              Clasificaciones activas en el sistema.
            </p>
          </article>
        </div>

        <div className="col-md-6 col-xl-3">
          <article className="dashboard-stat-card dashboard-warning p-4 h-100">
            <div className="dashboard-stat-top">
              <span className="dashboard-card-label">Stock bajo</span>
              <i className="bi bi-exclamation-triangle dashboard-card-icon"></i>
            </div>
            <h3 className="dashboard-card-value">{stats.productosStockBajo}</h3>
            <p className="dashboard-card-meta mb-0">
              Productos que requieren revisión.
            </p>
          </article>
        </div>

        <div className="col-md-6 col-xl-3">
          <article className="dashboard-stat-card dashboard-danger p-4 h-100">
            <div className="dashboard-stat-top">
              <span className="dashboard-card-label">Usuarios</span>
              <i className="bi bi-people dashboard-card-icon"></i>
            </div>
            <h3 className="dashboard-card-value">{stats.totalUsuarios}</h3>
            <p className="dashboard-card-meta mb-0">
              Usuarios con acceso al sistema.
            </p>
          </article>
        </div>
      </section>

      <section className="row g-4">
        <div className="col-lg-4">
          <div className="dashboard-summary-card p-4 h-100">
            <h4 className="dashboard-section-title mb-3">Estado operativo</h4>

            <div className="dashboard-mini-stat">
              <span>Inventario activo</span>
              <strong>{stats.totalProductos} productos</strong>
            </div>

            <div className="dashboard-mini-stat">
              <span>Alertas actuales</span>
              <strong>{stats.productosStockBajo} con stock bajo</strong>
            </div>

            <div className="dashboard-mini-stat">
              <span>Estructura del catálogo</span>
              <strong>{stats.totalCategorias} categorías</strong>
            </div>

            <div className="dashboard-mini-stat">
              <span>Accesos habilitados</span>
              <strong>{stats.totalUsuarios} usuarios</strong>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="dashboard-summary-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div>
                <h4 className="dashboard-section-title mb-1">
                  Últimos movimientos
                </h4>
                <small className="text-muted">
                  Se muestran los 5 registros más recientes
                </small>
              </div>
            </div>

            {movimientos.length === 0 ? (
              <div className="text-center py-5 text-muted">
                No hay movimientos registrados todavía.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle dashboard-table">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Producto</th>
                      <th>Motivo</th>
                      <th>Cantidad</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos.map((mov, index) => (
                      <tr key={mov.id || index}>
                        <td>
                          <span
                            className={`dashboard-badge ${obtenerClaseBadge(
                              mov.tipoMovimiento || mov.tipo
                            )}`}
                          >
                            {mov.tipoMovimiento || mov.tipo || "-"}
                          </span>
                        </td>
                        <td>{mov.productoNombre || mov.producto || "-"}</td>
                        <td>{mov.motivo || mov.referencia || "-"}</td>
                        <td>{mov.cantidad ?? "-"}</td>
                        <td>{formatearFecha(mov.fecha)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;