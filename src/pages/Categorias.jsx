import { useEffect, useState } from "react";
import FormularioCategoria from "../components/FormularioCategoria";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../services/api";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    document.title = "Categorías | Inventario Ferrer";
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCategorias();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "No se pudo cargar el módulo de categorías.");
    } finally {
      setLoading(false);
    }
  };

  const abrirNuevoFormulario = () => {
    setCategoriaEditando(null);
    setMensaje("");
    setMostrarFormulario(true);
  };

  const abrirEdicion = (categoria) => {
    setCategoriaEditando(categoria);
    setMensaje("");
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setCategoriaEditando(null);
    setMostrarFormulario(false);
  };

  const manejarSubmit = async (categoriaData) => {
    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      if (categoriaEditando?.id) {
        await updateCategoria(categoriaEditando.id, categoriaData);
        setMensaje("Categoría actualizada correctamente.");
      } else {
        await createCategoria(categoriaData);
        setMensaje("Categoría creada correctamente.");
      }

      cerrarFormulario();
      await cargarCategorias();
    } catch (err) {
      setError(err.message || "No se pudo guardar la categoría.");
    } finally {
      setGuardando(false);
    }
  };

  const manejarEliminar = async (id, nombre) => {
    const confirmado = window.confirm(`¿Deseas eliminar la categoría "${nombre}"?`);
    if (!confirmado) return;

    try {
      setError("");
      setMensaje("");
      await deleteCategoria(id);
      setMensaje("Categoría eliminada correctamente.");
      await cargarCategorias();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la categoría.");
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h2 className="fw-bold mb-3">Categorías</h2>
        <p>Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Categorías</h2>
          <p className="text-muted mb-0">
            Gestión de categorías de Ferretería Ferrer.
          </p>
        </div>

        <button className="btn btn-primary" onClick={abrirNuevoFormulario}>
          <i className="bi bi-plus-circle me-2"></i>
          Nueva categoría
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      {mostrarFormulario && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="mb-3">
              {categoriaEditando ? "Editar categoría" : "Registrar categoría"}
            </h5>

            <FormularioCategoria
              onSubmit={manejarSubmit}
              categoriaEditando={categoriaEditando}
              onCancel={cerrarFormulario}
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
                  <th>Descripción</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.length > 0 ? (
                  categorias.map((categoria) => (
                    <tr key={categoria.id}>
                      <td className="fw-semibold">{categoria.nombre}</td>
                      <td>{categoria.descripcion || "Sin descripción"}</td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => abrirEdicion(categoria)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => manejarEliminar(categoria.id, categoria.nombre)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-4">
                      No hay categorías registradas.
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

export default Categorias;