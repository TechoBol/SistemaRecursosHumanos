import { useState, useEffect, useCallback } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
  getUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi
} from "../services/UserService";

export const useUsers = () => {
  const { token, isLoggedIn } = useLoginStore();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!isLoggedIn || !token) return;
    setIsLoading(true);
    try {
      const data = await getUsersApi(token);
      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.error("Error en useUsers al obtener usuarios:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn]);

  const createUser = async (userData: any) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await createUserApi(token, userData);
      if (response) {
        await fetchUsers(); // Recarga la lista tras crear
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useUsers al crear usuario:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: number, userData: any) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await updateUserApi(token, id, userData);
      if (response) {
        await fetchUsers(); // Recarga la lista tras actualizar
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useUsers al actualizar usuario:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    if (!token) return false;
    setIsLoading(true);
    try {
      const response = await deleteUserApi(token, id);
      if (response) {
        await fetchUsers(); // Recarga la lista tras desactivar
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en useUsers al desactivar usuario:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  };
};
