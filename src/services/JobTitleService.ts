import { errorToast, successToast } from "./toasts";

/* OBTENER TODOS LOS CARGOS */
export const getJobTitlesApi = async (token: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/job-title/get-job-titles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudieron obtener los cargos.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener cargos:", error);
    errorToast("Error de conexión al obtener cargos.");
    return null;
  }
};

/* OBTENER CARGO POR ID */
export const getJobTitleByIdApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/job-title/get-job-title/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudo obtener la información del cargo.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener cargo por ID:", error);
    errorToast("Error de conexión al obtener el cargo.");
    return null;
  }
};

/* CREAR UN NUEVO CARGO */
export const createJobTitleApi = async (token: string, jobTitleData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/job-title/create-job-title`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(jobTitleData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo crear el cargo.");
      return null;
    }

    successToast("Cargo creado correctamente.");
    return data;
  } catch (error) {
    console.error("Error al crear cargo:", error);
    errorToast("Error de conexión al crear cargo.");
    return null;
  }
};

/* ACTUALIZAR UN CARGO EXISTENTE */
export const updateJobTitleApi = async (token: string, id: number, jobTitleData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/job-title/update-job-title/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(jobTitleData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo actualizar el cargo.");
      return null;
    }

    successToast("Cargo actualizado correctamente.");
    return data;
  } catch (error) {
    console.error("Error al actualizar cargo:", error);
    errorToast("Error de conexión al actualizar cargo.");
    return null;
  }
};

/* ELIMINAR/DESACTIVAR UN CARGO */
export const deleteJobTitleApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/job-title/delete-job-title/${id}`,
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
      errorToast(data.message || "No se pudo desactivar el cargo.");
      return null;
    }

    successToast("Cargo desactivado correctamente.");
    return data;
  } catch (error) {
    console.error("Error al desactivar cargo:", error);
    errorToast("Error de conexión al desactivar cargo.");
    return null;
  }
};
