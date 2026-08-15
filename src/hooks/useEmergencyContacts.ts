import { useState, useEffect, useCallback } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
  getEmergencyContactsApi,
  createEmergencyContactApi,
  updateEmergencyContactApi,
  deleteEmergencyContactApi
} from "../services/EmergencyContactService";

export const useEmergencyContacts = (employeeId: number) => {
  const { token, isLoggedIn } = useLoginStore();
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchContacts = useCallback(async () => {
    if (!isLoggedIn || !token || !employeeId) return;
    setIsLoading(true);
    try {
      const data = await getEmergencyContactsApi(token, employeeId);
      if (data) {
        setContacts(data);
      }
    } catch (error) {
      console.error("Error en useEmergencyContacts al obtener contactos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn, employeeId]);

  const addContact = async (contactData: any) => {
    if (!token || !employeeId) return null;
    setIsLoading(true);
    try {
      const response = await createEmergencyContactApi(token, employeeId, contactData);
      if (response) {
        await fetchContacts();
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useEmergencyContacts al crear contacto:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateContact = async (id: number, contactData: any) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await updateEmergencyContactApi(token, id, contactData);
      if (response) {
        await fetchContacts();
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useEmergencyContacts al actualizar contacto:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContact = async (id: number) => {
    if (!token) return false;
    setIsLoading(true);
    try {
      const response = await deleteEmergencyContactApi(token, id);
      if (response) {
        await fetchContacts();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en useEmergencyContacts al eliminar contacto:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    contacts,
    isLoading,
    fetchContacts,
    addContact,
    updateContact,
    deleteContact
  };
};
