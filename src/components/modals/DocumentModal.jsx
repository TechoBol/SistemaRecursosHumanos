import { useEffect, useState } from "react";
import { X, Upload, FileText, AlertTriangle } from "lucide-react";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalContent,
  DropZone,
  PreviewWrapper,
  PreviewHeader,
  PreviewFrame,
  ModalActions,
  CancelButton,
  PrimaryButton,
} from "../ui/Modal.styles";

const DocumentModal = ({
  isOpen,
  mode = "upload", // "upload" | "view"
  title = "Documento",
  documentUrl = "",
  documentName = "",
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Revocar URL de objeto al cambiar de archivo o cerrar
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPreviewUrl("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleConfirm = () => {
    if (selectedFile && onConfirm) {
      onConfirm(selectedFile);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isPdfFile = (fileName) => {
    return String(fileName || "").toLowerCase().endsWith(".pdf");
  };

  const isImageFile = (fileName) => {
    const name = String(fileName || "").toLowerCase();
    return (
      name.endsWith(".jpg") ||
      name.endsWith(".jpeg") ||
      name.endsWith(".png") ||
      name.endsWith(".gif") ||
      name.endsWith(".webp")
    );
  };

  const getMimeType = (file) => {
    if (!file) return "";
    return file.type;
  };

  return (
    <ModalOverlay onMouseDown={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalCloseButton type="button" onClick={onClose} aria-label="Cerrar modal">
            <X size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalContent>
          {mode === "upload" ? (
            <>
              {!selectedFile ? (
                <DropZone>
                  <Upload size={32} />
                  <span>Haz clic para seleccionar un archivo</span>
                  <p>Formatos permitidos: PDF, PNG, JPG, JPEG</p>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={handleFileChange}
                  />
                </DropZone>
              ) : (
                previewUrl && (
                  <PreviewWrapper>
                    <PreviewHeader>
                      <span>{selectedFile.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl("");
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#ff4d4f",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "4px",
                            borderRadius: "4px",
                          }}
                          title="Quitar archivo"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </PreviewHeader>
                    <PreviewFrame>
                      {getMimeType(selectedFile) === "application/pdf" ? (
                        <iframe src={previewUrl} title="PDF Preview" />
                      ) : getMimeType(selectedFile).startsWith("image/") ? (
                        <img src={previewUrl} alt="Vista previa de imagen" />
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "40px" }}>
                          <FileText size={48} style={{ color: "#666" }} />
                          <span style={{ fontSize: "14px" }}>No se puede previsualizar este tipo de archivo</span>
                        </div>
                      )}
                    </PreviewFrame>
                  </PreviewWrapper>
                )
              )}
            </>
          ) : (
            /* Modo visualización */
            <PreviewWrapper style={{ marginTop: 0 }}>
              <PreviewHeader>
                <span>{documentName}</span>
              </PreviewHeader>
              <PreviewFrame>
                {documentUrl ? (
                  isPdfFile(documentName) ? (
                    <iframe src={documentUrl} title="PDF Viewer" />
                  ) : isImageFile(documentName) ? (
                    <img src={documentUrl} alt="Documento cargado" />
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "40px" }}>
                      <AlertTriangle size={48} style={{ color: "#f59e0b" }} />
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>
                        Este archivo no puede visualizarse directamente. Puedes descargarlo en su lugar.
                      </span>
                    </div>
                  )
                ) : (
                  <div style={{ padding: "40px", textAlign: "center" }}>Cargando previsualización...</div>
                )}
              </PreviewFrame>
            </PreviewWrapper>
          )}
        </ModalContent>

        <ModalActions>
          <CancelButton type="button" onClick={onClose} disabled={isLoading}>
            {mode === "upload" ? "Cancelar" : "Cerrar"}
          </CancelButton>
          {mode === "upload" && (
            <PrimaryButton
              type="button"
              onClick={handleConfirm}
              disabled={isLoading || !selectedFile}
            >
              {isLoading ? "Subiendo..." : "Subir archivo"}
            </PrimaryButton>
          )}
        </ModalActions>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default DocumentModal;
