import { useState, useEffect, useCallback } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
  getEmployeesApi,
  getEmployeeByIdApi,
  createEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi
} from "../services/EmployeeService";

export const useEmployees = () => {
  const { token, isLoggedIn } = useLoginStore();
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmployees = useCallback(async () => {
    if (!isLoggedIn || !token) return;
    setIsLoading(true);
    try {
      const data = await getEmployeesApi(token);
      if (data) {
        setEmployees(data);
      }
    } catch (error) {
      console.error("Error en useEmployees al obtener empleados:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn]);

  const getEmployeeById = async (id: number) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      return await getEmployeeByIdApi(token, id);
    } catch (error) {
      console.error("Error en useEmployees al obtener empleado por ID:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createEmployee = async (employeeData: any) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await createEmployeeApi(token, employeeData);
      if (response) {
        await fetchEmployees(); // Recarga la lista tras crear
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useEmployees al crear empleado:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmployee = async (id: number, employeeData: any) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await updateEmployeeApi(token, id, employeeData);
      if (response) {
        await fetchEmployees(); // Recarga la lista tras actualizar
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useEmployees al actualizar empleado:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmployee = async (id: number) => {
    if (!token) return false;
    setIsLoading(true);
    try {
      const response = await deleteEmployeeApi(token, id);
      if (response) {
        await fetchEmployees(); // Recarga la lista tras desactivar
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en useEmployees al desactivar empleado:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    isLoading,
    fetchEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
  };
};
