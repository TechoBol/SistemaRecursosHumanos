import { useState, useEffect, useCallback } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { getRolesApi } from "../services/RoleService";

export const useRoles = () => {
  const { token, isLoggedIn } = useLoginStore();
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRoles = useCallback(async () => {
    if (!isLoggedIn || !token) return;
    setIsLoading(true);
    try {
      const data = await getRolesApi(token);
      if (data) {
        setRoles(data);
      }
    } catch (error) {
      console.error("Error en useRoles al obtener roles:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    isLoading,
    fetchRoles
  };
};
