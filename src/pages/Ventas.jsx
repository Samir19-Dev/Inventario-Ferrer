import { useEffect, useMemo, useState } from "react";
import {
  getVentas,
  createVenta,
  getClientes,
  getProductos,
} from "../services/api";

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [clienteId, setClienteId] = useState("");
  const [detalles, setDetalles] = useState([
    { productoId: "", cantidad: 1, precioUnitario: 0 },
  ]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

      const [ventasData, clientesData, productosData] = await Promise.all([
        getVentas(),
        getClientes(),
        getProductos(),
      ]);

      setVentas(Array.isArray(ventasData) ? ventasData : []);
      setClientes(Array.isArray(clientesData) ? clientesData : []);
      setProductos(Array.isArray(productosData) ? productosData : []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los datos de ventas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Ventas | Inventario Ferrer";
    cargarDatos();
  }, []);

  const agregarDetalle = () => {
    setDetalles((prev) => [
      ...prev,
      { productoId: "", cantidad: 1, precioUnitario: 0 },
    ]);
  };

  const eliminarDetalle = (index) => {
    if (detalles.length === 1) {
      alert("Debe existir al menos un producto en la venta");
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
            actualizado.precioUnitario = Number(producto.precioVenta) || 0;
          }
        }

        return actualizado;
      })
    );
  };

  const totalVenta = useMemo(() => {
    return detalles.reduce((acc, detalle) => {
      const cantidad = Number(detalle.cantidad) || 0;
      const precio = Number(detalle.precioUnitario) || 0;
      return acc + cantidad * precio;
    }, 0);
  }, [detalles]);

  const limpiarFormulario = () => {
    setClienteId("");
    setDetalles([{ productoId: "", cantidad: 1, precioUnitario: 0 }]);
  };

  const construirPayload = () => ({
    clienteId: clienteId ? Number(clienteId) : null,
    detalles: detalles.map((detalle) => ({
      productoId: Number(detalle.productoId),
      cantidad: Number(detalle.cantidad),
      precioUnitario: Number(detalle.precioUnitario),
    })),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      alert("No puedes repetir el mismo producto en una venta");
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
          Number(detalle.precioUnitario) <= 0 ||
          isNaN(Number(detalle.precioUnitario))
      )
    ) {
      alert("Todos los precios deben ser mayores que cero");
      return;
    }

    const sinStock = detalles.find((detalle) => {
      const producto = productos.find(
        (p) => String(p.id) === String(detalle.productoId)
      );
      if (!producto) return false;

      return Number(detalle.cantidad) > Number(producto.stock || 0);
    });

    if (sinStock) {
      const producto = productos.find(
        (p) => String(p.id) === String(sinStock.productoId)
      );
      alert(
        `Stock insuficiente para ${producto?.nombre || "el producto seleccionado"}`
      );
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await createVenta(construirPayload());
      limpiarFormulario();
      await cargarDatos();
      setMensaje("Venta registrada correctamente.");
    } catch (err) {
      setError(err.message || "No se pudo registrar la venta");
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

  const obtenerStockProducto = (productoId) => {
    const producto = productos.find((p) => String(p.id) === String(productoId));
    return Number(producto?.stock || 0);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Ventas</h2>
          <p className="text-muted mb-0">
            Registro de ventas y salida de productos del inventario.
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
          <h5 className="mb-0">Registrar venta</h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Cliente</label>
                <select
                  className="form-select"
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                >
                  <option value="">Consumidor final / sin cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
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
                          <option
                            key={producto.id}
                            value={producto.id}
                            disabled={Number(producto.stock) <= 0}
                          >
                            {producto.nombre} (Stock: {producto.stock})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-2">
                      <label className="form-label">Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        max={
                          detalle.productoId
                            ? obtenerStockProducto(detalle.productoId)
                            : undefined
                        }
                        className="form-control"
                        value={detalle.cantidad}
                        onChange={(e) =>
                          actualizarDetalle(index, "cantidad", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Precio unitario</label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        className="form-control"
                        value={detalle.precioUnitario}
                        onChange={(e) =>
                          actualizarDetalle(
                            index,
                            "precioUnitario",
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
                            Number(detalle.precioUnitario || 0)
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

                  {detalle.productoId && (
                    <small className="text-muted d-block mt-2">
                      Stock disponible: {obtenerStockProducto(detalle.productoId)}
                    </small>
                  )}
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
              <h5 className="fw-bold">Total: {formatearMoneda(totalVenta)}</h5>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={guardando}
              >
                {guardando ? "Registrando..." : "Registrar venta"}
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
          <h5 className="mb-0">Listado de ventas</h5>
        </div>

        <div className="card-body">
          {loading ? (
            <p className="mb-0">Cargando ventas...</p>
          ) : ventas.length === 0 ? (
            <p className="mb-0">No hay ventas registradas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((venta) => (
                    <tr key={venta.id}>
                      <td>{venta.id}</td>
                      <td>{formatearFecha(venta.fecha)}</td>
                      <td>{venta.clienteNombre || "Consumidor final"}</td>
                      <td>{formatearMoneda(venta.total)}</td>
                      <td>
                        {Array.isArray(venta.detalles) &&
                        venta.detalles.length > 0 ? (
                          <ul className="mb-0 ps-3">
                            {venta.detalles.map((detalle) => (
                              <li key={detalle.id}>
                                {detalle.productoNombre} | Cant: {detalle.cantidad} |
                                P.Unit: {formatearMoneda(detalle.precioUnitario)} |
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

export default Ventas;