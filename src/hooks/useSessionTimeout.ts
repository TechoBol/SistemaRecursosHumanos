import { useEffect } from "react";
import useAuthentication from "./useAuthentication";
import { useLoginStore } from "../components/store/loginStore";

const INACTIVITY_TIME = 30 * 60 * 1000; // 30 minutos
const CHECK_INTERVAL = 10000; // Validar cada 10 segundos

export const useSessionTimeout = () => {
  const { logOut } = useAuthentication();
  const { isLoggedIn } = useLoginStore();

  useEffect(() => {
    if (!isLoggedIn) return;

    // Inicializa la marca de tiempo de actividad si no existe
    const currentActivity = localStorage.getItem("lastActivity");
    if (!currentActivity) {
      localStorage.setItem("lastActivity", String(Date.now()));
    }

    let lastSaved = 0;
    const updateActivity = () => {
      const now = Date.now();
      if (now - lastSaved > 5000) {
        localStorage.setItem("lastActivity", String(now));
        lastSaved = now;
      }
    };

    // listeners para detectar actividad
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);
    window.addEventListener("scroll", updateActivity);
    window.addEventListener("touchstart", updateActivity);

    // intervalo para validar la inactividad periódicamente
    const interval = setInterval(() => {
      const lastActivityTime = Number(localStorage.getItem("lastActivity"));
      if (lastActivityTime && Date.now() - lastActivityTime > INACTIVITY_TIME) {
        localStorage.removeItem("lastActivity");
        logOut();
      }
    }, CHECK_INTERVAL);

    // Limpieza de listeners e intervalo al desmontar
    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("scroll", updateActivity);
      window.removeEventListener("touchstart", updateActivity);
      clearInterval(interval);
    };
  }, [isLoggedIn, logOut]);
};
