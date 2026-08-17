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
      setRole(response.role.name);
      setUserId(response.id);
      changeLogInState();

      successToast("¡Bienvenido!");

      // REDIRECCIÓN
      navigate("/usuarios");

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
    navigate("/");
  };

  return {
    signIn,
    logOut,
    isLoading,
  };
};

export default useAuthentication;