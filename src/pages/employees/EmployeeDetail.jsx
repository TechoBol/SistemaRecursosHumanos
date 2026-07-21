import { useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Mail,
  Phone,
} from "lucide-react";
import {
  ActionButton,
  CompanyButton,
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
  EmployeeMeta,
  EmployeeMetaDivider,
  EmployeeMetaItem,
  EmployeeName,
  EmployeeStatus,
  SectionTitle,
  SecondaryButton,
} from "../../components/ui/Employees.styles";
import EmployeeModal from "../../components/modals/EmployeeModal";
import AdvancesInformation from "./AdvancesInformation";
import MemorandumsInformation from "./MemorandumsInformation";
import OtherEventsInformation from "./OtherEventsInformation";
import PermissionsInformation from "./PermissionsInformation";
import PersonalInformation from "./PersonalInformation";
import SalaryInformation from "./SalaryInformation";
import TerminationInformation from "./TerminationInformation";
import VacationsInformation from "./VacationsInformation";

const DETAIL_TABS = [
  {
    id: "personal",
    label: "Información personal",
  },
  {
    id: "salary",
    label: "Salario",
  },
  {
    id: "memorandums",
    label: "Memorándums",
  },
  {
    id: "permissions",
    label: "Permisos y faltas",
  },
  {
    id: "vacations",
    label: "Vacaciones",
  },
  {
    id: "advances",
    label: "Anticipos",
  },
  {
    id: "others",
    label: "Otros",
  },
  {
    id: "termination",
    label: "Desvinculación",
  },
];

const FALLBACK_EMPLOYEE = {
  id: 1,
  firstName: "Luis",
  lastName: "Perez",
  ci: "7854123",
  birthDate: "1998-04-12",
  status: "Activo",
  branch: "BARRIENTOS",
  area: "Tecnología",
  positionCurrent: "Auxiliar de Sistemas",
  positionContract: "Auxiliar de sistemas",
  contractCompany: "Empresa A",
  consolidatedCompany: "TechoBol",
  employeeType: "Planta",
  email: "luis@gmail.com",
  phone: "77777777",
  address: "Cochabamba",
  seniority: "2 meses 1 día",
  contractDate: "2026-05-06",
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Sin fecha registrada";
  }
  const dateParts = dateValue.split("-");
  if (dateParts.length !== 3) {
    return dateValue;
  }
  const [year, month, day] = dateParts;
  return `${day}/${month}/${year}`;
};

const EmployeeDetail = () => {
  const location = useLocation();
  const { employeeId } = useParams();
  const receivedEmployee = location.state?.employee;

  const [employee, setEmployee] = useState(
    receivedEmployee ?? {
      ...FALLBACK_EMPLOYEE,
      id: Number(employeeId) || FALLBACK_EMPLOYEE.id,
    },
  );

  const [activeTab, setActiveTab] = useState("personal");
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  const fullName = useMemo(() => {
    return `${employee.firstName ?? ""} ${
      employee.lastName ?? ""
    }`.trim();
  }, [employee.firstName, employee.lastName]);

  const handleSaveEmployee = (employeeData) => {
    setEmployee((currentEmployee) => ({
      ...currentEmployee,
      ...employeeData,

      positionCurrent:
        employeeData.currentPosition ??
        currentEmployee.positionCurrent,

      positionContract:
        employeeData.contractPosition ??
        currentEmployee.positionContract,

      contractDate:
        employeeData.contractDate ??
        currentEmployee.contractDate,
    }));

    setIsEmployeeModalOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInformation employee={employee} />;
      case "salary":
        return <SalaryInformation employee={employee} />;
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
        return (
          <TerminationInformation employee={employee} />
        );
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

          <DetailContent>
            <DetailHeaderGrid>
              <DetailMainCard>
                <EmployeeName>{fullName}</EmployeeName>
                <EmployeeMeta>
                  <EmployeeMetaItem>
                    <BriefcaseBusiness size={17} />
                    {employee.positionCurrent ||
                      "Sin cargo actual"}
                  </EmployeeMetaItem>

                  <EmployeeMetaDivider />

                  <EmployeeMetaItem>
                    {employee.area || "Sin área"}
                  </EmployeeMetaItem>

                  <EmployeeMetaDivider />

                  <EmployeeMetaItem>
                    {employee.branch || "Sin sucursal"}
                  </EmployeeMetaItem>
                </EmployeeMeta>

                <EmployeeMeta>
                  <EmployeeStatus $status={employee.status}>
                    {employee.status || "Sin estado"}
                  </EmployeeStatus>

                  <EmployeeMetaItem>
                    <CalendarDays size={18} />
                    {formatDate(employee.contractDate)}
                  </EmployeeMetaItem>

                  <EmployeeMetaDivider />

                  <EmployeeMetaItem>
                    {employee.seniority || "Sin antigüedad calculada"}
                  </EmployeeMetaItem>
                </EmployeeMeta>
              </DetailMainCard>

              <ContactCard>
                <SectionTitle>Contacto</SectionTitle>

                <ContactSection>
                  <ContactDataItem>
                    <Mail size={20} />
                    <span>
                      {employee.email || "Sin correo registrado"}
                    </span>
                  </ContactDataItem>

                  <ContactDataItem>
                    <Phone size={20} />
                    <span>
                      {employee.phone || "Sin teléfono registrado"}
                    </span>
                  </ContactDataItem>

                  <ContactDataItem>
                    <Building2 size={20} />
                    <span>
                      {employee.consolidatedCompany || "Sin empresa consolidada"}
                    </span>
                  </ContactDataItem>
                </ContactSection>

                <ContactActionGroup>
                  <ActionButton
                    type="button"
                    onClick={() =>
                      setIsEmployeeModalOpen(true)
                    }
                  >
                    Editar
                  </ActionButton>

                  <SecondaryButton
                    type="button"
                    onClick={() =>
                      console.log("Ver historial")
                    }
                  >
                    Historial
                  </SecondaryButton>

                  <CompanyButton
                    type="button"
                    onClick={() =>
                      console.log("Cambiar compañía")
                    }
                  >
                    Cambiar compañía
                  </CompanyButton>
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
        onClose={() => setIsEmployeeModalOpen(false)}
        onSubmit={handleSaveEmployee}
      />
    </>
  );
};

export default EmployeeDetail;