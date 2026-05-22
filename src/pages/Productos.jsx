import { useEffect, useState } from "react";
import FormularioProducto from "../components/FormularioProducto";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  getCategorias,
} from "../services/api";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    document.title = "Productos | Inventario Ferrer";
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

      const [productosData, categoriasData] = await Promise.all([
        getProductos(),
        getCategorias(),
      ]);

      setProductos(Array.isArray(productosData) ? productosData : []);
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
    } catch (err) {
      setError(err.message || "No se pudo cargar el módulo de productos.");
    } finally {
      setLoading(false);
    }
  };

  const abrirNuevoFormulario = () => {
    setProductoEditando(null);
    setMensaje("");
    setMostrarFormulario(true);
  };

  const abrirEdicion = (producto) => {
    setProductoEditando({
      ...producto,
      categoriaId: producto?.categoriaId ?? producto?.categoria?.id ?? "",
    });
    setMensaje("");
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setProductoEditando(null);
    setMostrarFormulario(false);
  };

  const manejarSubmit = async (productoData) => {
    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      if (productoEditando?.id) {
        await updateProducto(productoEditando.id, productoData);
        setMensaje("Producto actualizado correctamente.");
      } else {
        await createProducto(productoData);
        setMensaje("Producto creado correctamente.");
      }

      cerrarFormulario();
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo guardar el producto.");
    } finally {
      setGuardando(false);
    }
  };

  const manejarEliminar = async (id, nombre) => {
    const confirmado = window.confirm(`¿Deseas eliminar el producto "${nombre}"?`);
    if (!confirmado) return;

    try {
      setError("");
      setMensaje("");
      await deleteProducto(id);
      setMensaje("Producto eliminado correctamente.");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el producto.");
    }
  };

  const obtenerNombreCategoria = (producto) => {
    return producto?.categoriaNombre || producto?.categoria?.nombre || "Sin categoría";
  };

  const formatearMoneda = (valor) => {
    const numero = Number(valor ?? 0);
    return numero.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h2 className="fw-bold mb-3">Productos</h2>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Productos</h2>
          <p className="text-muted mb-0">
            Gestión de productos de Ferretería Ferrer.
          </p>
        </div>

        <button className="btn btn-primary" onClick={abrirNuevoFormulario}>
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo producto
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      {mostrarFormulario && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="mb-3">
              {productoEditando ? "Editar producto" : "Registrar producto"}
            </h5>

            <FormularioProducto
              onSubmit={manejarSubmit}
              productoEditando={productoEditando}
              onCancel={cerrarFormulario}
              categorias={categorias}
            />

            {guardando && (
              <p className="text-muted mt-3 mb-0">Guardando información...</p>
            )}
          </div>
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Código</th>
                  <th>Compra</th>
                  <th>Venta</th>
                  <th>Stock</th>
                  <th>Stock mínimo</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.length > 0 ? (
                  productos.map((producto) => (
                    <tr key={producto.id}>
                      <td>
                        <div className="fw-semibold">{producto.nombre}</div>
                        <small className="text-muted">
                          {producto.descripcion || "Sin descripción"}
                        </small>
                      </td>
                      <td>{obtenerNombreCategoria(producto)}</td>
                      <td>{producto.codigoBarras || "-"}</td>
                      <td>{formatearMoneda(producto.precioCompra)}</td>
                      <td>{formatearMoneda(producto.precioVenta)}</td>
                      <td>{producto.stock ?? 0}</td>
                      <td>{producto.stockMinimo ?? 0}</td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => abrirEdicion(producto)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => manejarEliminar(producto.id, producto.nombre)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      No hay productos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Productos;