import { useState, useEffect, useCallback } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
  getAreasApi,
  createAreaApi,
  updateAreaApi,
  deleteAreaApi
} from "../services/AreaService";

export const useAreas = () => {
  const { token, isLoggedIn } = useLoginStore();
  const [areas, setAreas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAreas = useCallback(async () => {
    if (!isLoggedIn || !token) return;
    setIsLoading(true);
    try {
      const data = await getAreasApi(token);
      if (data) {
        setAreas(data);
      }
    } catch (error) {
      console.error("Error en useAreas al obtener áreas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn]);

  const createArea = async (areaData: any) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await createAreaApi(token, areaData);
      if (response) {
        await fetchAreas(); // Recarga la lista tras crear
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useAreas al crear área:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateArea = async (id: number, areaData: any) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await updateAreaApi(token, id, areaData);
      if (response) {
        await fetchAreas(); // Recarga la lista tras actualizar
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useAreas al actualizar área:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArea = async (id: number) => {
    if (!token) return false;
    setIsLoading(true);
    try {
      const response = await deleteAreaApi(token, id);
      if (response) {
        await fetchAreas(); // Recarga la lista tras desactivar
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en useAreas al desactivar área:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  return {
    areas,
    isLoading,
    fetchAreas,
    createArea,
    updateArea,
    deleteArea
  };
};
