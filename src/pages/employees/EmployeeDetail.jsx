import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  MapPinned,
  Phone,
} from "lucide-react";
import {
  ActionButton,
  BackButton,
  ContactActionGroup,
  ContactCard,
  ContactDataItem,
  ContactSection,
  DetailContainer,
  DetailContent,
  DetailHeaderGrid,
  DetailMainCard,
  DetailPage,
  DetailTab,
  DetailTabs,
  DetailNavigation,
  EmployeeMeta,
  EmployeeMetaDivider,
  EmployeeMetaItem,
  EmployeeName,
  EmployeeStatus,
  SectionTitle,
  SecondaryButton,
} from "../../components/ui/Employees.styles";
import EmployeeModal from "../../components/modals/EmployeeModal";
import { getSeniorityFull } from "../../utils/dateUtils";
import { useEmployees } from "../../hooks/useEmployees";
import { useCompanies } from "../../hooks/useCompanies";
import { useBranches } from "../../hooks/useBranches";
import { useAreas } from "../../hooks/useAreas";
import { useJobTitles } from "../../hooks/useJobTitles";
import { successToast } from "../../services/toasts";
import AdvancesInformation from "./AdvancesInformation";
import MemorandumsInformation from "./MemorandumsInformation";
import OtherEventsInformation from "./OtherEventsInformation";
import PermissionsInformation from "./PermissionsInformation";
import PersonalInformation from "./PersonalInformation";
import SalaryInformation from "./SalaryInformation";
import TerminationInformation from "./TerminationInformation";
import VacationsInformation from "./VacationsInformation";

const DETAIL_TABS = [
  { id: "personal", label: "Información personal" },
  { id: "salary", label: "Salario" },
  { id: "permissions", label: "Permisos y faltas" },
  { id: "advances", label: "Anticipos" },
  { id: "vacations", label: "Vacaciones" },
  { id: "memorandums", label: "Memorándums" },
  { id: "others", label: "Otros" },
  { id: "termination", label: "Desvinculación" },
];

const mapDbEmployeeToUi = (employee) => {
  if (!employee) return null;
  const activeContract =
    employee.contracts?.find((contract) => contract.isActive) ||
    employee.contracts?.[0] ||
    null;
  return {
    ...employee,
    firstName: employee.firstNames ?? "",
    lastName: employee.lastNames ?? "",
    ci: employee.documentNumber ?? "",
    birthDate: employee.birthDate ? employee.birthDate.split("T")[0] : "",
    status: employee.status === "ACTIVE" ? "Activo" : "Inactivo",
    branch: activeContract?.branch?.name || "Sin sucursal",
    area: activeContract?.area?.name || "Sin área",
    positionCurrent: activeContract?.jobTitle?.name || "Sin cargo actual",
    positionContract: activeContract?.contractJobTitle?.name || "Sin cargo de contrato",
    contractCompany: activeContract?.contractCompany?.name || "Sin empresa de contrato",
    consolidatedCompany: activeContract?.consolidatedCompany?.name || "Sin empresa consolidada",
    employeeType: activeContract?.contractType === "CONSULTING" ? "Consultor" : "Planta",
    email: employee.email ?? "",
    phone: employee.phone ?? "",
    address: employee.address ?? "",
    seniority: getSeniorityFull(activeContract?.hireDate),
    contractDate: activeContract?.hireDate ? activeContract.hireDate.split("T")[0] : "",
  };
};

