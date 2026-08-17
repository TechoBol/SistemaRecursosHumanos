import { useState, useEffect, useCallback } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
  getCompaniesApi,
  createCompanyApi,
  updateCompanyApi,
  deleteCompanyApi
} from "../services/CompanyService";

export const useCompanies = () => {
  const { token, isLoggedIn } = useLoginStore();
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCompanies = useCallback(async () => {
    if (!isLoggedIn || !token) return;
    setIsLoading(true);
    try {
      const data = await getCompaniesApi(token);
      if (data) {
        setCompanies(data);
      }
    } catch (error) {
      console.error("Error en useCompanies al obtener empresas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn]);

  const createCompany = async (companyData: any) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await createCompanyApi(token, companyData);
      if (response) {
        await fetchCompanies(); // Recarga la lista tras crear
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useCompanies al crear empresa:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCompany = async (id: number, companyData: any) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await updateCompanyApi(token, id, companyData);
      if (response) {
        await fetchCompanies(); // Recarga la lista tras actualizar
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useCompanies al actualizar empresa:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCompany = async (id: number) => {
    if (!token) return false;
    setIsLoading(true);
    try {
      const response = await deleteCompanyApi(token, id);
      if (response) {
        await fetchCompanies(); // Recarga la lista tras desactivar
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en useCompanies al desactivar empresa:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return {
    companies,
    isLoading,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany
  };
};
