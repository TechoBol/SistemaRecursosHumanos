import { TriangleAlert } from "lucide-react";

import {
  SectionTitle,
  TabContentCard,
} from "../../components/ui/Employees.styles";

import {
  AlertCard,
  AlertContent,
  AlertIcon,
  AlertList,
  AlertTitle,
  DangerButton,
  StatusBadge,
  TabActions,
  TabHeader,
} from "../../components/ui/employees/EmployeeTabs.styles";

const TerminationInformation = ({ employee }) => {
  const isTerminated =
    employee.status === "Desvinculado" ||
    employee.status === "Inactivo";

  const handleTerminate = () => {
    const shouldTerminate = window.confirm(
      `¿Estás seguro de desvincular a ${employee.firstName} ${employee.lastName}?`,
    );

    if (!shouldTerminate) {
      return;
    }

    console.log("Desvincular empleado:", employee.id);
  };

  return (
    <TabContentCard>
      <TabHeader>
        <SectionTitle>
          Desvinculación de empleado
        </SectionTitle>

        <StatusBadge
          $variant={isTerminated ? "danger" : "success"}
        >
          {employee.status || "Activo"}
        </StatusBadge>
      </TabHeader>

      <AlertCard $variant="danger">
        <AlertContent>
          <AlertTitle>
            Advertencia sobre la desvinculación:
          </AlertTitle>

          <AlertList>
            <li>
              El empleado será marcado como desvinculado en el
              sistema.
            </li>

            <li>
              Se iniciará un periodo de 30 días antes de la
              eliminación permanente.
            </li>

            <li>
              Durante este periodo, los datos seguirán
              disponibles, pero el empleado no estará activo.
            </li>

            <li>
              Después de 30 días, todos los datos serán eliminados
              permanentemente.
            </li>
          </AlertList>
        </AlertContent>

        <AlertIcon>
          <TriangleAlert size={72} strokeWidth={1.5} />
        </AlertIcon>
      </AlertCard>

      <TabActions>
        <DangerButton
          type="button"
          disabled={isTerminated}
          onClick={handleTerminate}
        >
          {isTerminated
            ? "Empleado desvinculado"
            : "Desvincular"}
        </DangerButton>
      </TabActions>
    </TabContentCard>
  );
};

export default TerminationInformation;