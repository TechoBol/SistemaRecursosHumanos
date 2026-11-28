import { useState, useEffect, useCallback } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
  getChristmasBonusesApi,
  finalizeChristmasBonusesApi,
  ChristmasBonusItem,
} from "../services/ChristmasBonusService";

export const useChristmasBonuses = (companyId: number | null, year: number) => {
  const { token, isLoggedIn } = useLoginStore();
  const [bonuses, setBonuses] = useState<ChristmasBonusItem[]>([]);
  const [isFinalized, setIsFinalized] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBonuses = useCallback(async () => {
    if (!isLoggedIn || !token || !companyId) return;
    setIsLoading(true);
    try {
      const response = await getChristmasBonusesApi(token, {
        companyId,
        year,
      });
      if (response) {
        setBonuses(response.data || []);
        setIsFinalized(Boolean(response.isFinalized));
        setIsAvailable(response.isAvailable !== false);
        setNoticeMessage(response.message || null);
      }
    } catch (error) {
      console.error("Error en useChristmasBonuses:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn, companyId, year]);

  useEffect(() => {
    fetchBonuses();
  }, [fetchBonuses]);

  const finalizeBonuses = async () => {
    if (!token || !companyId) return false;
    setIsLoading(true);
    try {
      const success = await finalizeChristmasBonusesApi(token, {
        companyId,
        year,
      });
      if (success) {
        await fetchBonuses();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al finalizar aguinaldos:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    bonuses,
    isFinalized,
    isAvailable,
    noticeMessage,
    isLoading,
    refetch: fetchBonuses,
    finalizeBonuses,
  };
};
