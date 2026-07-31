import { errorToast, successToast } from "./toasts";

/* OBTENER TODAS LAS AREAS */
export const getAreasApi = async (token: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/area/get-areas`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudieron obtener las áreas.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener áreas:", error);
    errorToast("Error de conexión al obtener áreas.");
    return null;
  }
};

/* OBTENER AREA POR ID */
export const getAreaByIdApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/area/get-area/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudo obtener la información del área.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener área por ID:", error);
    errorToast("Error de conexión al obtener el área.");
    return null;
  }
};

/* CREAR UNA NUEVA AREA */
export const createAreaApi = async (token: string, areaData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/area/create-area`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(areaData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo crear el área.");
      return null;
    }

    successToast("Área creada correctamente.");
    return data;
  } catch (error) {
    console.error("Error al crear área:", error);
    errorToast("Error de conexión al crear área.");
    return null;
  }
};

/* ACTUALIZAR UNA AREA EXISTENTE */
export const updateAreaApi = async (token: string, id: number, areaData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/area/update-area/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(areaData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo actualizar el área.");
      return null;
    }

    successToast("Área actualizada correctamente.");
    return data;
  } catch (error) {
    console.error("Error al actualizar área:", error);
    errorToast("Error de conexión al actualizar área.");
    return null;
  }
};

/* ELIMINAR/DESACTIVAR UNA AREA */
export const deleteAreaApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/area/delete-area/${id}`,
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
      errorToast(data.message || "No se pudo desactivar el área.");
      return null;
    }

    successToast("Área desactivada correctamente.");
    return data;
  } catch (error) {
    console.error("Error al desactivar área:", error);
    errorToast("Error de conexión al desactivar área.");
    return null;
  }
};
