import { useEffect, useState, useMemo } from "react";
import { X, Gift } from "lucide-react";
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
  ModalBlock,
  ModalBlockTitle,
  ModalSubtitle,
  ModalTableCard,
  ModalTable,
  ModalTableHead,
  ModalTableHeaderCell,
  ModalTableRow,
  ModalEmptyCell,
  ModalTotalBar,
  ModalBadge,
  ModalInfoCard,
  ModalInfoIcon,
  ModalInfoColumn,
  ModalInfoDivider,
  ModalResultBar,
  ModalLoading,
} from "../ui/Modal.styles";

// =============== UTILIDADES ===============
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
    return {label: "Permiso", bg: "#dcfce7", color: "#166534"};
  }
  if (t === "absence" || t === "falta") {
    return {label: "Falta", bg: "#fee2e2", color: "#991b1b"};
  }
  if (t === "lateness" || t === "atraso") {
    return {label: "Atraso", bg: "#fef3c7",color: "#b45309"};
  }
  return {label: type || "Incidencia", bg: "#f1f5f9", color: "#334155"};
};

// =============== CÁLCULO DEL BONO DE ANTIGÜEDAD ===============
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
  const hireDateFormatted = `${String(hDay).padStart(2, "0")}/` + `${String(hMonth).padStart(2, "0")}/${hYear}`;
  const currentYear = Number(payroll.year);
  const currentMonth = Number(payroll.month);
  const anniversary2 = new Date(hYear + 2, hMonth - 1, hDay);
  const anniversary5 = new Date(hYear + 5, hMonth - 1, hDay);

  const formatD = (d) =>
    `${String(d.getDate()).padStart(2, "0")}/` +
    `${String(d.getMonth() + 1).padStart(2, "0")}/` +
    `${d.getFullYear()}`;

  const monthEnd = new Date(currentYear, currentMonth, 0);

  // Cumple 2 años durante este período
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

  // Cumple 5 años durante este período
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

  // Entre 2 y 5 años
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

  // 5 años o más
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

