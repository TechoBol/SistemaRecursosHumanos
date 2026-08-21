import { useState, useMemo } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Eye,
  FileText,
  MapPin,
  MoreVertical,
  Pencil,
  Phone,
  Plus,
  Trash2,
  UserRound,
  UsersRound,
  ChevronDown,
  ChevronUp,
  Upload,
  FileImage,
} from "lucide-react";
import { theme } from "../../components/ui/Theme";
import {
  SectionTitle,
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
  FileIcon,
  FileTitle,
  FileDescription,
  InformationColumns,
  InformationSection,
  SectionHeader,
  AccordionContainer,
  AccordionHeader,
  AccordionHeaderLeft,
  AccordionHeaderRight,
  RegisteredCountBadge,
  AccordionBody,
  DocTypeRow,
  DocTypeHeader,
  DocTypeMeta,
  DocTypeIcon,
  DocTypeInfo,
  DocTypeTitle,
  DocTypeDesc,
  UploadButton,
  FileItem,
  FileItemLeft,
  FileItemRight,
  FileActionTextButton,
  IconButton,
  FileItemsContainer,
} from "../../components/ui/employees/PersonalInformation.styles";
import EmergencyContactModal from "../../components/modals/EmergencyContactModal";
import DocumentModal from "../../components/modals/DocumentModal";
import { useEmergencyContacts } from "../../hooks/useEmergencyContacts";
import { useEmployeeDocuments } from "../../hooks/useEmployeeDocuments";

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

const closeDetailsMenu = (event) => {
  event.currentTarget
    .closest("details")
    ?.removeAttribute("open");
};

