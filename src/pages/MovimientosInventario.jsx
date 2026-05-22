import { useEffect, useMemo, useState } from "react";
import {
  getMovimientosInventario,
  getMovimientosPorProducto,
  getProductos,
} from "../services/api";

function MovimientosInventario() {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productoFiltro, setProductoFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarInicial = async () => {
    try {
      setLoading(true);
      setError("");

      const [movimientosData, productosData] = await Promise.all([
        getMovimientosInventario(),
        getProductos(),
      ]);

      setMovimientos(Array.isArray(movimientosData) ? movimientosData : []);
      setProductos(Array.isArray(productosData) ? productosData : []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los movimientos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Movimientos de Inventario | Inventario Ferrer";
    cargarInicial();
  }, []);

  const handleFiltrar = async () => {
    try {
      setLoading(true);
      setError("");

      if (!productoFiltro) {
        const data = await getMovimientosInventario();
        setMovimientos(Array.isArray(data) ? data : []);
      } else {
        const data = await getMovimientosPorProducto(Number(productoFiltro));
        setMovimientos(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError(err.message || "No se pudieron filtrar los movimientos");
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltro = async () => {
    setProductoFiltro("");
    await cargarInicial();
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";

    const date = new Date(fecha);
    if (isNaN(date.getTime())) return fecha;

    return date.toLocaleString("es-CO");
  };

  const obtenerTipoMovimiento = (movimiento) => {
    return String(movimiento.tipoMovimiento || movimiento.tipo || "").toUpperCase();
  };

  const badgeTipo = (tipo) => {
    const valor = String(tipo || "").toUpperCase();

    if (valor.includes("ENTRADA") || valor.includes("COMPRA")) {
      return "success";
    }

    if (valor.includes("SALIDA") || valor.includes("VENTA")) {
      return "danger";
    }

    if (valor.includes("AJUSTE")) {
      return "warning";
    }

    return "secondary";
  };

  const resumen = useMemo(() => {
    return movimientos.reduce(
      (acc, mov) => {
        const tipo = obtenerTipoMovimiento(mov);
        const cantidad = Number(mov.cantidad) || 0;

        acc.totalMovimientos += 1;

        if (tipo.includes("ENTRADA") || tipo.includes("COMPRA")) {
          acc.totalEntradas += cantidad;
        } else if (tipo.includes("SALIDA") || tipo.includes("VENTA")) {
          acc.totalSalidas += cantidad;
        } else {
          acc.totalOtros += cantidad;
        }

        return acc;
      },
      {
        totalMovimientos: 0,
        totalEntradas: 0,
        totalSalidas: 0,
        totalOtros: 0,
      }
    );
  }, [movimientos]);

  const movimientosOrdenados = useMemo(() => {
    return [...movimientos].sort((a, b) => {
      const fechaA = new Date(a.fecha).getTime() || 0;
      const fechaB = new Date(b.fecha).getTime() || 0;
      return fechaB - fechaA;
    });
  }, [movimientos]);

  const productoSeleccionado = useMemo(() => {
    return productos.find((p) => String(p.id) === String(productoFiltro)) || null;
  }, [productos, productoFiltro]);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Movimientos de Inventario</h2>
          <p className="text-muted mb-0">
            Historial de entradas, salidas y ajustes del inventario.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {productoSeleccionado && (
        <div className="alert alert-info" role="alert">
          Filtro activo: <strong>{productoSeleccionado.nombre}</strong>
          {" | "}Stock actual: {productoSeleccionado.stock ?? 0}
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Movimientos</h6>
              <h4 className="mb-0">{resumen.totalMovimientos}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Entradas</h6>
              <h4 className="mb-0 text-success">{resumen.totalEntradas}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Salidas</h6>
              <h4 className="mb-0 text-danger">{resumen.totalSalidas}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Otros</h6>
              <h4 className="mb-0 text-warning">{resumen.totalOtros}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">Filtrar movimientos</h5>
        </div>

        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-6">
              <label className="form-label">Producto</label>
              <select
                className="form-select"
                value={productoFiltro}
                onChange={(e) => setProductoFiltro(e.target.value)}
              >
                <option value="">Todos los productos</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 d-flex gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleFiltrar}
                disabled={loading}
              >
                Filtrar
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={limpiarFiltro}
                disabled={loading}
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Listado de movimientos</h5>
        </div>

        <div className="card-body">
          {loading ? (
            <p className="mb-0">Cargando movimientos...</p>
          ) : movimientosOrdenados.length === 0 ? (
            <p className="mb-0">
              {productoFiltro
                ? "No hay movimientos registrados para el producto seleccionado."
                : "No hay movimientos registrados."}
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Referencia</th>
                    <th>Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientosOrdenados.map((movimiento) => {
                    const tipo = movimiento.tipoMovimiento || movimiento.tipo || "-";

                    return (
                      <tr key={movimiento.id}>
                        <td>{movimiento.id}</td>
                        <td>{formatearFecha(movimiento.fecha)}</td>
                        <td>{movimiento.productoNombre || "-"}</td>
                        <td>
                          <span className={`badge bg-${badgeTipo(tipo)}`}>
                            {tipo}
                          </span>
                        </td>
                        <td>{movimiento.cantidad ?? "-"}</td>
                        <td>{movimiento.referencia || "-"}</td>
                        <td>{movimiento.observacion || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovimientosInventario;