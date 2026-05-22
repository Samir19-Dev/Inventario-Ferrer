import { useEffect, useState } from "react";

function FormularioProducto({
  onSubmit,
  productoEditando,
  onCancel,
  categorias,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    codigoBarras: "",
    precioCompra: "",
    precioVenta: "",
    stock: "",
    stockMinimo: "",
    categoriaId: "",
  });

  useEffect(() => {
    if (productoEditando) {
      setFormData({
        nombre: productoEditando.nombre || "",
        descripcion: productoEditando.descripcion || "",
        codigoBarras: productoEditando.codigoBarras || "",
        precioCompra: productoEditando.precioCompra ?? "",
        precioVenta: productoEditando.precioVenta ?? "",
        stock: productoEditando.stock ?? "",
        stockMinimo: productoEditando.stockMinimo ?? "",
        categoriaId: productoEditando.categoriaId ?? "",
      });
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        codigoBarras: "",
        precioCompra: "",
        precioVenta: "",
        stock: "",
        stockMinimo: "",
        categoriaId: "",
      });
    }
  }, [productoEditando]);

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
      codigoBarras: "",
      precioCompra: "",
      precioVenta: "",
      stock: "",
      stockMinimo: "",
      categoriaId: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    if (!formData.categoriaId) {
      alert("Debe seleccionar una categoría");
      return;
    }

    if (formData.precioCompra === "" || formData.precioVenta === "") {
      alert("Debe ingresar los precios");
      return;
    }

    if (formData.stock === "" || formData.stockMinimo === "") {
      alert("Debe ingresar el stock y el stock mínimo");
      return;
    }

    if (Number(formData.precioCompra) < 0 || Number(formData.precioVenta) < 0) {
      alert("Los precios no pueden ser negativos");
      return;
    }

    if (Number(formData.stock) < 0 || Number(formData.stockMinimo) < 0) {
      alert("El stock no puede ser negativo");
      return;
    }

    await onSubmit({
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      codigoBarras: formData.codigoBarras.trim(),
      precioCompra: Number(formData.precioCompra),
      precioVenta: Number(formData.precioVenta),
      stock: Number(formData.stock),
      stockMinimo: Number(formData.stockMinimo),
      categoriaId: Number(formData.categoriaId),
    });

    if (!productoEditando) {
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
        <div className="col-md-4">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre del producto"
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Categoría</label>
          <select
            name="categoriaId"
            className="form-select"
            value={formData.categoriaId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Código de barras</label>
          <input
            type="text"
            name="codigoBarras"
            className="form-control"
            value={formData.codigoBarras}
            onChange={handleChange}
            placeholder="Opcional"
          />
        </div>

        <div className="col-md-12">
          <label className="form-label">Descripción</label>
          <input
            type="text"
            name="descripcion"
            className="form-control"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción del producto"
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Precio compra</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="precioCompra"
            className="form-control"
            value={formData.precioCompra}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Precio venta</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="precioVenta"
            className="form-control"
            value={formData.precioVenta}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Stock</label>
          <input
            type="number"
            min="0"
            name="stock"
            className="form-control"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Stock mínimo</label>
          <input
            type="number"
            min="0"
            name="stockMinimo"
            className="form-control"
            value={formData.stockMinimo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {productoEditando ? "Actualizar" : "Guardar"}
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

export default FormularioProducto;