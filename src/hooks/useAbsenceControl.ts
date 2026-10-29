import { useState, useEffect, useCallback } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { getAllAttendanceIncidentsApi } from "../services/AttendanceIncidentService";
import { getAllVacationsApi } from "../services/VacationService";
import { getAllEmployeeAdvancesApi } from "../services/EmployeeAdvanceService";

export const useAbsenceControl = (year: number, month: number) => {
  const { token, isLoggedIn } = useLoginStore();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [vacations, setVacations] = useState<any[]>([]);
  const [advances, setAdvances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!isLoggedIn || !token) return;
    setIsLoading(true);
    try {
      const [incidentsData, vacationsData, advancesData] = await Promise.all([
        getAllAttendanceIncidentsApi(token, { year, month }),
        getAllVacationsApi(token, { year, month }),
        getAllEmployeeAdvancesApi(token, { year, month }),
      ]);

      if (incidentsData) {
        setIncidents(incidentsData);
      }
      if (vacationsData) {
        setVacations(vacationsData);
      }
      if (advancesData) {
        setAdvances(advancesData);
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
    advances,
    isLoading,
    refetch: fetchData,
  };
};
