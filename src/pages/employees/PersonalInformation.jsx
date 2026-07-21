import { useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  FileText,
  MapPin,
  MoreVertical,
  Pencil,
  Phone,
  Plus,
  Trash2,
  UserRound,
  UsersRound,
} from "lucide-react";
import {
  ActionButton,
  SectionTitle,
  SecondaryButton,
  TabContentCard,
} from "../../components/ui/Employees.styles";
import {
  AddButton,
  ContactBottomRow,
  ContactData,
  ContactDataItem,
  ContactDataText,
  ContactDetail,
  ContactItem,
  ContactList,
  ContactMenu,
  ContactMenuButton,
  ContactMenuItem,
  ContactMenuList,
  ContactTopRow,
  EmergencyCard,
  EmptyState,
  FileActions,
  FileCard,
  FileDescription,
  FileIcon,
  FileInfo,
  FileTitle,
  InformationColumns,
  InformationSection,
  SectionHeader,
} from "../../components/ui/employees/PersonalInformation.styles";
import EmergencyContactModal from "../../components/modals/EmergencyContactModal";

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

const createId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
};

const closeDetailsMenu = (event) => {
  event.currentTarget
    .closest("details")
    ?.removeAttribute("open");
};

const PersonalInformation = ({ employee }) => {
  const [emergencyContacts, setEmergencyContacts] = useState(
    [],
  );

  const [
    selectedEmergencyContact,
    setSelectedEmergencyContact,
  ] = useState(null);

  const [isEmergencyModalOpen, setIsEmergencyModalOpen] =
    useState(false);

  const handleOpenAddContact = () => {
    setSelectedEmergencyContact(null);
    setIsEmergencyModalOpen(true);
  };

  const handleOpenEditContact = (contact) => {
    setSelectedEmergencyContact(contact);
    setIsEmergencyModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setSelectedEmergencyContact(null);
    setIsEmergencyModalOpen(false);
  };

  const handleSaveContact = (contactData) => {
    if (selectedEmergencyContact) {
      setEmergencyContacts((currentContacts) =>
        currentContacts.map((contact) =>
          contact.id === selectedEmergencyContact.id
            ? {
                ...contact,
                ...contactData,
              }
            : contact,
        ),
      );
    } else {
      setEmergencyContacts((currentContacts) => [
        ...currentContacts,
        {
          ...contactData,
          id: createId(),
        },
      ]);
    }
    handleCloseContactModal();
  };

  const handleDeleteContact = (contactId) => {
    const shouldDelete = window.confirm(
      "¿Deseas eliminar este contacto de emergencia?",
    );
    if (!shouldDelete) {
      return;
    }
    setEmergencyContacts((currentContacts) =>
      currentContacts.filter(
        (contact) => contact.id !== contactId,
      ),
    );
  };

  const renderContactMenu = (contact) => (
    <ContactMenu>
      <ContactMenuButton
        aria-label={`Opciones del contacto ${contact.fullName}`}
        title="Opciones"
      >
        <MoreVertical size={20} />
      </ContactMenuButton>

      <ContactMenuList>
        <ContactMenuItem
          type="button"
          onClick={(event) => {
            closeDetailsMenu(event);
            handleOpenEditContact(contact);
          }}
        >
          <Pencil size={16} />
          Editar
        </ContactMenuItem>

        <ContactMenuItem
          type="button"
          $danger
          onClick={(event) => {
            closeDetailsMenu(event);
            handleDeleteContact(contact.id);
          }}
        >
          <Trash2 size={16} />
          Eliminar
        </ContactMenuItem>
      </ContactMenuList>
    </ContactMenu>
  );

  const renderEmergencyContacts = () => {
    if (emergencyContacts.length === 0) {
      return (
        <EmptyState>
          <AlertTriangle size={34} />
          <strong>Sin contactos registrados</strong>
          <span>Añade uno o más contactos de emergencia para este empleado.</span>
        </EmptyState>
      );
    }

    return (
      <ContactList>
        {emergencyContacts.map((contact) => (
          <ContactItem key={contact.id}>
            <ContactTopRow>
              <ContactDetail>
                <UserRound size={18} />
                <div>
                  <strong>Nombre</strong>
                  <span>{contact.fullName}</span>
                </div>
              </ContactDetail>

              <ContactDetail>
                <UsersRound size={18} />
                <div>
                  <strong>Relación</strong>
                  <span>{contact.relationship}</span>
                </div>
              </ContactDetail>

              {renderContactMenu(contact)}
            </ContactTopRow>

            <ContactBottomRow>
              <ContactDetail>
                <Phone size={18} />
                <div>
                  <strong>Teléfono</strong>
                  <span>
                    {contact.phone || "No registrado"}
                  </span>
                </div>
              </ContactDetail>

              <ContactDetail>
                <MapPin size={18} />
                <div>
                  <strong>Dirección</strong>
                  <span>
                    {contact.address || "No registrada"}
                  </span>
                </div>
              </ContactDetail>
            </ContactBottomRow>
          </ContactItem>
        ))}
      </ContactList>
    );
  };

  return (
    <>
      <TabContentCard>
        <SectionTitle>Hoja de vida e información personal</SectionTitle>
        <FileCard>
          <FileInfo>
            <FileIcon>
              <FileText size={30} />
            </FileIcon>

            <div>
              <FileTitle>Documentos del empleado</FileTitle>
              <FileDescription>Gestiona todos los documentos del empleado.</FileDescription>
            </div>
          </FileInfo>

          <FileActions>
            <SecondaryButton
              type="button"
              onClick={() =>
                console.log("Administrar file")
              }
            >
              Administrar file
            </SecondaryButton>

            <ActionButton
              type="button"
              onClick={() => console.log("Ver file")}
            >
              Ver file
            </ActionButton>
          </FileActions>
        </FileCard>

        <InformationColumns>
          <InformationSection>
            <SectionTitle>Detalles de contacto</SectionTitle>

            <ContactData>
              <ContactDataItem>
                <MapPin size={27} />
                <ContactDataText>
                  <strong>Dirección</strong>
                  <span>
                    {employee.address ||
                      "Sin dirección registrada"}
                  </span>
                </ContactDataText>
              </ContactDataItem>

              <ContactDataItem>
                <CalendarDays size={27} />
                <ContactDataText>
                  <strong>Fecha de nacimiento</strong>
                  <span>{formatDate(employee.birthDate)}</span>
                </ContactDataText>
              </ContactDataItem>
            </ContactData>
          </InformationSection>

          <InformationSection>
            <SectionHeader>
              <SectionTitle>Contactos de emergencia</SectionTitle>
              <AddButton
                type="button"
                title="Añadir contacto de emergencia"
                aria-label="Añadir contacto de emergencia"
                onClick={handleOpenAddContact}
              >
                <Plus size={19} />
              </AddButton>
            </SectionHeader>

            <EmergencyCard>
              {renderEmergencyContacts()}
            </EmergencyCard>
          </InformationSection>
        </InformationColumns>
      </TabContentCard>

      <EmergencyContactModal
        isOpen={isEmergencyModalOpen}
        contact={selectedEmergencyContact}
        onClose={handleCloseContactModal}
        onSubmit={handleSaveContact}
      />
    </>
  );
};

export default PersonalInformation;