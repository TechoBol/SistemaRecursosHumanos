import { errorToast, successToast } from "./toasts";

/* OBTENER TODOS LOS USUARIOS */
export const getUsersApi = async (token: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/user/get-users`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudieron obtener los usuarios.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    errorToast("Error de conexión al obtener usuarios.");
    return null;
  }
};

/* OBTENER USUARIO POR ID */
export const getUserByIdApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/user/get-user/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudo obtener la información del usuario.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    errorToast("Error de conexión al obtener el usuario.");
    return null;
  }
};

/* CREAR UN NUEVO USUARIO */
export const createUserApi = async (token: string, userData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/user/create-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo crear el usuario.");
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    errorToast("Error de conexión al crear usuario.");
    return null;
  }
};

/* ACTUALIZAR UN USUARIO EXISTENTE */
export const updateUserApi = async (token: string, id: number, userData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/user/update-user/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo actualizar el usuario.");
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    errorToast("Error de conexión al actualizar usuario.");
    return null;
  }
};

/* ELIMINAR/DESACTIVAR UN USUARIO */
export const deleteUserApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/user/delete-user/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo desactivar el usuario.");
      return null;
    }

    successToast("Usuario desactivado correctamente.");
    return data;
  } catch (error) {
    console.error("Error al desactivar usuario:", error);
    errorToast("Error de conexión al desactivar usuario.");
    return null;
  }
};
