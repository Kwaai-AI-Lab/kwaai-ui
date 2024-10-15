import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import downloadIcon from "../../assets/download-icon.png";
import { AssistantFile } from "../../data/types";
import AssistantsService from "../../services/assistants.service";
import "./knowledge.css";

interface KnowledgeProps {
  onFilesChange: (files: File[]) => void;
  assistantId: string | undefined;
  onFilesAdded: (isIndexing: boolean) => void;
  buttonState: string;
}

const Knowledge: React.FC<KnowledgeProps> = ({
  onFilesChange,
  assistantId,
  onFilesAdded,
  buttonState,
}) => {
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [allFiles, setAllFiles] = useState<AssistantFile[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      if (acceptedFiles.length > 0) {
        onFilesAdded(true);
      }

      if (fileRejections.length > 0) {
        const firstError = fileRejections[0]?.errors[0];
        setErrorMessage(firstError?.message || "File rejected");
      } else {
        setErrorMessage(null);
      }

      const newAssistantFiles: AssistantFile[] = acceptedFiles.map((file) => ({
        name: file.name,
        num_chunks: null,
        id: "",
        file_id: "",
        indexing_status: "To upload",
      }));

      setAllFiles((prevAllFiles) => [...prevAllFiles, ...newAssistantFiles]);
      const newFiles = [...localFiles, ...acceptedFiles];
      setLocalFiles(newFiles);
      onFilesChange(newFiles);
    },
    [localFiles, onFilesChange, onFilesAdded]
  );

  useEffect(() => {
    const updateIndexingStatus = (fromStatus: string, toStatus: string) => {
      setAllFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.indexing_status === fromStatus
            ? { ...file, indexing_status: toStatus }
            : file
        )
      );
    };

    if (buttonState === "Uploading") {
      updateIndexingStatus("To upload", "Uploading");
    } else if (buttonState === "Done") {
      updateIndexingStatus("Uploading", "Done");
    }
  }, [buttonState]);

  const fetchFiles = useCallback(async () => {
    if (!assistantId) return;

    try {
      const assistantsService = new AssistantsService();
      const filesFromServer = await assistantsService.getFiles(assistantId);
      setLocalFiles([]);
      onFilesChange([]);
      setAllFiles(filesFromServer);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  }, [assistantId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  useEffect(() => {
    if (buttonState === "Done") {
      fetchFiles();
    }
  }, [buttonState, fetchFiles]);

  const capitalizeFirstLetter = (str: string): string =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

  const duplicateNameValidator = (file: File) => {
    const isDuplicate = allFiles.some(
      (existingFile) => existingFile.name === file.name
    );
    if (isDuplicate) {
      return {
        code: "name-duplicate",
        message: `File with name "${file.name}" already exists.`,
      };
    }
    return null;
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    validator: duplicateNameValidator,
  });

  const handleRemoveFile = async (index: number) => {
    const fileToRemove = allFiles[index];
    const removeLocalFile = () => {
      setAllFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
      setLocalFiles((prevLocalFiles) =>
        prevLocalFiles.filter((file) => file.name !== fileToRemove.name)
      );
      onFilesChange(
        localFiles.filter((file) => file.name !== fileToRemove.name)
      );
      if (allFiles.length - 1 === 0) {
        onFilesAdded(false);
      }
    };

    console.log("fileToRemove", fileToRemove.id);
    if (fileToRemove.id) {
      try {
        const assistantsService = new AssistantsService();
        await assistantsService.deleteFiles(assistantId!, [
          fileToRemove.id,
        ]);
        removeLocalFile();
      } catch (error) {
        console.error("Error deleting file from server:", error);
      }
    } else {
      removeLocalFile();
    }
  };

  return (
    <div className="details-container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <img src={downloadIcon} alt="Download Icon" className="download-icon" />
        <p>Drag & Drop files here</p>
        <div className="browse-text">
          <span>or</span>
          <span className="browse-link">Browse</span>
        </div>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <aside className="file-list">
        <ul>
          {allFiles.map((file, index) => (
            <li key={index} className="file-item">
              {file.name}
              <button
                className="remove-file-button"
                onClick={() => handleRemoveFile(index)}
              >
                Remove
              </button>
              <span
                className={
                  file.indexing_status === "Uploading" ? "animate-charcter" : ""
                }
              >
            {file.indexing_status === "Uploading" ? "Uploading..." : capitalizeFirstLetter(file.indexing_status)}
            </span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );  
}
  
export default Knowledge;
