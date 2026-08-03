import { useState, useEffect, useCallback } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
  getJobTitlesApi,
  createJobTitleApi,
  updateJobTitleApi,
  deleteJobTitleApi
} from "../services/JobTitleService";

export const useJobTitles = () => {
  const { token, isLoggedIn } = useLoginStore();
  const [jobTitles, setJobTitles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchJobTitles = useCallback(async () => {
    if (!isLoggedIn || !token) return;
    setIsLoading(true);
    try {
      const data = await getJobTitlesApi(token);
      if (data) {
        setJobTitles(data);
      }
    } catch (error) {
      console.error("Error en useJobTitles al obtener cargos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn]);

  const createJobTitle = async (jobTitleData: any) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await createJobTitleApi(token, jobTitleData);
      if (response) {
        await fetchJobTitles(); // Recarga la lista tras crear
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useJobTitles al crear cargo:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateJobTitle = async (id: number, jobTitleData: any) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await updateJobTitleApi(token, id, jobTitleData);
      if (response) {
        await fetchJobTitles(); // Recarga la lista tras actualizar
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useJobTitles al actualizar cargo:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteJobTitle = async (id: number) => {
    if (!token) return false;
    setIsLoading(true);
    try {
      const response = await deleteJobTitleApi(token, id);
      if (response) {
        await fetchJobTitles(); // Recarga la lista tras desactivar
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en useJobTitles al desactivar cargo:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobTitles();
  }, [fetchJobTitles]);

  return {
    jobTitles,
    isLoading,
    fetchJobTitles,
    createJobTitle,
    updateJobTitle,
    deleteJobTitle
  };
};
