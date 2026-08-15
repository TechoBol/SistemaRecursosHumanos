import { errorToast, successToast } from "./toasts";

/* OBTENER CONTACTOS DE EMERGENCIA DE UN EMPLEADO */
export const getEmergencyContactsApi = async (token: string, employeeId: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/emergency-contact/get-contacts/${employeeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      errorToast("No se pudieron obtener los contactos de emergencia.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener contactos de emergencia:", error);
    errorToast("Error de conexión al obtener contactos de emergencia.");
    return null;
  }
};

/* CREAR UN NUEVO CONTACTO DE EMERGENCIA */
export const createEmergencyContactApi = async (token: string, employeeId: number, contactData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/emergency-contact/create-contact/${employeeId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(contactData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo registrar el contacto.");
      return null;
    }

    successToast("Contacto de emergencia registrado correctamente.");
    return data;
  } catch (error) {
    console.error("Error al crear contacto de emergencia:", error);
    errorToast("Error de conexión al registrar contacto de emergencia.");
    return null;
  }
};

/* ACTUALIZAR UN CONTACTO DE EMERGENCIA EXISTENTE */
export const updateEmergencyContactApi = async (token: string, id: number, contactData: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/emergency-contact/update-contact/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(contactData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      errorToast(data.message || "No se pudo actualizar el contacto.");
      return null;
    }

    successToast("Contacto de emergencia actualizado correctamente.");
    return data;
  } catch (error) {
    console.error("Error al actualizar contacto de emergencia:", error);
    errorToast("Error de conexión al actualizar contacto de emergencia.");
    return null;
  }
};

/* ELIMINAR UN CONTACTO DE EMERGENCIA */
export const deleteEmergencyContactApi = async (token: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/emergency-contact/delete-contact/${id}`,
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
      errorToast(data.message || "No se pudo eliminar el contacto.");
      return null;
    }

    successToast("Contacto de emergencia eliminado correctamente.");
    return data;
  } catch (error) {
    console.error("Error al eliminar contacto de emergencia:", error);
    errorToast("Error de conexión al eliminar contacto de emergencia.");
    return null;
  }
};
