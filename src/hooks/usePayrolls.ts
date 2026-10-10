import { useState, useEffect, useCallback } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
  getPayrollsApi,
  updatePayrollApi,
  finalizePayrollApi,
  PayrollItem,
} from "../services/PayrollService";

export const usePayrolls = (
  companyId: number | null,
  companyType: "contract" | "consolidated",
  year: number,
  month: number
) => {
  const { token, isLoggedIn } = useLoginStore();
  const [payrolls, setPayrolls] = useState<PayrollItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPayrolls = useCallback(async () => {
    if (!isLoggedIn || !token || !companyId) return;
    setIsLoading(true);
    try {
      const data = await getPayrollsApi(token, {
        companyId,
        companyType,
        year,
        month,
      });
      if (data) {
        setPayrolls(data);
      }
    } catch (error) {
      console.error("Error en usePayrolls al obtener nóminas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn, companyId, companyType, year, month]);

  const updatePayroll = async (
    id: number,
    updateData: {
      workedDays?: number;
      otherBonuses?: number;
      absenceDeduction?: number;
      advanceDeduction?: number;
      status?: string;
    }
  ) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const res = await updatePayrollApi(token, id, updateData);
      if (res) {
        await fetchPayrolls();
        return res.data || res;
      }
      return null;
    } catch (error) {
      console.error("Error en usePayrolls al actualizar nómina:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const finalizePayroll = async () => {
    if (!token || !companyId) return null;
    setIsLoading(true);
    try {
      const res = await finalizePayrollApi(token, {
        companyId,
        companyType,
        year,
        month,
      });
      if (res) {
        await fetchPayrolls();
        return res;
      }
      return null;
    } catch (error) {
      console.error("Error en usePayrolls al finalizar planilla:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, [fetchPayrolls]);

  return {
    payrolls,
    isLoading,
    fetchPayrolls,
    updatePayroll,
    finalizePayroll,
  };
};
