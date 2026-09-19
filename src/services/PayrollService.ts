import { errorToast, successToast } from "./toasts";

export interface PayrollItem {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeDocumentNumber: string;
  hireDate: string | null;
  employeeType: string;
  jobTitleName: string;
  contractCompanyId: number;
  contractCompanyName: string;
  consolidatedCompanyId: number;
  consolidatedCompanyName: string;
  year: number;
  month: number;
  baseSalary: number;
  workedDays: number;
  earnedSalary: number;
  seniorityBonus: number;
  otherBonuses: number;
  grossPay: number;
  afpDeduction: number;
  absenceDeduction: number;
  advanceDeduction: number;
  totalDeductions: number;
  netSalary: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const getPayrollsApi = async (
  token: string,
  params: {
    companyId: number;
    companyType: "contract" | "consolidated";
    year: number;
    month: number;
  }
): Promise<PayrollItem[] | null> => {
  try {
    const query = new URLSearchParams({
      companyId: String(params.companyId),
      companyType: params.companyType,
      year: String(params.year),
      month: String(params.month),
    });

    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/payroll?${query.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      errorToast("No se pudo obtener la nómina del período seleccionado.");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener nóminas:", error);
    errorToast("Error de conexión al obtener nóminas.");
    return null;
  }
};

export const updatePayrollApi = async (
  token: string,
  id: number,
  data: {
    workedDays?: number;
    otherBonuses?: number;
    absenceDeduction?: number;
    advanceDeduction?: number;
    status?: string;
  }
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/payroll/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const resData = await response.json();

    if (!response.ok) {
      errorToast(resData.message || "No se pudo actualizar la nómina.");
      return null;
    }

    successToast("Nómina actualizada correctamente.");
    return resData;
  } catch (error) {
    console.error("Error al actualizar nómina:", error);
    errorToast("Error de conexión al actualizar nómina.");
    return null;
  }
};
