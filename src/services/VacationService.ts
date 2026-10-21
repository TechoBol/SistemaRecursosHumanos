import { errorToast, successToast } from "./toasts";

/* OBTENER TODAS LAS VACACIONES (OPCIONALMENTE POR AÑO Y MES) */
export const getAllVacationsApi = async (token: string, params?: { year?: number; month?: number }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.year) queryParams.append("year", String(params.year));
    if (params?.month) queryParams.append("month", String(params.month));
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/vacation/all${queryString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudieron obtener las vacaciones.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener vacaciones:", error);
    errorToast("Error de conexión al obtener vacaciones.");
    return null;
  }
};

/* OBTENER VACACIONES DE UN EMPLEADO */
export const getVacationsApi = async (token: string, employeeId: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/vacation/employee/${employeeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudieron obtener las vacaciones del empleado.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener vacaciones:", error);
    errorToast("Error de conexión al obtener vacaciones.");
    return null;
  }
};

/* CREAR REGISTRO DE VACACION */
export const createVacationApi = async (token: string, employeeId: number, vacationData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/vacation/employee/${employeeId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(vacationData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo registrar la vacación.");
      return null;
    }

    successToast("Vacación registrada correctamente.");
    return data;
  } catch (error) {
    console.error("Error al registrar vacación:", error);
    errorToast("Error de conexión al registrar vacación.");
    return null;
  }
};

/* ACTUALIZAR REGISTRO DE VACACION */
export const updateVacationApi = async (token: string, id: number, vacationData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/vacation/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(vacationData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo actualizar la vacación.");
      return null;
    }

    successToast("Vacación actualizada correctamente.");
    return data;
  } catch (error) {
    console.error("Error al actualizar vacación:", error);
    errorToast("Error de conexión al actualizar vacación.");
    return null;
  }
};

/* ELIMINAR REGISTRO DE VACACION */
export const deleteVacationApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/vacation/${id}`,
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
      errorToast(data.message || "No se pudo eliminar la vacación.");
      return null;
    }

    successToast("Vacación eliminada correctamente.");
    return data;
  } catch (error) {
    console.error("Error al eliminar vacación:", error);
    errorToast("Error de conexión al eliminar vacación.");
    return null;
  }
};
