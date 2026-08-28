import { useState, useEffect, useCallback } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
  getAttendanceIncidentsApi,
  createAttendanceIncidentApi,
  updateAttendanceIncidentApi,
  deleteAttendanceIncidentApi
} from "../services/AttendanceIncidentService";

export const useAttendanceIncidents = (employeeId?: number) => {
  const { token, isLoggedIn } = useLoginStore();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchIncidents = useCallback(async () => {
    if (!isLoggedIn || !token || !employeeId) return;
    setIsLoading(true);
    try {
      const data = await getAttendanceIncidentsApi(token, employeeId);
      if (data) {
        setIncidents(data);
      }
    } catch (error) {
      console.error("Error en useAttendanceIncidents al obtener registros:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn, employeeId]);

  const addIncident = async (incidentData: any) => {
    if (!token || !employeeId) return null;
    setIsLoading(true);
    try {
      const response = await createAttendanceIncidentApi(token, employeeId, incidentData);
      if (response) {
        await fetchIncidents();
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useAttendanceIncidents al crear registro:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateIncident = async (id: number, incidentData: any) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const response = await updateAttendanceIncidentApi(token, id, incidentData);
      if (response) {
        await fetchIncidents();
        return response.data || response;
      }
      return null;
    } catch (error) {
      console.error("Error en useAttendanceIncidents al actualizar registro:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteIncident = async (id: number) => {
    if (!token) return false;
    setIsLoading(true);
    try {
      const response = await deleteAttendanceIncidentApi(token, id);
      if (response) {
        await fetchIncidents();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en useAttendanceIncidents al eliminar registro:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return {
    incidents,
    isLoading,
    fetchIncidents,
    addIncident,
    updateIncident,
    deleteIncident
  };
};
