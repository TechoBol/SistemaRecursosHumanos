import { errorToast, successToast } from "./toasts";

/* OBTENER TODAS LAS CIUDADES */
export const getCitiesApi = async (token: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/city/get-cities`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudieron obtener las ciudades.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener ciudades:", error);
    errorToast("Error de conexión al obtener ciudades.");
    return null;
  }
};

/* OBTENER CIUDAD POR ID */
export const getCityByIdApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/city/get-city/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudo obtener la información de la ciudad.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener ciudad por ID:", error);
    errorToast("Error de conexión al obtener la ciudad.");
    return null;
  }
};

/* CREAR UNA NUEVA CIUDAD */
export const createCityApi = async (token: string, cityData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/city/create-city`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(cityData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo crear la ciudad.");
      return null;
    }

    successToast("Ciudad creada correctamente.");
    return data;
  } catch (error) {
    console.error("Error al crear ciudad:", error);
    errorToast("Error de conexión al crear ciudad.");
    return null;
  }
};

/* ACTUALIZAR UNA CIUDAD EXISTENTE */
export const updateCityApi = async (token: string, id: number, cityData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/city/update-city/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(cityData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo actualizar la ciudad.");
      return null;
    }

    successToast("Ciudad actualizada correctamente.");
    return data;
  } catch (error) {
    console.error("Error al actualizar ciudad:", error);
    errorToast("Error de conexión al actualizar ciudad.");
    return null;
  }
};

/* ELIMINAR/DESACTIVAR UNA CIUDAD */
export const deleteCityApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/city/delete-city/${id}`,
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
      errorToast(data.message || "No se pudo desactivar la ciudad.");
      return null;
    }

    successToast("Ciudad desactivada correctamente.");
    return data;
  } catch (error) {
    console.error("Error al desactivar ciudad:", error);
    errorToast("Error de conexión al desactivar ciudad.");
    return null;
  }
};
