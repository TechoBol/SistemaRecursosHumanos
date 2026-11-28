import { errorToast, successToast } from "./toasts";

export interface ChristmasBonusItem {
  id: number;
  employeeId: number;
  contractId?: number;
  employeeFirstNames?: string;
  employeeLastNames?: string;
  employeeName: string;
  employeeDocumentNumber: string;
  employeeCiExtension?: string | null;
  employeeNationality?: string | null;
  employeeBirthDate?: string | null;
  employeeGender?: string | null;
  cityId?: number;
  cityName?: string;
  contractJobTitleName: string;
  hireDate: string | null;
  employeeType: string;
  averageBaseSalary: number;
  averageSeniorityBonus: number;
  averageOtherBonuses: number;
  averageGrossPay: number;
  workedMonths: number;
  workedDays: number;
  christmasBonusAmount: number;
  status: string;
  isFinalized: boolean;
}

export interface ChristmasBonusApiResponse {
  isAvailable: boolean;
  isFinalized: boolean;
  message?: string;
  data: ChristmasBonusItem[];
}

export const getChristmasBonusesApi = async (
  token: string,
  params: {
    companyId: number;
    year: number;
  }
): Promise<ChristmasBonusApiResponse | null> => {
  try {
    const query = new URLSearchParams({
      companyId: String(params.companyId),
      year: String(params.year),
    });

    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/christmas-bonus?${query.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      errorToast("No se pudo obtener la planilla de aguinaldos.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener aguinaldos:", error);
    errorToast("Error de conexión al obtener la planilla de aguinaldos.");
    return null;
  }
};

export const finalizeChristmasBonusesApi = async (
  token: string,
  payload: {
    companyId: number;
    year: number;
  }
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/christmas-bonus/finalize`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      errorToast(errData?.message || "No se pudo finalizar la planilla de aguinaldos.");
      return false;
    }

    successToast("Planilla de aguinaldos finalizada exitosamente.");
    return true;
  } catch (error) {
    console.error("Error al finalizar aguinaldos:", error);
    errorToast("Error de conexión al finalizar la planilla de aguinaldos.");
    return false;
  }
};