const formatDate = (dateValue) => {
  if (!dateValue) return "Sin fecha registrada";
  const [year, month, day] = dateValue.split("-");
  if (!year || !month || !day) return dateValue;
  return `${day}/${month}/${year}`;
};

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const { getEmployeeById, updateEmployee } = useEmployees();
  const { companies } = useCompanies();
  const { branches } = useBranches();
  const { areas } = useAreas();
  const { jobTitles } = useJobTitles();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  /* Unica función responsable de obtener el empleado actualizado desde backend */
  const loadEmployee = async () => {
    if (!employeeId) return null;
    const data = await getEmployeeById(Number(employeeId));
    if (data) setEmployee(data);
    return data;
  };

  /* Se carga el empleado al ingresar al detalle o cambiar el ID de la URL */
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await getEmployeeById(Number(employeeId));
        if (isMounted && data) {
          setEmployee(data);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    if (employeeId) {
      load();
    }
    return () => {
      isMounted = false;
    };
  }, [employeeId]);

  const uiEmployee = useMemo(() => {
    return mapDbEmployeeToUi(employee);
  }, [employee]);

  const fullName = useMemo(() => {
    if (!uiEmployee) return "";
    return `${uiEmployee.firstName} ${uiEmployee.lastName}`.trim();
  }, [uiEmployee?.firstName, uiEmployee?.lastName]);

  const handleSaveEmployee = async (employeeData) => {
    if (!employee?.id) return;
    const updated = await updateEmployee(employee.id, employeeData);
    if (!updated) return;
    const refreshedEmployee = await loadEmployee();
    if (!refreshedEmployee) return;
    setIsEmployeeModalOpen(false);
    successToast("Empleado actualizado correctamente.");
  };

  const renderTabContent = () => {
    if (!uiEmployee) return null;
    switch (activeTab) {
      case "personal":
        return <PersonalInformation employee={uiEmployee} />
      case "salary":
        return <SalaryInformation employee={uiEmployee} />
      case "permissions":
        return <PermissionsInformation employee={uiEmployee} />
      case "advances":
        return <AdvancesInformation employee={uiEmployee} />;
      case "vacations":
        return <VacationsInformation />;
      case "memorandums":
        return <MemorandumsInformation />;
      case "others":
        return <OtherEventsInformation />;
      case "termination":
        return <TerminationInformation employee={uiEmployee} />
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <DetailPage>
        <DetailContainer>
          <DetailContent>Cargando información del empleado...</DetailContent>
        </DetailContainer>
      </DetailPage>
    );
  }

  /* Si finalizó el GET pero no existe empleado */
  if (!employee || !uiEmployee) {
    return (
      <DetailPage>
        <DetailContainer>
          <DetailContent>No se pudo obtener la información del empleado.</DetailContent>
        </DetailContainer>
      </DetailPage>
    );
  }

  return (
    <>
      <DetailPage>
        <DetailContainer>
          <DetailTabs aria-label="Secciones del empleado">
            {DETAIL_TABS.map((tab) => (
              <DetailTab
                key={tab.id}
                type="button"
                $active={activeTab === tab.id}
                aria-pressed={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </DetailTab>
            ))}
          </DetailTabs>

          <DetailNavigation>
            <BackButton type="button" onClick={() => navigate("/empleados")}>
              <ArrowLeft size={17} />
              Atrás
            </BackButton>
          </DetailNavigation>

          <DetailContent>
            <DetailHeaderGrid>
              <DetailMainCard>
                <EmployeeName>{fullName}</EmployeeName>
                <EmployeeMeta>
                  <EmployeeMetaItem>
                    <BriefcaseBusiness size={17} />
                    Cargo de contrato:{" "}
                    {uiEmployee.positionContract}
                  </EmployeeMetaItem>
                  <EmployeeMetaDivider />
                  <EmployeeMetaItem>
                    Cargo actual:{" "}
                    {uiEmployee.positionCurrent}
                  </EmployeeMetaItem>
                </EmployeeMeta>

                <EmployeeMeta>
                  <EmployeeMetaItem>
                    <MapPinned size={17} />
                    Sucursal:{" "}
                    {uiEmployee.branch}
                  </EmployeeMetaItem>
                  <EmployeeMetaDivider />
                  <EmployeeMetaItem>
                    Área: {uiEmployee.area}
                  </EmployeeMetaItem>
                </EmployeeMeta>

                <EmployeeMeta>
                  <EmployeeMetaItem>
                    <Building2 size={20} />
                    Contrato:{" "}
                    {uiEmployee.contractCompany}
                  </EmployeeMetaItem>
                  <EmployeeMetaDivider />
                  <EmployeeMetaItem>
                    Consolidada:{" "}
                    {uiEmployee.consolidatedCompany}
                  </EmployeeMetaItem>
                </EmployeeMeta>

                <EmployeeMeta>
                  <EmployeeStatus $status={uiEmployee.status}>
                    {uiEmployee.status}
                  </EmployeeStatus>

                  <EmployeeMetaItem>
                    <CalendarDays size={18} />
                    Fecha de contrato:{" "}
                    {formatDate(uiEmployee.contractDate)}
                  </EmployeeMetaItem>

                  <EmployeeMetaDivider />

                  <EmployeeMetaItem>
                    {uiEmployee.seniority || "Sin antigüedad"}
                  </EmployeeMetaItem>
                </EmployeeMeta>
              </DetailMainCard>

              <ContactCard>
                <SectionTitle>Contacto</SectionTitle>

                <ContactSection>
                  <ContactDataItem>
                    <Mail size={20} />
                    <span>
                      {uiEmployee.email || "Sin correo registrado"}
                    </span>
                  </ContactDataItem>

                  <ContactDataItem>
                    <Phone size={20} />
                    <span>
                      {uiEmployee.phone || "Sin teléfono registrado"}
                    </span>
                  </ContactDataItem>

                  <ContactDataItem>
                    <MapPin size={20} />
                    <span>
                      {uiEmployee.address || "Sin dirección registrada"}
                    </span>
                  </ContactDataItem>
                </ContactSection>

                <ContactActionGroup>
                  <ActionButton
                    type="button"
                    onClick={() => setIsEmployeeModalOpen(true)}
                  >
                    Editar
                  </ActionButton>

                  <SecondaryButton
                    type="button"
                    onClick={() => console.log( "Ver historial") }
                  >
                    Historial
                  </SecondaryButton>
                </ContactActionGroup>
              </ContactCard>
            </DetailHeaderGrid>
            {renderTabContent()}
          </DetailContent>
        </DetailContainer>
      </DetailPage>

      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        mode="edit"
        employee={employee}
        companies={companies}
        branches={branches}
        areas={areas}
        jobTitles={jobTitles}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSubmit={handleSaveEmployee}
      />
    </>
  );
};

export default EmployeeDetail;