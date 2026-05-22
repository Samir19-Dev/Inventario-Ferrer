import { useEffect, useMemo, useState } from "react";
import {
  getCompras,
  createCompra,
  getProveedores,
  getProductos,
} from "../services/api";

function Compras() {
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [proveedorId, setProveedorId] = useState("");
  const [detalles, setDetalles] = useState([
    { productoId: "", cantidad: 1, costoUnitario: 0 },
  ]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

      const [comprasData, proveedoresData, productosData] = await Promise.all([
        getCompras(),
        getProveedores(),
        getProductos(),
      ]);

      setCompras(Array.isArray(comprasData) ? comprasData : []);
      setProveedores(Array.isArray(proveedoresData) ? proveedoresData : []);
      setProductos(Array.isArray(productosData) ? productosData : []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los datos de compras");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Compras | Inventario Ferrer";
    cargarDatos();
  }, []);

  const agregarDetalle = () => {
    setDetalles((prev) => [
      ...prev,
      { productoId: "", cantidad: 1, costoUnitario: 0 },
    ]);
  };

  const eliminarDetalle = (index) => {
    if (detalles.length === 1) {
      alert("Debe existir al menos un producto en la compra");
      return;
    }

    setDetalles((prev) => prev.filter((_, i) => i !== index));
  };

  const actualizarDetalle = (index, field, value) => {
    setDetalles((prev) =>
      prev.map((detalle, i) => {
        if (i !== index) return detalle;

        const actualizado = { ...detalle, [field]: value };

        if (field === "productoId") {
          const producto = productos.find(
            (p) => String(p.id) === String(value)
          );

          if (producto) {
            actualizado.costoUnitario = Number(producto.precioCompra) || 0;
          }
        }

        return actualizado;
      })
    );
  };

  const totalCompra = useMemo(() => {
    return detalles.reduce((acc, detalle) => {
      const cantidad = Number(detalle.cantidad) || 0;
      const costo = Number(detalle.costoUnitario) || 0;
      return acc + cantidad * costo;
    }, 0);
  }, [detalles]);

  const limpiarFormulario = () => {
    setProveedorId("");
    setDetalles([{ productoId: "", cantidad: 1, costoUnitario: 0 }]);
  };

  const construirPayload = () => ({
    proveedorId: Number(proveedorId),
    detalles: detalles.map((detalle) => ({
      productoId: Number(detalle.productoId),
      cantidad: Number(detalle.cantidad),
      costoUnitario: Number(detalle.costoUnitario),
    })),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!proveedorId) {
      alert("Debes seleccionar un proveedor");
      return;
    }

    if (proveedores.length === 0) {
      alert("No hay proveedores registrados");
      return;
    }

    if (productos.length === 0) {
      alert("No hay productos registrados");
      return;
    }

    if (detalles.length === 0) {
      alert("Debes agregar al menos un producto");
      return;
    }

    if (detalles.some((detalle) => !detalle.productoId)) {
      alert("Todos los detalles deben tener un producto");
      return;
    }

    const productosSeleccionados = detalles.map((d) => String(d.productoId));
    const hayDuplicados =
      new Set(productosSeleccionados).size !== productosSeleccionados.length;

    if (hayDuplicados) {
      alert("No puedes repetir el mismo producto en una compra");
      return;
    }

    if (
      detalles.some(
        (detalle) =>
          Number(detalle.cantidad) <= 0 || isNaN(Number(detalle.cantidad))
      )
    ) {
      alert("Todas las cantidades deben ser mayores que cero");
      return;
    }

    if (
      detalles.some(
        (detalle) =>
          Number(detalle.costoUnitario) <= 0 ||
          isNaN(Number(detalle.costoUnitario))
      )
    ) {
      alert("Todos los costos deben ser mayores que cero");
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await createCompra(construirPayload());
      limpiarFormulario();
      await cargarDatos();
      setMensaje("Compra registrada correctamente.");
    } catch (err) {
      setError(err.message || "No se pudo registrar la compra");
    } finally {
      setGuardando(false);
    }
  };

  const formatearMoneda = (valor) => {
    const numero = Number(valor) || 0;
    return numero.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
    });
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";

    const date = new Date(fecha);
    if (isNaN(date.getTime())) return fecha;

    return date.toLocaleString("es-CO");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Compras</h2>
          <p className="text-muted mb-0">
            Registro de compras e ingreso de productos al inventario.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="alert alert-success" role="alert">
          {mensaje}
        </div>
      )}

      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">Registrar compra</h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Proveedor *</label>
                <select
                  className="form-select"
                  value={proveedorId}
                  onChange={(e) => setProveedorId(e.target.value)}
                  required
                >
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h6 className="mb-3">Detalle de productos</h6>

            <div className="d-flex flex-column gap-3">
              {detalles.map((detalle, index) => (
                <div key={index} className="border rounded p-3 bg-light">
                  <div className="row g-3 align-items-end">
                    <div className="col-md-4">
                      <label className="form-label">Producto</label>
                      <select
                        className="form-select"
                        value={detalle.productoId}
                        onChange={(e) =>
                          actualizarDetalle(index, "productoId", e.target.value)
                        }
                      >
                        <option value="">Seleccione un producto</option>
                        {productos.map((producto) => (
                          <option key={producto.id} value={producto.id}>
                            {producto.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-2">
                      <label className="form-label">Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={detalle.cantidad}
                        onChange={(e) =>
                          actualizarDetalle(index, "cantidad", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Costo unitario</label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        className="form-control"
                        value={detalle.costoUnitario}
                        onChange={(e) =>
                          actualizarDetalle(
                            index,
                            "costoUnitario",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="col-md-2">
                      <label className="form-label">Subtotal</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formatearMoneda(
                          Number(detalle.cantidad || 0) *
                            Number(detalle.costoUnitario || 0)
                        )}
                        readOnly
                      />
                    </div>

                    <div className="col-md-1 d-grid">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => eliminarDetalle(index)}
                        title="Eliminar producto"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex gap-2 mt-3">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={agregarDetalle}
              >
                Agregar producto
              </button>
            </div>

            <div className="mt-4">
              <h5 className="fw-bold">Total: {formatearMoneda(totalCompra)}</h5>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={guardando}
              >
                {guardando ? "Registrando..." : "Registrar compra"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={limpiarFormulario}
                disabled={guardando}
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Listado de compras</h5>
        </div>

        <div className="card-body">
          {loading ? (
            <p className="mb-0">Cargando compras...</p>
          ) : compras.length === 0 ? (
            <p className="mb-0">No hay compras registradas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Proveedor</th>
                    <th>Total</th>
                    <th>Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {compras.map((compra) => (
                    <tr key={compra.id}>
                      <td>{compra.id}</td>
                      <td>{formatearFecha(compra.fecha)}</td>
                      <td>{compra.proveedorNombre || "-"}</td>
                      <td>{formatearMoneda(compra.total)}</td>
                      <td>
                        {Array.isArray(compra.detalles) &&
                        compra.detalles.length > 0 ? (
                          <ul className="mb-0 ps-3">
                            {compra.detalles.map((detalle) => (
                              <li key={detalle.id}>
                                {detalle.productoNombre} | Cant: {detalle.cantidad} |
                                Costo: {formatearMoneda(detalle.costoUnitario)} |
                                Subtotal: {formatearMoneda(detalle.subtotal)}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Compras;