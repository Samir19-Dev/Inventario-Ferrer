const API = "http://localhost:8080/api";

/* =========================
   SESSION
========================= */

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("mustChangePassword");
};

const forceLogout = () => {
  clearSession();
  window.location.href = "/";
};

/* =========================
   HEADERS
========================= */

const buildHeaders = (useAuth = true, isJson = true) => {
  const headers = {};

  if (isJson) {
    headers["Content-Type"] = "application/json";
    headers["Accept"] = "application/json";
  }

  if (useAuth) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No hay token disponible");
    }

    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/* =========================
   RESPONSE
========================= */

const handleResponse = async (response, defaultErrorMessage) => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  let data = null;

  try {
    data = isJson ? await response.json() : await response.text();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      forceLogout();
    }

    throw new Error(
      data?.mensaje ||
        data?.message ||
        data?.error ||
        (typeof data === "string" && data) ||
        defaultErrorMessage
    );
  }

  return data;
};

/* =========================
   CORE REQUEST
========================= */

const request = async (
  endpoint,
  {
    method = "GET",
    body = null,
    useAuth = true,
    isJson = true,
  } = {},
  defaultErrorMessage = "Ocurrió un error"
) => {
  const options = {
    method,
    headers: buildHeaders(useAuth, isJson),
  };

  if (body !== null) {
    options.body = isJson ? JSON.stringify(body) : body;
  }

  const response = await fetch(`${API}${endpoint}`, options);
  return handleResponse(response, defaultErrorMessage);
};

/* =========================
   GENERIC METHODS
========================= */

const get = (endpoint, errorMessage, useAuth = true) =>
  request(endpoint, { method: "GET", useAuth, isJson: true }, errorMessage);

const post = (endpoint, body, errorMessage, useAuth = true) =>
  request(endpoint, { method: "POST", body, useAuth, isJson: true }, errorMessage);

const put = (endpoint, body, errorMessage, useAuth = true) =>
  request(endpoint, { method: "PUT", body, useAuth, isJson: true }, errorMessage);

const remove = (endpoint, errorMessage, useAuth = true) =>
  request(endpoint, { method: "DELETE", useAuth, isJson: true }, errorMessage);

/* =========================
   AUTH
========================= */

export const login = (username, password) =>
  post("/auth/login", { username, password }, "Error al iniciar sesión", false);

export const changePassword = (currentPassword, newPassword) =>
  post(
    "/auth/change-password",
    { currentPassword, newPassword },
    "No se pudo cambiar la contraseña"
  );

/* =========================
   DASHBOARD
========================= */

export const getDashboardResumen = () =>
  get("/dashboard/resumen", "No se pudo cargar el resumen del dashboard");

export const getStockBajo = () =>
  get("/dashboard/stock-bajo", "No se pudo cargar el stock bajo");

/* =========================
   CATEGORÍAS
========================= */

export const getCategorias = () =>
  get("/categorias", "No se pudieron cargar las categorías");

export const createCategoria = (categoria) =>
  post("/categorias", categoria, "No se pudo crear la categoría");

export const updateCategoria = (id, categoria) =>
  put(`/categorias/${id}`, categoria, "No se pudo actualizar la categoría");

export const deleteCategoria = (id) =>
  remove(`/categorias/${id}`, "No se pudo eliminar la categoría");

/* =========================
   PRODUCTOS
========================= */

export const getProductos = () =>
  get("/productos", "No se pudieron cargar los productos");

export const createProducto = (producto) =>
  post("/productos", producto, "No se pudo crear el producto");

export const updateProducto = (id, producto) =>
  put(`/productos/${id}`, producto, "No se pudo actualizar el producto");

export const deleteProducto = (id) =>
  remove(`/productos/${id}`, "No se pudo eliminar el producto");

/* =========================
   PROVEEDORES
========================= */

export const getProveedores = () =>
  get("/proveedores", "No se pudieron cargar los proveedores");

export const createProveedor = (proveedor) =>
  post("/proveedores", proveedor, "No se pudo crear el proveedor");

export const updateProveedor = (id, proveedor) =>
  put(`/proveedores/${id}`, proveedor, "No se pudo actualizar el proveedor");

export const deleteProveedor = (id) =>
  remove(`/proveedores/${id}`, "No se pudo eliminar el proveedor");

/* =========================
   CLIENTES
========================= */

export const getClientes = () =>
  get("/clientes", "No se pudieron cargar los clientes");

export const createCliente = (cliente) =>
  post("/clientes", cliente, "No se pudo crear el cliente");

export const updateCliente = (id, cliente) =>
  put(`/clientes/${id}`, cliente, "No se pudo actualizar el cliente");

export const deleteCliente = (id) =>
  remove(`/clientes/${id}`, "No se pudo eliminar el cliente");

/* =========================
   COMPRAS
========================= */

export const getCompras = () =>
  get("/compras", "No se pudieron cargar las compras");

export const createCompra = (compra) =>
  post("/compras", compra, "No se pudo registrar la compra");

/* =========================
   VENTAS
========================= */

export const getVentas = () =>
  get("/ventas", "No se pudieron cargar las ventas");

export const createVenta = (venta) =>
  post("/ventas", venta, "No se pudo registrar la venta");

/* =========================
   MOVIMIENTOS INVENTARIO
========================= */

export const getMovimientosInventario = () =>
  get("/movimientos-inventario", "No se pudieron cargar los movimientos");

export const getMovimientosPorProducto = (productoId) =>
  get(
    `/movimientos-inventario/producto/${productoId}`,
    "No se pudieron cargar los movimientos del producto"
  );