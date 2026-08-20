import { errorToast, successToast } from "./toasts";

/* OBTENER DOCUMENTOS DE UN EMPLEADO */
export const getEmployeeDocumentsApi = async (token: string, employeeId: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/employee-document/get-documents/${employeeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudieron obtener los documentos del empleado.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener documentos del empleado:", error);
    errorToast("Error de conexión al obtener los documentos.");
    return null;
  }
};

/* REGISTRAR UN NUEVO DOCUMENTO DE UN EMPLEADO */
export const createEmployeeDocumentApi = async (
  token: string,
  employeeId: number,
  docData: { documentType: string; name: string; fileUrl: string }
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/employee-document/create-document/${employeeId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(docData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo registrar el documento.");
      return null;
    }

    successToast("Documento registrado correctamente.");
    return data.data || data;
  } catch (error) {
    console.error("Error al registrar documento del empleado:", error);
    errorToast("Error de conexión al registrar el documento.");
    return null;
  }
};

/* ELIMINAR UN DOCUMENTO DE UN EMPLEADO */
export const deleteEmployeeDocumentApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/employee-document/delete-document/${id}`,
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
      errorToast(data.message || "No se pudo eliminar el documento.");
      return null;
    }

    successToast("Documento eliminado correctamente.");
    return data;
  } catch (error) {
    console.error("Error al eliminar documento del empleado:", error);
    errorToast("Error de conexión al eliminar el documento.");
    return null;
  }
};
