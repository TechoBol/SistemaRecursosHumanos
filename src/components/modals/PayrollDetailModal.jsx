import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { X, Gift, Loader2 } from "lucide-react";
import { useLoginStore } from "../store/loginStore";
import { getAttendanceIncidentsApi } from "../../services/AttendanceIncidentService";
import { getEmployeeAdvancesApi } from "../../services/EmployeeAdvanceService";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalContent,
  ModalActions,
  CancelButton,
} from "../ui/Modal.styles";

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionHeader = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
`;

const TableCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
`;

const TableHead = styled.thead`
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;

  th {
    padding: 10px 16px;
    font-weight: 600;
    color: #475569;
    text-align: left;

    &:last-child {
      text-align: right;
    }
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #f8fafc;
  }

  td {
    padding: 10px 16px;
    color: #1e293b;

    &:last-child {
      text-align: right;
      font-weight: 600;
      color: #0f172a;
    }
  }
`;

const EmptyRow = styled.td`
  padding: 16px !important;
  text-align: center !important;
  color: #64748b !important;
  font-weight: 400 !important;
`;

const TotalRowGreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 10px 16px;
  background-color: #f0fdf4;
  border-top: 1px solid #e2e8f0;
  font-size: 14px;

  .total-label {
    color: #334155;
    font-weight: 500;
  }

  .total-value {
    color: #15803d;
    font-weight: 700;
    font-size: 15px;
  }
`;

const TotalRowBlue = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 10px 16px;
  background-color: #eff6ff;
  border-top: 1px solid #e2e8f0;
  font-size: 14px;

  .total-label {
    color: #334155;
    font-weight: 500;
  }

  .total-value {
    color: #1d4ed8;
    font-weight: 700;
    font-size: 15px;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${({ $bg }) => $bg || "#f1f5f9"};
  color: ${({ $color }) => $color || "#334155"};
`;

const SeniorityCard = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 22px;
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SeniorityIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  flex-shrink: 0;
`;

const SeniorityInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1.2;
  font-size: 13.5px;
  color: #334155;

  .item {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;

    span.label {
      color: #475569;
    }

    span.val {
      font-weight: 600;
      color: #0f172a;
    }
  }
`;

const SeniorityDivider = styled.div`
  width: 1px;
  height: 64px;
  background-color: #cbd5e1;
  opacity: 0.7;

  @media (max-width: 600px) {
    width: 100%;
    height: 1px;
  }
`;

const SeniorityDaysColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  font-size: 13.5px;
  color: #334155;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    span.label {
      color: #475569;
    }

    span.val {
      font-weight: 600;
      color: #0f172a;
    }
  }
`;

const SeniorityResultPill = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background-color: #dcfce7;
  border-radius: 8px;
  font-size: 13.5px;

  .label {
    color: #166534;
    font-weight: 600;
  }

  .amount {
    color: #15803d;
    font-weight: 700;
    font-size: 14.5px;
  }
`;

const EmployeeSubtitle = styled.div`
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
  font-weight: 500;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  color: #2f573c;
  gap: 10px;
  font-size: 14px;
`;

