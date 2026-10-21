import { useState, useEffect, useCallback } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { getAllAttendanceIncidentsApi } from "../services/AttendanceIncidentService";
import { getAllVacationsApi } from "../services/VacationService";

export const useAbsenceControl = (year: number, month: number) => {
  const { token, isLoggedIn } = useLoginStore();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [vacations, setVacations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!isLoggedIn || !token) return;
    setIsLoading(true);
    try {
      const [incidentsData, vacationsData] = await Promise.all([
        getAllAttendanceIncidentsApi(token, { year, month }),
        getAllVacationsApi(token, { year, month }),
      ]);

      if (incidentsData) {
        setIncidents(incidentsData);
      }
      if (vacationsData) {
        setVacations(vacationsData);
      }
    } catch (error) {
      console.error("Error al obtener datos de control de ausencias:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn, year, month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    incidents,
    vacations,
    isLoading,
    refetch: fetchData,
  };
};
