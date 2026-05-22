import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../services/api";
import "../styles/cambiarclave.css";

function CambiarClave() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const navigate = useNavigate();
  const cambioObligatorio =
    localStorage.getItem("mustChangePassword") === "true";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!localStorage.getItem("token")) {
      setError("Tu sesión no es válida. Inicia sesión nuevamente.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Debes completar todos los campos.");
      return;
    }

    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("La confirmación no coincide.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMensaje("");

      await changePassword(currentPassword, newPassword);

      localStorage.setItem("mustChangePassword", "false");
      setMensaje("Contraseña actualizada correctamente.");

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1200);
    } catch (err) {
      setError(err.message || "No se pudo cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="container">
        <div className="change-password-box">
          <div className="change-password-header text-center">
            <div className="change-password-icon">
              <i className="bi bi-shield-lock"></i>
            </div>
            <h2>Cambiar contraseña</h2>
            <p>
              {cambioObligatorio
                ? "Debes actualizar tu contraseña antes de continuar en el sistema."
                : "Actualiza tu contraseña para mantener tu cuenta segura."}
            </p>
          </div>

          {mensaje && (
            <div className="alert alert-success" role="alert">
              {mensaje}
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Contraseña actual</label>
              <div className="input-group">
                <input
                  type={showActual ? "text" : "password"}
                  className="form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Ingresa tu contraseña actual"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowActual((prev) => !prev)}
                  disabled={loading}
                >
                  {showActual ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Nueva contraseña</label>
              <div className="input-group">
                <input
                  type={showNueva ? "text" : "password"}
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Ingresa la nueva contraseña"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowNueva((prev) => !prev)}
                  disabled={loading}
                >
                  {showNueva ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Confirmar nueva contraseña</label>
              <div className="input-group">
                <input
                  type={showConfirmar ? "text" : "password"}
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Repite la nueva contraseña"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmar((prev) => !prev)}
                  disabled={loading}
                >
                  {showConfirmar ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Actualizar contraseña"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CambiarClave;