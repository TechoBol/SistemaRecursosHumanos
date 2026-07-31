import { errorToast, successToast } from "./toasts";

/* OBTENER TODAS LAS EMPRESAS */
export const getCompaniesApi = async (token: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/company/get-companies`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudieron obtener las empresas.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener empresas:", error);
    errorToast("Error de conexión al obtener empresas.");
    return null;
  }
};

/* OBTENER EMPRESA POR ID */
export const getCompanyByIdApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/company/get-company/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudo obtener la información de la empresa.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener empresa por ID:", error);
    errorToast("Error de conexión al obtener la empresa.");
    return null;
  }
};

/* CREAR UNA NUEVA EMPRESA */
export const createCompanyApi = async (token: string, companyData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/company/create-company`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(companyData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo crear la empresa.");
      return null;
    }

    successToast("Empresa creada correctamente.");
    return data;
  } catch (error) {
    console.error("Error al crear empresa:", error);
    errorToast("Error de conexión al crear empresa.");
    return null;
  }
};

/* ACTUALIZAR UNA EMPRESA EXISTENTE */
export const updateCompanyApi = async (token: string, id: number, companyData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/company/update-company/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(companyData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo actualizar la empresa.");
      return null;
    }

    successToast("Empresa actualizada correctamente.");
    return data;
  } catch (error) {
    console.error("Error al actualizar empresa:", error);
    errorToast("Error de conexión al actualizar empresa.");
    return null;
  }
};

/* ELIMINAR/DESACTIVAR UNA EMPRESA */
export const deleteCompanyApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/company/delete-company/${id}`,
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
      errorToast(data.message || "No se pudo desactivar la empresa.");
      return null;
    }

    successToast("Empresa desactivada correctamente.");
    return data;
  } catch (error) {
    console.error("Error al desactivar empresa:", error);
    errorToast("Error de conexión al desactivar empresa.");
    return null;
  }
};
