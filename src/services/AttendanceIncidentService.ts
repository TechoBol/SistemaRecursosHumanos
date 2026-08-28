import { errorToast, successToast } from "./toasts";

/* OBTENER REGISTROS DE ASISTENCIA DE UN EMPLEADO */
export const getAttendanceIncidentsApi = async (token: string, employeeId: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/attendance-incident/get-incidents/${employeeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudieron obtener los registros de asistencia.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener registros de asistencia:", error);
    errorToast("Error de conexión al obtener registros de asistencia.");
    return null;
  }
};

/* CREAR UN NUEVO REGISTRO DE ASISTENCIA */
export const createAttendanceIncidentApi = async (token: string, employeeId: number, incidentData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/attendance-incident/create-incident/${employeeId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(incidentData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo crear el registro de asistencia.");
      return null;
    }

    successToast("Registro de asistencia creado correctamente.");
    return data;
  } catch (error) {
    console.error("Error al crear registro de asistencia:", error);
    errorToast("Error de conexión al registrar asistencia.");
    return null;
  }
};

/* ACTUALIZAR UN REGISTRO DE ASISTENCIA EXISTENTE */
export const updateAttendanceIncidentApi = async (token: string, id: number, incidentData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/attendance-incident/update-incident/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(incidentData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo actualizar el registro de asistencia.");
      return null;
    }

    successToast("Registro de asistencia actualizado correctamente.");
    return data;
  } catch (error) {
    console.error("Error al actualizar registro de asistencia:", error);
    errorToast("Error de conexión al actualizar asistencia.");
    return null;
  }
};

/* ELIMINAR UN REGISTRO DE ASISTENCIA */
export const deleteAttendanceIncidentApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/attendance-incident/delete-incident/${id}`,
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
      errorToast(data.message || "No se pudo eliminar el registro de asistencia.");
      return null;
    }

    successToast("Registro de asistencia eliminado correctamente.");
    return data;
  } catch (error) {
    console.error("Error al eliminar registro de asistencia:", error);
    errorToast("Error de conexión al eliminar asistencia.");
    return null;
  }
};
