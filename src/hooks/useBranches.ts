import { useState, useEffect, useCallback } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
  getBranchesApi,
  createBranchApi,
  updateBranchApi,
  deleteBranchApi
} from "../services/BranchService";

export const useBranches = () => {
  const { token, isLoggedIn } = useLoginStore();
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBranches = useCallback(async () => {
    if (!isLoggedIn || !token) return;
    setIsLoading(true);
    try {
      const data = await getBranchesApi(token);
      if (data) {
        setBranches(data);
      }
    } catch (error) {
      console.error("Error en useBranches al obtener sucursales:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn]);

  const createBranch = async (branchData: any) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await createBranchApi(token, branchData);
      if (response) {
        await fetchBranches(); // Recarga la lista tras crear
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useBranches al crear sucursal:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBranch = async (id: number, branchData: any) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await updateBranchApi(token, id, branchData);
      if (response) {
        await fetchBranches(); // Recarga la lista tras actualizar
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useBranches al actualizar sucursal:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBranch = async (id: number) => {
    if (!token) return false;
    setIsLoading(true);
    try {
      const response = await deleteBranchApi(token, id);
      if (response) {
        await fetchBranches(); // Recarga la lista tras desactivar
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en useBranches al desactivar sucursal:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return {
    branches,
    isLoading,
    fetchBranches,
    createBranch,
    updateBranch,
    deleteBranch
  };
};
