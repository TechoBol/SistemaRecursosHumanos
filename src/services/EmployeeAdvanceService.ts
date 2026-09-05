import { errorToast, successToast } from "./toasts";

/* OBTENER ANTICIPOS DE SUELDO DE UN EMPLEADO */
export const getEmployeeAdvancesApi = async (token: string, employeeId: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/employee-advance/get-advances/${employeeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudieron obtener los anticipos de sueldo.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener anticipos de sueldo:", error);
    errorToast("Error de conexión al obtener anticipos de sueldo.");
    return null;
  }
};

/* CREAR UN NUEVO ANTICIPO DE SUELDO */
export const createEmployeeAdvanceApi = async (token: string, employeeId: number, advanceData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/employee-advance/create-advance/${employeeId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(advanceData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo registrar el anticipo.");
      return null;
    }

    successToast("Anticipo registrado correctamente.");
    return data;
  } catch (error) {
    console.error("Error al crear anticipo de sueldo:", error);
    errorToast("Error de conexión al registrar anticipo de sueldo.");
    return null;
  }
};

/* ACTUALIZAR UN ANTICIPO DE SUELDO EXISTENTE */
export const updateEmployeeAdvanceApi = async (token: string, id: number, advanceData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/employee-advance/update-advance/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(advanceData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo actualizar el anticipo.");
      return null;
    }

    successToast("Anticipo actualizado correctamente.");
    return data;
  } catch (error) {
    console.error("Error al actualizar anticipo de sueldo:", error);
    errorToast("Error de conexión al actualizar anticipo de sueldo.");
    return null;
  }
};

/* ELIMINAR UN ANTICIPO DE SUELDO */
export const deleteEmployeeAdvanceApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/employee-advance/delete-advance/${id}`,
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
      errorToast(data.message || "No se pudo eliminar el anticipo.");
      return null;
    }

    successToast("Anticipo eliminado correctamente.");
    return data;
  } catch (error) {
    console.error("Error al eliminar anticipo de sueldo:", error);
    errorToast("Error de conexión al eliminar anticipo de sueldo.");
    return null;
  }
};
