import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { successToast, errorToast } from "../services/toasts";
import { useLoginStore } from "../components/store/loginStore";
import { logInAuth } from "../services/AuthenticationService";
import { socket } from "../services/SocketIOConnection";

const useAuthentication = () => {
  const navigate = useNavigate();

  const {
    setFullName,
    setRole,
    changeLogInState,
    setToken,
    setUserId,
    resetLoginStore,
  } = useLoginStore();

  const [isLoading, setIsLoading] = useState(false);

  /* LOGIN */
  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      errorToast("Ingresa tu correo y contraseña.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await logInAuth(email, password);

      if (!response) {
        return;
      }

      setFullName(response.name);
      setToken(response.token);
      setRole(response.role);
      setUserId(response.id);
      changeLogInState();

      successToast("¡Bienvenido!");

      // REDIRECCIÓN según rol
      if (response.role === "VENTAS") {
        navigate("/products");
      } else {
        navigate("/dashboard");
      }

      socket.emit("joinUserRoom", response.id);
    } catch (error) {
      console.error("Error en login:", error);
      errorToast("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  /* LOGOUT */
  const logOut = () => {
    resetLoginStore();
    successToast("Sesión cerrada");
    navigate("/login");
  };

  const redirect = () => {
    window.location.href = import.meta.env.VITE_FRONTED_DOMAIN_TESORERIA;
  };

  return {
    signIn,
    logOut,
    redirect,
    isLoading,
  };
};

export default useAuthentication;