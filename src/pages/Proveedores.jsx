import { useEffect, useState } from "react";
import {
  getProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from "../services/api";

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorEditando, setProveedorEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    direccion: "",
  });

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProveedores();
      setProveedores(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los proveedores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Proveedores | Inventario Ferrer";
    cargarProveedores();
  }, []);

  useEffect(() => {
    if (proveedorEditando) {
      setFormData({
        nombre: proveedorEditando.nombre || "",
        telefono: proveedorEditando.telefono || "",
        email: proveedorEditando.email || "",
        direccion: proveedorEditando.direccion || "",
      });
    } else {
      limpiarFormulario();
    }
  }, [proveedorEditando]);

  const limpiarFormulario = () => {
    setFormData({
      nombre: "",
      telefono: "",
      email: "",
      direccion: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      const payload = {
        nombre: formData.nombre.trim(),
        telefono: formData.telefono.trim(),
        email: formData.email.trim(),
        direccion: formData.direccion.trim(),
      };

      if (proveedorEditando) {
        await updateProveedor(proveedorEditando.id, payload);
        setMensaje("Proveedor actualizado correctamente.");
      } else {
        await createProveedor(payload);
        setMensaje("Proveedor registrado correctamente.");
      }

      await cargarProveedores();
      setProveedorEditando(null);
      limpiarFormulario();
    } catch (err) {
      setError(err.message || "No se pudo guardar el proveedor");
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (proveedor) => {
    setProveedorEditando(proveedor);
    setError("");
    setMensaje("");
  };

  const handleCancelar = () => {
    setProveedorEditando(null);
    limpiarFormulario();
    setError("");
    setMensaje("");
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este proveedor?"
    );

    if (!confirmar) return;

    try {
      setError("");
      setMensaje("");
      await deleteProveedor(id);
      await cargarProveedores();
      setMensaje("Proveedor eliminado correctamente.");

      if (proveedorEditando?.id === id) {
        handleCancelar();
      }
    } catch (err) {
      setError(err.message || "No se pudo eliminar el proveedor");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Proveedores</h2>
          <p className="text-muted mb-0">
            Gestión de proveedores de Ferretería Ferrer.
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
          <h5 className="mb-0">
            {proveedorEditando ? "Editar proveedor" : "Registrar proveedor"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={formData.nombre}
                  onChange={handleChange}
                  maxLength={150}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  className="form-control"
                  value={formData.telefono}
                  onChange={handleChange}
                  maxLength={30}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={120}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  className="form-control"
                  value={formData.direccion}
                  onChange={handleChange}
                  maxLength={200}
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={guardando}
              >
                {guardando
                  ? "Guardando..."
                  : proveedorEditando
                  ? "Actualizar"
                  : "Registrar"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelar}
                disabled={guardando}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Listado de proveedores</h5>
        </div>

        <div className="card-body">
          {loading ? (
            <p className="mb-0">Cargando proveedores...</p>
          ) : proveedores.length === 0 ? (
            <p className="mb-0">No hay proveedores registrados.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Dirección</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {proveedores.map((proveedor) => (
                    <tr key={proveedor.id}>
                      <td>{proveedor.id}</td>
                      <td>{proveedor.nombre}</td>
                      <td>{proveedor.telefono || "-"}</td>
                      <td>{proveedor.email || "-"}</td>
                      <td>{proveedor.direccion || "-"}</td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditar(proveedor)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleEliminar(proveedor.id)}
                          >
                            Eliminar
                          </button>
                        </div>
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

export default Proveedores;