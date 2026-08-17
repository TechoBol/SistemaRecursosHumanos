import { errorToast, successToast } from "./toasts";

/* OBTENER TODAS LAS SUCURSALES */
export const getBranchesApi = async (token: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/branch/get-branches`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudieron obtener las sucursales.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener sucursales:", error);
    errorToast("Error de conexión al obtener sucursales.");
    return null;
  }
};

/* OBTENER SUCURSAL POR ID */
export const getBranchByIdApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/branch/get-branch/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudo obtener la información de la sucursal.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener sucursal por ID:", error);
    errorToast("Error de conexión al obtener la sucursal.");
    return null;
  }
};

/* CREAR UNA NUEVA SUCURSAL */
export const createBranchApi = async (token: string, branchData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/branch/create-branch`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(branchData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo crear la sucursal.");
      return null;
    }

    successToast("Sucursal creada correctamente.");
    return data;
  } catch (error) {
    console.error("Error al crear sucursal:", error);
    errorToast("Error de conexión al crear sucursal.");
    return null;
  }
};

/* ACTUALIZAR UNA SUCURSAL EXISTENTE */
export const updateBranchApi = async (token: string, id: number, branchData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/branch/update-branch/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(branchData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo actualizar la sucursal.");
      return null;
    }

    successToast("Sucursal actualizada correctamente.");
    return data;
  } catch (error) {
    console.error("Error al actualizar sucursal:", error);
    errorToast("Error de conexión al actualizar sucursal.");
    return null;
  }
};

/* ELIMINAR/DESACTIVAR UNA SUCURSAL */
export const deleteBranchApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/branch/delete-branch/${id}`,
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
      errorToast(data.message || "No se pudo desactivar la sucursal.");
      return null;
    }

    successToast("Sucursal desactivada correctamente.");
    return data;
  } catch (error) {
    console.error("Error al desactivar sucursal:", error);
    errorToast("Error de conexión al desactivar sucursal.");
    return null;
  }
};
