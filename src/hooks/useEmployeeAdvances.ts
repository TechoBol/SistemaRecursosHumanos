import { useState, useEffect, useCallback } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
  getEmployeeAdvancesApi,
  createEmployeeAdvanceApi,
  updateEmployeeAdvanceApi,
  deleteEmployeeAdvanceApi,
} from "../services/EmployeeAdvanceService";

export const useEmployeeAdvances = (employeeId?: number) => {
  const { token, isLoggedIn } = useLoginStore();
  const [advances, setAdvances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdvances = useCallback(async () => {
    if (!isLoggedIn || !token || !employeeId) return;
    setIsLoading(true);
    try {
      const data = await getEmployeeAdvancesApi(token, employeeId);
      if (data) {
        setAdvances(data);
      }
    } catch (error) {
      console.error("Error en useEmployeeAdvances al obtener anticipos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn, employeeId]);

  const addAdvance = async (advanceData: any) => {
    if (!token || !employeeId) return null;
    setIsLoading(true);
    try {
      const response = await createEmployeeAdvanceApi(token, employeeId, advanceData);
      if (response) {
        await fetchAdvances();
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useEmployeeAdvances al crear anticipo:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdvance = async (id: number, advanceData: any) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await updateEmployeeAdvanceApi(token, id, advanceData);
      if (response) {
        await fetchAdvances();
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useEmployeeAdvances al actualizar anticipo:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAdvance = async (id: number) => {
    if (!token) return false;
    setIsLoading(true);
    try {
      const response = await deleteEmployeeAdvanceApi(token, id);
      if (response) {
        await fetchAdvances();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en useEmployeeAdvances al eliminar anticipo:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvances();
  }, [fetchAdvances]);

  return {
    advances,
    isLoading,
    fetchAdvances,
    addAdvance,
    updateAdvance,
    deleteAdvance,
  };
};
