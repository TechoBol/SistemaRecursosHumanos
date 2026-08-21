import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Mail,
  MapPin,
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
import { useLoginStore } from "../../components/store/loginStore";
import { useEmployees } from "../../hooks/useEmployees";
import { useCompanies } from "../../hooks/useCompanies";
import { useBranches } from "../../hooks/useBranches";
import { useAreas } from "../../hooks/useAreas";
import { useJobTitles } from "../../hooks/useJobTitles";
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
  { id: "memorandums", label: "Memorándums" },
  { id: "permissions", label: "Permisos y faltas" },
  { id: "vacations", label: "Vacaciones" },
  { id: "advances", label: "Anticipos" },
  { id: "others", label: "Otros" },
  { id: "termination", label: "Desvinculación" },
];

const mapDbEmployeeToUi = (emp) => {
  if (!emp) return null;
  const activeContract = emp.contracts ? emp.contracts.find((c) => c.isActive) : null;
  return {
    ...emp,
    firstName: emp.firstNames ?? "",
    lastName: emp.lastNames ?? "",
    ci: emp.documentNumber ?? "",
    birthDate: emp.birthDate ? emp.birthDate.split("T")[0] : "",
    status: emp.status === "ACTIVE" ? "Activo" : "Inactivo",
    branch: activeContract?.branch?.name || "Sin sucursal",
    area: activeContract?.area?.name || "Sin área",
    positionCurrent: activeContract?.jobTitle?.name || "Sin cargo actual",
    positionContract: activeContract?.contractJobTitle?.name || "Sin cargo de contrato",
    contractCompany: activeContract?.contractCompany?.name || "Sin empresa de contrato",
    consolidatedCompany: activeContract?.consolidatedCompany?.name || "Sin empresa consolidada",
    employeeType: activeContract?.contractType === "CONSULTING" ? "Consultor" : "Planta",
    email: emp.email ?? "",
    phone: emp.phone ?? "",
    address: emp.address ?? "",
    seniority: getSeniorityFull(activeContract?.hireDate),
    contractDate: activeContract?.hireDate ? activeContract.hireDate.split("T")[0] : "",
  };
};

const formatDate = (dateValue) => {
  if (!dateValue) return "Sin fecha registrada";
  const dateParts = dateValue.split("-");
  if (dateParts.length !== 3) return dateValue;
  const [year, month, day] = dateParts;
  return `${day}/${month}/${year}`;
};

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const { token } = useLoginStore();
  const location = useLocation();
  const { employeeId } = useParams();
  const receivedEmployee = location.state?.employee;

  const { getEmployeeById, updateEmployee } = useEmployees();
  const { companies } = useCompanies();
  const { branches } = useBranches();
  const { areas } = useAreas();
  const { jobTitles } = useJobTitles();

  const [dbEmployee, setDbEmployee] = useState(receivedEmployee);
  const [activeTab, setActiveTab] = useState("personal");
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  const fetchEmployeeData = useCallback(async () => {
    if (!employeeId) return;
    const data = await getEmployeeById(Number(employeeId));
    if (data) {
      setDbEmployee(data);
    }
  }, [employeeId, getEmployeeById]);

  useEffect(() => {
    if (!receivedEmployee) {
      fetchEmployeeData();
    }
  }, [receivedEmployee, fetchEmployeeData]);

  const uiEmployee = useMemo(() => {
    return mapDbEmployeeToUi(dbEmployee) || {
      id: Number(employeeId),
      firstName: "Cargando",
      lastName: "...",
      ci: "",
      status: "Activo",
      branch: "Cargando...",
      area: "Cargando...",
      positionCurrent: "Cargando...",
      email: "",
      phone: "",
      consolidatedCompany: "",
      contractDate: "",
      seniority: "",
    };
  }, [dbEmployee, employeeId]);

  const fullName = useMemo(() => {
    return `${uiEmployee.firstName} ${uiEmployee.lastName}`.trim();
  }, [uiEmployee.firstName, uiEmployee.lastName]);

  const handleSaveEmployee = async (employeeData) => {
    const updated = await updateEmployee(uiEmployee.id, employeeData);
    if (updated) {
      setDbEmployee(updated);
    }
    setIsEmployeeModalOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInformation employee={uiEmployee} />;
      case "salary":
        return <SalaryInformation employee={uiEmployee} />;
      case "memorandums":
        return <MemorandumsInformation />;
      case "permissions":
        return <PermissionsInformation />;
      case "vacations":
        return <VacationsInformation />;
      case "advances":
        return <AdvancesInformation />;
      case "others":
        return <OtherEventsInformation />;
      case "termination":
        return <TerminationInformation employee={uiEmployee} />;
      default:
        return null;
    }
  };

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
                    Cargo: {uiEmployee.positionCurrent || "Sin cargo actual"}
                  </EmployeeMetaItem>

                  <EmployeeMetaDivider />

                  <EmployeeMetaItem>
                    Área: {uiEmployee.area || "Sin área"}
                  </EmployeeMetaItem>

                  <EmployeeMetaDivider />

                  <EmployeeMetaItem>
                    Sucursal: {uiEmployee.branch || "Sin sucursal"}
                  </EmployeeMetaItem>
                </EmployeeMeta>

                <EmployeeMeta>
                  <EmployeeMetaItem>
                    <Building2 size={20} />
                    Contrato: {uiEmployee.contractCompany || "Sin empresa de contrato"}
                  </EmployeeMetaItem>
                  <EmployeeMetaDivider />
                  <EmployeeMetaItem>
                    Consolidada: {uiEmployee.consolidatedCompany || "Sin empresa consolidada"}
                  </EmployeeMetaItem>
                </EmployeeMeta>

                <EmployeeMeta>
                  <EmployeeStatus $status={uiEmployee.status}>
                    {uiEmployee.status || "Sin estado"}
                  </EmployeeStatus>

                  <EmployeeMetaItem>
                    <CalendarDays size={18} />
                    Fecha de contrato: {formatDate(uiEmployee.contractDate)}
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
                    onClick={() => console.log("Ver historial")}
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
        employee={dbEmployee}
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