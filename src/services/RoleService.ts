import { errorToast } from "./toasts";

/* OBTENER ROLES */
export const getRolesApi = async (token: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/role/get-roles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudieron obtener los roles.");
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener roles:", error);
    errorToast("Error de conexión al obtener roles.");
    return null;
  }
};
