import { errorToast, successToast } from "./toasts";

/* OBTENER TODOS LOS EMPLEADOS */
export const getEmployeesApi = async (token: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/employee/get-employees`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudieron obtener los empleados.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    errorToast("Error de conexión al obtener empleados.");
    return null;
  }
};

/* OBTENER EMPLEADO POR ID */
export const getEmployeeByIdApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/employee/get-employee/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudo obtener la información del empleado.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener empleado por ID:", error);
    errorToast("Error de conexión al obtener el empleado.");
    return null;
  }
};

/* CREAR UN NUEVO EMPLEADO */
export const createEmployeeApi = async (token: string, employeeData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/employee/create-employee`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(employeeData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo registrar al empleado.");
      return null;
    }

    successToast("Empleado registrado correctamente.");
    return data;
  } catch (error) {
    console.error("Error al crear empleado:", error);
    errorToast("Error de conexión al registrar empleado.");
    return null;
  }
};

/* ACTUALIZAR UN EMPLEADO EXISTENTE */
export const updateEmployeeApi = async (token: string, id: number, employeeData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/employee/update-employee/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(employeeData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo actualizar al empleado.");
      return null;
    }

    successToast("Empleado actualizado correctamente.");
    return data;
  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    errorToast("Error de conexión al actualizar empleado.");
    return null;
  }
};

/* ELIMINAR/DESACTIVAR UN EMPLEADO */
export const deleteEmployeeApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/employee/delete-employee/${id}`,
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
      errorToast(data.message || "No se pudo desactivar al empleado.");
      return null;
    }

    successToast("Empleado desactivado correctamente.");
    return data;
  } catch (error) {
    console.error("Error al desactivar empleado:", error);
    errorToast("Error de conexión al desactivar empleado.");
    return null;
  }
};