// =============== COMPONENTE PRINCIPAL ===============
const PayrollDetailModal = ({ isOpen, payroll = null, onClose }) => {
  const { token } = useLoginStore();
  const [incidents, setIncidents] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // =============== CARGA DE DATOS ===============
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

  // =============== FILTRADO POR PERÍODO ===============
  const periodIncidents = useMemo(() => {
    if (!payroll || !incidents.length) return [];
    return incidents.filter((inc) => {
      if (!inc.date) return false;
      const [y, m] = inc.date.split("T")[0].split("-").map(Number);
      return (y === Number(payroll.year) && m === Number(payroll.month));
    });
  }, [incidents, payroll]);

  const periodAdvances = useMemo(() => {
    if (!payroll || !advances.length) return [];
    return advances.filter((adv) => {
      if (!adv.date) return false;
      const [y, m] = adv.date.split("T")[0].split("-").map(Number);
      return (y === Number(payroll.year) && m === Number(payroll.month));
    });
  }, [advances, payroll]);

  const seniorityDetails = useMemo(() => getSeniorityDetails(payroll), [payroll]);

  if (!isOpen || !payroll) return null;

  // =============== TOTALES ===============
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

  // =============== VISTA ===============
  return (
    <ModalOverlay $zIndex={1600} onMouseDown={handleOverlayClick}>
      <ModalContainer $maxWidth="680px" role="dialog" aria-modal="true">
        {/* ENCABEZADO */}
        <ModalHeader>
          <div>
            <ModalTitle>Detalles de cálculo de nómina</ModalTitle>
            <ModalSubtitle>{payroll.employeeName} · CI:{" "} {payroll.employeeDocumentNumber || "S/N"}</ModalSubtitle>
          </div>
          <ModalCloseButton type="button" onClick={onClose} aria-label="Cerrar modal">
            <X size={21} />
          </ModalCloseButton>
        </ModalHeader>

        {/* CONTENIDO */}
        <ModalContent $padding="20px 22px" $mobilePadding="16px" $gap="22px">
          {isLoading ? (
            <ModalLoading>
              <span>Cargando detalles de cálculo...</span>
            </ModalLoading>
          ) : (
            <>
              {/* SECCIÓN 1: PERMISOS Y FALTAS */}
              <ModalBlock>
                <ModalBlockTitle>Permisos y faltas</ModalBlockTitle>
                <ModalTableCard>
                  <ModalTable>
                    <ModalTableHead>
                      <tr>
                        <ModalTableHeaderCell $width="35%">Tipo</ModalTableHeaderCell>
                        <ModalTableHeaderCell $width="35%">Fecha</ModalTableHeaderCell>
                        <ModalTableHeaderCell $width="30%">Descuento</ModalTableHeaderCell>
                      </tr>
                    </ModalTableHead>
                    <tbody>
                      {periodIncidents.length > 0 ? (
                        periodIncidents.map((inc, index) => {
                          const badge = getIncidentInfo(inc.type);
                          return (
                            <ModalTableRow key={inc.id || index}>
                              <td>
                                <ModalBadge $bg={badge.bg} $color={badge.color}>{badge.label}</ModalBadge>
                              </td>
                              <td>{formatDate(inc.date)}</td>
                              <td>{formatMoney(inc.discount)}</td>
                            </ModalTableRow>
                          );
                        })
                      ) : (
                        <tr>
                          <ModalEmptyCell colSpan={3}>No se registraron permisos ni faltas en este período.</ModalEmptyCell>
                        </tr>
                      )}
                    </tbody>
                  </ModalTable>
                  <ModalTotalBar $variant="success">
                    <span className="total-label">Total:</span>
                    <span className="total-value">
                      {formatMoney(
                        totalIncidentsDiscount > 0
                          ? totalIncidentsDiscount
                          : payroll.absenceDeduction || 0
                      )}
                    </span>
                  </ModalTotalBar>
                </ModalTableCard>
              </ModalBlock>

              {/* SECCIÓN 2: ANTICIPOS */}
              <ModalBlock>
                <ModalBlockTitle>Anticipos del mes</ModalBlockTitle>
                <ModalTableCard>
                  <ModalTable>
                    <ModalTableHead>
                      <tr>
                        <ModalTableHeaderCell $width="35%">Fecha</ModalTableHeaderCell>
                        <ModalTableHeaderCell $width="40%">Concepto</ModalTableHeaderCell>
                        <ModalTableHeaderCell $width="25%">Monto</ModalTableHeaderCell>
                      </tr>
                    </ModalTableHead>
                    <tbody>
                      {periodAdvances.length > 0 ? (
                        periodAdvances.map((adv, index) => (
                          <ModalTableRow key={adv.id || index}>
                            <td>{formatDate(adv.date)}</td>
                            <td>{adv.notes || "Adelanto salarial"}</td>
                            <td>{formatMoney(adv.amount)}</td>
                          </ModalTableRow>
                        ))
                      ) : (
                        <tr>
                          <ModalEmptyCell colSpan={3}>No se registraron anticipos en este período.</ModalEmptyCell>
                        </tr>
                      )}
                    </tbody>
                  </ModalTable>
                  <ModalTotalBar $variant="info">
                    <span className="total-label">Total:</span>
                    <span className="total-value">
                      {formatMoney(
                        totalAdvancesAmount > 0
                          ? totalAdvancesAmount
                          : payroll.advanceDeduction || 0
                      )}
                    </span>
                  </ModalTotalBar>
                </ModalTableCard>
              </ModalBlock>

              {/* SECCIÓN 3: BONO DE ANTIGÜEDAD */}
              <ModalBlock>
                <ModalBlockTitle>Bono de antigüedad</ModalBlockTitle>
                {seniorityDetails && (
                  <ModalInfoCard>
                    <ModalInfoIcon>
                      <Gift size={32} />
                    </ModalInfoIcon>

                    <ModalInfoColumn $flex={1.2} $gap="6px">
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
                    </ModalInfoColumn>

                    <ModalInfoDivider />

                    <ModalInfoColumn $spread>
                      <div className="item">
                        <span className="label">{seniorityDetails.customDaysLabels ?.without || "Días sin bono:"}</span>
                        <span className="val">{seniorityDetails.daysWithoutBonus}</span>
                      </div>
                      <div className="item">
                        <span className="label">{seniorityDetails.customDaysLabels ?.with || "Días con bono:"}</span>
                        <span className="val">{seniorityDetails.daysWithBonus}</span>
                      </div>
                      <ModalResultBar>
                        <span className="label">Bono calculado:</span>
                        <span className="amount">
                          {formatMoney(payroll.seniorityBonus || seniorityDetails.calculatedBonus || 0)}
                        </span>
                      </ModalResultBar>
                    </ModalInfoColumn>
                  </ModalInfoCard>
                )}
              </ModalBlock>
            </>
          )}
        </ModalContent>

        {/* ACCIONES */}
        <ModalActions $compact $divided>
          <CancelButton type="button" onClick={onClose}>
            Cerrar
          </CancelButton>
        </ModalActions>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PayrollDetailModal;