const PersonalInformation = ({ employee }) => {
  // Hook de contactos
  const { contacts, addContact, updateContact, deleteContact } = useEmergencyContacts(employee.id);
  // Hook de documentos de empleado
  const { documents, uploadAndCreateDocument, deleteDocument, getSignedFileUrl } = useEmployeeDocuments(employee.id, employee.ci);
  // Estados locales
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const [selectedEmergencyContact, setSelectedEmergencyContact] = useState(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  // Estados locales para el modal de documentos
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docModalMode, setDocModalMode] = useState("upload"); // "upload" | "view"
  const [docModalTitle, setDocModalTitle] = useState("");
  const [docModalType, setDocModalType] = useState("");
  const [docModalUrl, setDocModalUrl] = useState("");
  const [docModalName, setDocModalName] = useState("");
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  // Calcular cantidad de categorías registradas (sobre 4 posibles)
  const uniqueUploadedCategoriesCount = useMemo(() => {
    const categories = new Set();
    documents.forEach((doc) => { categories.add(doc.documentType); });
    return categories.size;
  }, [documents]);

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

  const handleSaveContact = async (contactData) => {
    if (selectedEmergencyContact) {
      await updateContact(selectedEmergencyContact.id, contactData);
    } else {
      await addContact(contactData);
    }
    handleCloseContactModal();
  };

  const handleDeleteContact = async (contactId) => {
    const shouldDelete = window.confirm("¿Deseas eliminar este contacto de emergencia?");
    if (!shouldDelete) {
      return;
    }
    await deleteContact(contactId);
  };

  // Disparadores del modal de documentos
  const handleOpenUploadModal = (docType, title) => {
    setDocModalMode("upload");
    setDocModalTitle(`Subir ${title}`);
    setDocModalType(docType);
    setIsDocModalOpen(true);
  };

  const handleOpenViewModal = async (key, name) => {
    setDocModalMode("view");
    setDocModalTitle("Visualizar Documento");
    setDocModalName(name);
    setDocModalUrl(""); // Limpiar vista previa anterior
    setIsDocModalOpen(true);
    const signedUrl = await getSignedFileUrl(key);
    if (signedUrl) {
      setDocModalUrl(signedUrl);
    }
  };

  const handleConfirmUpload = async (file) => {
    setIsUploadingDoc(true);
    try {
      await uploadAndCreateDocument(file, docModalType);
      setIsDocModalOpen(false);
    } catch (err) {
      console.error("Error al subir archivo:", err);
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleDeleteDoc = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este documento?");
    if (confirmed) {
      await deleteDocument(id);
    }
  };

  const renderDocType = (docType, title, description) => {
    const typeDocs = documents.filter((d) => d.documentType === docType);
    const hasFiles = typeDocs.length > 0;

    return (
      <DocTypeRow key={docType}>
        <DocTypeHeader>
          <DocTypeMeta>
            <DocTypeIcon>
              <FileText size={20} />
            </DocTypeIcon>
            <DocTypeInfo>
              <DocTypeTitle>{title}</DocTypeTitle>
              <DocTypeDesc>{description}</DocTypeDesc>
            </DocTypeInfo>
          </DocTypeMeta>

          <UploadButton as="button" type="button" onClick={() => handleOpenUploadModal(docType, title)}>
            <Upload size={15} />
            Añadir archivos
          </UploadButton>
        </DocTypeHeader>

        {hasFiles && (
          <FileItemsContainer>
            {typeDocs.map((doc) => {
              const isPdf = doc.name.toLowerCase().endsWith(".pdf");
              return (
                <FileItem key={doc.id}>
                  <FileItemLeft>
                    {isPdf ? (
                      <FileText size={20} style={{ color: "#e11d48", flexShrink: 0 }} />
                    ) : (
                      <FileImage size={20} style={{ color: "#2563eb", flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>{doc.name}</span>
                  </FileItemLeft>
                  <FileItemRight>
                    <IconButton
                      type="button"
                      onClick={() => handleOpenViewModal(doc.fileUrl, doc.name)}
                      title="Visualizar"
                    >
                      <Eye size={16} />
                    </IconButton>
                    <IconButton
                      type="button"
                      onClick={() => handleDeleteDoc(doc.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </FileItemRight>
                </FileItem>
              );
            })}
          </FileItemsContainer>
        )}
      </DocTypeRow>
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

  const renderEmergencyContacts =
    () => {
      if (contacts.length === 0) {
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
          {contacts.map(
            (contact) => (
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
            )
          )}
        </ContactList>
      );
    };

  return (
    <>
      <TabContentCard>
        <SectionTitle>Hoja de vida e información personal</SectionTitle>
        <AccordionContainer>
          <AccordionHeader
            type="button"
            onClick={() => setIsAccordionExpanded(!isAccordionExpanded)}
            aria-expanded={isAccordionExpanded}
          >
            <AccordionHeaderLeft>
              <FileIcon>
                <FileText size={30} />
              </FileIcon>
              <div>
                <FileTitle style={{ margin: 0 }}>
                  Documentos del empleado
                </FileTitle>
                <FileDescription>
                  Gestiona la documentación personal y de respaldo del empleado.
                </FileDescription>
              </div>
            </AccordionHeaderLeft>

            <AccordionHeaderRight>
              <RegisteredCountBadge>
                {
                  uniqueUploadedCategoriesCount
                }{" "}
                de 4 registrados
              </RegisteredCountBadge>

              {isAccordionExpanded ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </AccordionHeaderRight>
          </AccordionHeader>

          {isAccordionExpanded && (
            <AccordionBody>
              {renderDocType(
                "RESUME",
                "Currículum vitae",
                "Adjunta el CV del empleado en PDF o imagen."
              )}
              {renderDocType(
                "IDENTITY_DOCUMENT",
                "Carnet de identidad",
                "Puedes adjuntar un documento PDF o una imagen del carnet."
              )}
              {renderDocType(
                "CERTIFICATE",
                "Croquis de domicilio",
                "Adjunta el croquis del domicilio en PDF o imagen."
              )}
              {renderDocType(
                "OTHER",
                "Documentos de garantía",
                "Puedes adjuntar varios documentos de garantía en PDF o imagen."
              )}
            </AccordionBody>
          )}
        </AccordionContainer>

        <InformationColumns>
          <InformationSection>
            <SectionTitle>Detalles de contacto</SectionTitle>

            <ContactData>
              <ContactDataItem>
                <MapPin size={27} />
                <ContactDataText>
                  <strong>Dirección</strong>
                  <span>
                    {employee.address || "Sin dirección registrada"}
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

      <DocumentModal
        isOpen={isDocModalOpen}
        mode={docModalMode}
        title={docModalTitle}
        documentUrl={docModalUrl}
        documentName={docModalName}
        onClose={() => setIsDocModalOpen(false)}
        onConfirm={handleConfirmUpload}
        isLoading={isUploadingDoc}
      />
    </>
  );
};

export default PersonalInformation;