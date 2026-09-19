import { useState, useEffect, useCallback } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
  getVacationsApi,
  createVacationApi,
  updateVacationApi,
  deleteVacationApi,
} from "../services/VacationService";

export const useVacations = (employeeId?: number) => {
  const { token, isLoggedIn } = useLoginStore();
  const [vacations, setVacations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVacations = useCallback(async () => {
    if (!isLoggedIn || !token || !employeeId) return;
    setIsLoading(true);
    try {
      const data = await getVacationsApi(token, employeeId);
      if (data) {
        setVacations(data);
      }
    } catch (error) {
      console.error("Error en useVacations al obtener vacaciones:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn, employeeId]);

  const addVacation = async (vacationData: any) => {
    if (!token || !employeeId) return null;
    setIsLoading(true);
    try {
      const response = await createVacationApi(token, employeeId, vacationData);
      if (response) {
        await fetchVacations();
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useVacations al crear vacación:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateVacation = async (id: number, vacationData: any) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await updateVacationApi(token, id, vacationData);
      if (response) {
        await fetchVacations();
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useVacations al actualizar vacación:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVacation = async (id: number) => {
    if (!token) return false;
    setIsLoading(true);
    try {
      const response = await deleteVacationApi(token, id);
      if (response) {
        await fetchVacations();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en useVacations al eliminar vacación:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVacations();
  }, [fetchVacations]);

  return {
    vacations,
    isLoading,
    fetchVacations,
    addVacation,
    updateVacation,
    deleteVacation,
  };
};
