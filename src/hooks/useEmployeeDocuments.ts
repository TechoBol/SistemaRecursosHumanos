import { useState, useEffect, useCallback } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
  getEmployeeDocumentsApi,
  createEmployeeDocumentApi,
  deleteEmployeeDocumentApi,
} from "../services/EmployeeDocumentService";
import { useAmazonS3 } from "./useAmazonS3";

type DocumentType =
  | "RESUME"
  | "IDENTITY_DOCUMENT"
  | "CERTIFICATE"
  | "OTHER";

export const useEmployeeDocuments = (employeeId: number, employeeCi?: string) => {
  const { token, isLoggedIn } = useLoginStore();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { uploadEmployeeDocument, getFileUrl } = useAmazonS3();

  const fetchDocuments = useCallback(async () => {
    if (!isLoggedIn || !token || !employeeId) return;

    setIsLoading(true);

    try {
      const data = await getEmployeeDocumentsApi(token, employeeId);
      if (data) {
        setDocuments(data);
      }
    } catch (error) {
      console.error("Error en useEmployeeDocuments al obtener documentos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn, employeeId]);

  const validateFile = (file: File, documentType: DocumentType) => {
    const isPdf = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");

    if (!isPdf && !isImage) {
      throw new Error("El archivo debe ser un PDF o una imagen.");
    }
  };

  const getFolderByDocumentType = (
    documentType: DocumentType
  ): "CV" | "CI" | "CROQUIS" | "GARANTIA" => {
    switch (documentType) {
      case "RESUME":
        return "CV";
      case "IDENTITY_DOCUMENT":
        return "CI";
      case "CERTIFICATE":
        return "CROQUIS";
      case "OTHER":
        return "GARANTIA";
      default:
        throw new Error("Tipo de documento no válido.");
    }
  };

  const uploadAndCreateDocument = async (file: File, documentType: DocumentType) => {
    if (!token || !employeeId) return null;
    setIsLoading(true);
    try {
      // 1. Validar tipo de archivo
      validateFile(file, documentType);
      // 2. Determinar carpeta
      const folder = getFolderByDocumentType(documentType);
      // 3. Determinar CI limpia como identificador
      const cleanCi = String(employeeCi || employeeId).trim().replace(/\s+/g, "_");
      // 4. Subir a S3
      const key = await uploadEmployeeDocument(file, cleanCi, folder);
      // 5. Guardar referencia en BD
      const response = await createEmployeeDocumentApi(token, employeeId, {
        documentType,
        name: file.name,
        fileUrl: key,
      });
      // 6. Refrescar documentos
      if (response) {
        await fetchDocuments();
        return response;
      }
      return null;
    } catch (error) {
      console.error("Error en useEmployeeDocuments al subir documento:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getSignedFileUrl = async (key: string) => {
    if (!key) return null;
    try {
      return await getFileUrl(key);
    } catch (error) {
      console.error("Error al obtener URL del documento:", error);
      return null;
    }
  };

  const deleteDocument = async (id: number) => {
    if (!token) return false;
    setIsLoading(true);
    try {
      const response = await deleteEmployeeDocumentApi(token, id);
      if (response) {
        await fetchDocuments();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en useEmployeeDocuments al eliminar documento:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    isLoading,
    fetchDocuments,
    uploadAndCreateDocument,
    getSignedFileUrl,
    deleteDocument,
  };
};