const formatMoney = (amount = 0) => {
  const formatted = new Intl.NumberFormat("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
  return `Bs ${formatted}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const [y, m, d] = String(dateStr).split("T")[0].split("-");
  if (!y || !m || !d) return "-";
  return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
};

const getIncidentInfo = (type) => {
  const t = String(type || "").toLowerCase();
  if (t === "permission" || t === "permiso") {
    return { label: "Permiso", bg: "#dcfce7", color: "#166534" };
  }
  if (t === "absence" || t === "falta") {
    return { label: "Falta", bg: "#fee2e2", color: "#991b1b" };
  }
  if (t === "lateness" || t === "atraso") {
    return { label: "Atraso", bg: "#fef3c7", color: "#b45309" };
  }
  return { label: type || "Incidencia", bg: "#f1f5f9", color: "#334155" };
};

const getSeniorityDetails = (payroll) => {
  if (!payroll) return null;

  const totalWorkedDays = Number(payroll.workedDays ?? 30);

  if (payroll.employeeType === "Consultor") {
    return {
      hireDateFormatted: payroll.hireDate ? formatDate(payroll.hireDate) : "-",
      milestoneLabel: "Cumple 2 años:",
      milestoneDate: "-",
      percentage: "0%",
      daysWithoutBonus: totalWorkedDays,
      daysWithBonus: 0,
      calculatedBonus: 0,
      isConsultant: true,
    };
  }

  if (!payroll.hireDate) {
    return {
      hireDateFormatted: "-",
      milestoneLabel: "Cumple 2 años:",
      milestoneDate: "-",
      percentage: "0%",
      daysWithoutBonus: totalWorkedDays,
      daysWithBonus: 0,
      calculatedBonus: payroll.seniorityBonus ?? 0,
    };
  }

  const [hYear, hMonth, hDay] = String(payroll.hireDate).split("T")[0].split("-").map(Number);
  const hireDate = new Date(hYear, hMonth - 1, hDay);
  const hireDateFormatted = `${String(hDay).padStart(2, "0")}/${String(hMonth).padStart(2, "0")}/${hYear}`;

  const currentYear = Number(payroll.year);
  const currentMonth = Number(payroll.month); // 1-12

  const anniversary2 = new Date(hYear + 2, hMonth - 1, hDay);
  const anniversary5 = new Date(hYear + 5, hMonth - 1, hDay);

  const formatD = (d) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

  const monthEnd = new Date(currentYear, currentMonth, 0);

  // Cumple 2 años en este período
  if (anniversary2.getFullYear() === currentYear && anniversary2.getMonth() === currentMonth - 1) {
    const annDay = anniversary2.getDate();
    const daysWithoutBonus = Math.min(annDay, totalWorkedDays);
    const daysWithBonus = Math.max(0, totalWorkedDays - daysWithoutBonus);
    return {
      hireDateFormatted,
      milestoneLabel: "Cumple 2 años:",
      milestoneDate: formatD(anniversary2),
      percentage: "5%",
      daysWithoutBonus,
      daysWithBonus,
      calculatedBonus: payroll.seniorityBonus ?? 0,
    };
  }

  // Cumple 5 años en este período
  if (anniversary5.getFullYear() === currentYear && anniversary5.getMonth() === currentMonth - 1) {
    const annDay = anniversary5.getDate();
    const daysAt5 = Math.min(annDay, totalWorkedDays);
    const daysAt11 = Math.max(0, totalWorkedDays - daysAt5);
    return {
      hireDateFormatted,
      milestoneLabel: "Cumple 5 años:",
      milestoneDate: formatD(anniversary5),
      percentage: "11%",
      daysWithoutBonus: daysAt5,
      daysWithBonus: daysAt11,
      calculatedBonus: payroll.seniorityBonus ?? 0,
      customDaysLabels: {
        without: "Días al 5%:",
        with: "Días al 11%:",
      },
    };
  }

  // Aún no cumple 2 años
  if (monthEnd < anniversary2) {
    return {
      hireDateFormatted,
      milestoneLabel: "Cumple 2 años:",
      milestoneDate: formatD(anniversary2),
      percentage: "0%",
      daysWithoutBonus: totalWorkedDays,
      daysWithBonus: 0,
      calculatedBonus: payroll.seniorityBonus ?? 0,
    };
  }

  // Entre 2 y 5 años (ya cumplió 2 años antes de este mes)
  if (monthEnd < anniversary5) {
    return {
      hireDateFormatted,
      milestoneLabel: "Cumple 5 años:",
      milestoneDate: formatD(anniversary5),
      percentage: "5%",
      daysWithoutBonus: 0,
      daysWithBonus: totalWorkedDays,
      calculatedBonus: payroll.seniorityBonus ?? 0,
    };
  }

  // 5 años o más (ya cumplió 5 años antes de este mes)
  return {
    hireDateFormatted,
    milestoneLabel: "Cumplió 5 años:",
    milestoneDate: formatD(anniversary5),
    percentage: "11%",
    daysWithoutBonus: 0,
    daysWithBonus: totalWorkedDays,
    calculatedBonus: payroll.seniorityBonus ?? 0,
  };
};

const PayrollDetailModal = ({ isOpen, payroll = null, onClose }) => {
  const { token } = useLoginStore();
  const [incidents, setIncidents] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !payroll?.employeeId || !token) {
      setIncidents([]);
      setAdvances([]);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      getAttendanceIncidentsApi(token, payroll.employeeId),
      getEmployeeAdvancesApi(token, payroll.employeeId),
    ])
      .then(([incidentsData, advancesData]) => {
        if (!isMounted) return;
        setIncidents(incidentsData || []);
        setAdvances(advancesData || []);
      })
      .catch((err) => {
        console.error("Error al obtener detalles de cálculo:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, payroll?.employeeId, token]);

  const periodIncidents = useMemo(() => {
    if (!payroll || !incidents.length) return [];
    return incidents.filter((inc) => {
      if (!inc.date) return false;
      const [y, m] = inc.date.split("T")[0].split("-").map(Number);
      return y === Number(payroll.year) && m === Number(payroll.month);
    });
  }, [incidents, payroll]);

  const periodAdvances = useMemo(() => {
    if (!payroll || !advances.length) return [];
    return advances.filter((adv) => {
      if (!adv.date) return false;
      const [y, m] = adv.date.split("T")[0].split("-").map(Number);
      return y === Number(payroll.year) && m === Number(payroll.month);
    });
  }, [advances, payroll]);

  const seniorityDetails = useMemo(() => {
    return getSeniorityDetails(payroll);
  }, [payroll]);

  if (!isOpen || !payroll) return null;

  const totalIncidentsDiscount = periodIncidents.reduce(
    (acc, inc) => acc + (Number(inc.discount) || 0),
    0
  );

  const totalAdvancesAmount = periodAdvances.reduce(
    (acc, adv) => acc + (Number(adv.amount) || 0),
    0
  );

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay $zIndex={1600} onMouseDown={handleOverlayClick}>
      <ModalContainer $maxWidth="680px" role="dialog" aria-modal="true">
        <ModalHeader>
          <div>
            <ModalTitle>Detalles de cálculo de nómina</ModalTitle>
            <EmployeeSubtitle>
              {payroll.employeeName} · CI: {payroll.employeeDocumentNumber || "S/N"}
            </EmployeeSubtitle>
          </div>
          <ModalCloseButton type="button" onClick={onClose} aria-label="Cerrar modal">
            <X size={21} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalContent style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "22px" }}>
          {isLoading ? (
            <LoadingWrapper>
              <Loader2 className="animate-spin" size={20} />
              <span>Cargando detalles de cálculo...</span>
            </LoadingWrapper>
          ) : (
            <>
              {/* SECCIÓN 1: PERMISOS Y FALTAS */}
              <Section>
                <SectionHeader>Permisos y faltas</SectionHeader>
                <TableCard>
                  <Table>
                    <TableHead>
                      <tr>
                        <th style={{ width: "35%" }}>Tipo</th>
                        <th style={{ width: "35%" }}>Fecha</th>
                        <th style={{ width: "30%" }}>Descuento</th>
                      </tr>
                    </TableHead>
                    <tbody>
                      {periodIncidents.length > 0 ? (
                        periodIncidents.map((inc, index) => {
                          const badge = getIncidentInfo(inc.type);
                          return (
                            <TableRow key={inc.id || index}>
                              <td>
                                <Badge $bg={badge.bg} $color={badge.color}>
                                  {badge.label}
                                </Badge>
                              </td>
                              <td>{formatDate(inc.date)}</td>
                              <td>{formatMoney(inc.discount)}</td>
                            </TableRow>
                          );
                        })
                      ) : (
                        <tr>
                          <EmptyRow colSpan={3}>
                            No se registraron permisos ni faltas en este período.
                          </EmptyRow>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  <TotalRowGreen>
                    <span className="total-label">Total:</span>
                    <span className="total-value">
                      {formatMoney(
                        totalIncidentsDiscount > 0
                          ? totalIncidentsDiscount
                          : payroll.absenceDeduction || 0
                      )}
                    </span>
                  </TotalRowGreen>
                </TableCard>
              </Section>

              {/* SECCIÓN 2: ANTICIPOS DEL MES */}
              <Section>
                <SectionHeader>Anticipos del mes</SectionHeader>
                <TableCard>
                  <Table>
                    <TableHead>
                      <tr>
                        <th style={{ width: "35%" }}>Fecha</th>
                        <th style={{ width: "40%" }}>Concepto</th>
                        <th style={{ width: "25%" }}>Monto</th>
                      </tr>
                    </TableHead>
                    <tbody>
                      {periodAdvances.length > 0 ? (
                        periodAdvances.map((adv, index) => (
                          <TableRow key={adv.id || index}>
                            <td>{formatDate(adv.date)}</td>
                            <td>{adv.notes || "Adelanto salarial"}</td>
                            <td>{formatMoney(adv.amount)}</td>
                          </TableRow>
                        ))
                      ) : (
                        <tr>
                          <EmptyRow colSpan={3}>
                            No se registraron anticipos en este período.
                          </EmptyRow>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  <TotalRowBlue>
                    <span className="total-label">Total:</span>
                    <span className="total-value">
                      {formatMoney(
                        totalAdvancesAmount > 0
                          ? totalAdvancesAmount
                          : payroll.advanceDeduction || 0
                      )}
                    </span>
                  </TotalRowBlue>
                </TableCard>
              </Section>

              {/* SECCIÓN 3: BONO DE ANTIGÜEDAD */}
              <Section>
                <SectionHeader>Bono de antigüedad</SectionHeader>
                {seniorityDetails && (
                  <SeniorityCard>
                    <SeniorityIconWrapper>
                      <Gift size={32} />
                    </SeniorityIconWrapper>

                    <SeniorityInfoColumn>
                      <div className="item">
                        <span className="label">Fecha de ingreso:</span>
                        <span className="val">{seniorityDetails.hireDateFormatted}</span>
                      </div>
                      <div className="item">
                        <span className="label">{seniorityDetails.milestoneLabel}</span>
                        <span className="val">{seniorityDetails.milestoneDate}</span>
                      </div>
                      <div className="item">
                        <span className="label">Porcentaje aplicado:</span>
                        <span className="val">{seniorityDetails.percentage}</span>
                      </div>
                    </SeniorityInfoColumn>

                    <SeniorityDivider />

                    <SeniorityDaysColumn>
                      <div className="item">
                        <span className="label">
                          {seniorityDetails.customDaysLabels?.without || "Días sin bono:"}
                        </span>
                        <span className="val">{seniorityDetails.daysWithoutBonus}</span>
                      </div>
                      <div className="item">
                        <span className="label">
                          {seniorityDetails.customDaysLabels?.with || "Días con bono:"}
                        </span>
                        <span className="val">{seniorityDetails.daysWithBonus}</span>
                      </div>
                      <SeniorityResultPill>
                        <span className="label">Bono calculado:</span>
                        <span className="amount">
                          {formatMoney(payroll.seniorityBonus || seniorityDetails.calculatedBonus || 0)}
                        </span>
                      </SeniorityResultPill>
                    </SeniorityDaysColumn>
                  </SeniorityCard>
                )}
              </Section>
            </>
          )}
        </ModalContent>

        <ModalActions style={{ paddingTop: "12px", borderTop: "1px solid rgba(199, 199, 199, 0.4)" }}>
          <CancelButton type="button" onClick={onClose}>
            Cerrar
          </CancelButton>
        </ModalActions>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PayrollDetailModal;
