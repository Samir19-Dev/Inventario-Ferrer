import { useEffect, useState } from "react";

function FormularioCategoria({ onSubmit, categoriaEditando, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    if (categoriaEditando) {
      setFormData({
        nombre: categoriaEditando.nombre || "",
        descripcion: categoriaEditando.descripcion || "",
      });
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
      });
    }
  }, [categoriaEditando]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const limpiarFormulario = () => {
    setFormData({
      nombre: "",
      descripcion: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    await onSubmit({
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
    });

    if (!categoriaEditando) {
      limpiarFormulario();
    }
  };

  const handleCancel = () => {
    limpiarFormulario();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-5">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Herramientas"
            maxLength={100}
            required
          />
        </div>

        <div className="col-md-7">
          <label className="form-label">Descripción</label>
          <input
            type="text"
            name="descripcion"
            className="form-control"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción de la categoría"
            maxLength={255}
          />
        </div>

        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {categoriaEditando ? "Actualizar" : "Guardar"}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}

export default FormularioCategoria;