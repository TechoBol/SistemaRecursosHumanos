import { useState, useEffect, useCallback } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
  getCitiesApi,
  createCityApi,
  updateCityApi,
  deleteCityApi
} from "../services/CityService";

export const useCities = () => {
  const { token, isLoggedIn } = useLoginStore();
  const [cities, setCities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCities = useCallback(async () => {
    if (!isLoggedIn || !token) return;
    setIsLoading(true);
    try {
      const data = await getCitiesApi(token);
      if (data) {
        setCities(data);
      }
    } catch (error) {
      console.error("Error en useCities al obtener ciudades:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn]);

  const createCity = async (cityData: any) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await createCityApi(token, cityData);
      if (response) {
        await fetchCities(); // Recarga la lista tras crear
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useCities al crear ciudad:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCity = async (id: number, cityData: any) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await updateCityApi(token, id, cityData);
      if (response) {
        await fetchCities(); // Recarga la lista tras actualizar
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useCities al actualizar ciudad:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCity = async (id: number) => {
    if (!token) return false;
    setIsLoading(true);
    try {
      const response = await deleteCityApi(token, id);
      if (response) {
        await fetchCities(); // Recarga la lista tras desactivar
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en useCities al desactivar ciudad:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  return {
    cities,
    isLoading,
    fetchCities,
    createCity,
    updateCity,
    deleteCity
  };
};
