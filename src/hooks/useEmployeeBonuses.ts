import { useState, useEffect, useCallback } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
  getEmployeeBonusesApi,
  createEmployeeBonusApi,
  updateEmployeeBonusApi,
  deleteEmployeeBonusApi,
  EmployeeBonusItem,
} from "../services/EmployeeBonusService";

export const useEmployeeBonuses = (employeeId?: number) => {
  const { token, isLoggedIn } = useLoginStore();
  const [bonuses, setBonuses] = useState<EmployeeBonusItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBonuses = useCallback(async () => {
    if (!isLoggedIn || !token || !employeeId) return;
    setIsLoading(true);
    try {
      const data = await getEmployeeBonusesApi(token, employeeId);
      if (data) {
        setBonuses(data);
      }
    } catch (error) {
      console.error("Error en useEmployeeBonuses al obtener bonos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn, employeeId]);

  const addBonus = async (bonusData: {
    name: string;
    amount: number;
  }) => {
    if (!token || !employeeId) return null;
    setIsLoading(true);
    try {
      const response = await createEmployeeBonusApi(token, employeeId, bonusData);
      if (response) {
        await fetchBonuses();
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useEmployeeBonuses al crear bono:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBonus = async (
    id: number,
    bonusData: {
      name?: string;
      amount?: number;
    }
  ) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await updateEmployeeBonusApi(token, id, bonusData);
      if (response) {
        await fetchBonuses();
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useEmployeeBonuses al actualizar bono:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBonus = async (id: number) => {
    if (!token) return false;
    setIsLoading(true);
    try {
      const response = await deleteEmployeeBonusApi(token, id);
      if (response) {
        await fetchBonuses();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en useEmployeeBonuses al eliminar bono:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBonuses();
  }, [fetchBonuses]);

  return {
    bonuses,
    isLoading,
    fetchBonuses,
    addBonus,
    updateBonus,
    deleteBonus,
  };
};
