import { errorToast, successToast } from "./toasts";

export interface EmployeeBonusItem {
  id: number;
  employeeId: number;
  name: string;
  amount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getEmployeeBonusesApi = async (
  token: string,
  employeeId: number
): Promise<EmployeeBonusItem[] | null> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/employee-bonus/get-bonuses/${employeeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      errorToast("No se pudieron obtener los bonos del empleado.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener bonos del empleado:", error);
    errorToast("Error de conexión al obtener los bonos.");
    return null;
  }
};

export const createEmployeeBonusApi = async (
  token: string,
  employeeId: number,
  data: {
    name: string;
    amount: number;
  }
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/employee-bonus/create-bonus/${employeeId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const resData = await response.json();

    if (!response.ok) {
      errorToast(resData.message || "No se pudo registrar el bono.");
      return null;
    }

    successToast("Bono registrado correctamente.");
    return resData;
  } catch (error) {
    console.error("Error al registrar bono:", error);
    errorToast("Error de conexión al registrar el bono.");
    return null;
  }
};

export const updateEmployeeBonusApi = async (
  token: string,
  id: number,
  data: {
    name?: string;
    amount?: number;
  }
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/employee-bonus/update-bonus/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const resData = await response.json();

    if (!response.ok) {
      errorToast(resData.message || "No se pudo actualizar el bono.");
      return null;
    }

    successToast("Bono actualizado correctamente.");
    return resData;
  } catch (error) {
    console.error("Error al actualizar bono:", error);
    errorToast("Error de conexión al actualizar el bono.");
    return null;
  }
};

export const deleteEmployeeBonusApi = async (
  token: string,
  id: number
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/employee-bonus/delete-bonus/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const resData = await response.json();

    if (!response.ok) {
      errorToast(resData.message || "No se pudo eliminar el bono.");
      return null;
    }

    successToast("Bono eliminado correctamente.");
    return resData;
  } catch (error) {
    console.error("Error al eliminar bono:", error);
    errorToast("Error de conexión al eliminar el bono.");
    return null;
  }
};
