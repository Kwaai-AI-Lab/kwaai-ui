import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import downloadIcon from "../../assets/download-icon.png";
import { AssistantFile } from "../../data/types";
import AssistantsService from "../../services/assistants.service";
import fileIcon from "../../assets/file-icon.png";
import "./knowledge.css";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface KnowledgeProps {
  onFilesChange: (files: File[]) => void;
  assistantId: string | undefined;
  onFilesAdded: (isIndexing: boolean) => void;
  buttonState: string;
}

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '50px',
  borderWidth: 2,
  borderRadius: 10,
  borderColor: '#007bff',
  borderStyle: 'dashed',
  background: 'linear-gradient(180deg, #EDF4FF 0%, #D4E5FF 100%)',
  color: 'black',
  fontWeight: 'bold',
  fontSize: '20px',
  transition: 'border .24s ease-in-out',
  width: '100%',
  maxWidth: '704px',
  height: '287px',
  cursor: 'pointer'
};

const focusedStyle = {
  borderColor: '#045CE2',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

const Knowledge: React.FC<KnowledgeProps> = ({
  onFilesChange,
  assistantId,
  onFilesAdded,
  buttonState,
}) => {
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [allFiles, setAllFiles] = useState<AssistantFile[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      if (acceptedFiles.length > 0) {
        onFilesAdded(true);
      }

      if (fileRejections.length > 0) {
        const firstError = fileRejections[0]?.errors[0];
        toast.error(firstError?.message || "File rejected");
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

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    validator: duplicateNameValidator,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const handleRemoveFile = async (fileToRemove: AssistantFile) => {
    const removeLocalFile = () => {
      const updatedLocalFiles = localFiles.filter((file) => file.name !== fileToRemove.name);
      setAllFiles((prevFiles) =>
        prevFiles.filter((file) => file.name !== fileToRemove.name)
      );
      setLocalFiles(updatedLocalFiles);
      onFilesChange(updatedLocalFiles);

      if (updatedLocalFiles.length === 0) {
        onFilesAdded(false);
      }
    };

    if (fileToRemove.id) {
      try {
        const assistantsService = new AssistantsService();
        await assistantsService.deleteFiles(assistantId!, [fileToRemove.id]);
        removeLocalFile();
      } catch (error) {
        toast.error("Error deleting file");
      }
    } else {
      removeLocalFile();
    }
  };

  const renderFilesByStatus = (status: string, title: string) => {
    const filesByStatus = allFiles.filter(
      (file) => file.indexing_status === status
    );

    if (filesByStatus.length === 0) return null;

    return (
      <div className="file-group">
        <h3>{title}</h3>
        <ul>
          {filesByStatus.map((file) => (
            <li key={file.name} className="file-item">
              <img src={fileIcon} alt="File Icon" className="file-icon" />
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <div className="spinner-bar-container">
                  <div
                    className={`spinner-bar ${
                      file.indexing_status === "done" ? "spinner-bar-done" : ""
                    }`}
                    style={{
                      animation:
                        file.indexing_status === "Uploading"
                          ? "loading 1.5s infinite ease-in-out"
                          : "none",
                      width: file.indexing_status === "done" ? "100%" : "0%",
                    }}
                  ></div>
                </div>
                <span className="file-status">
                  {capitalizeFirstLetter(file.indexing_status)}
                </span>
              </div>
              <button
                className="remove-file-button"
                onClick={() => handleRemoveFile(file)}
                disabled={
                  file.indexing_status !== "done" &&
                  file.indexing_status !== "To upload"
                }
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="details-container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <img src={downloadIcon} alt="Download Icon" className="download-icon" />
        <p>Drag & Drop files here</p>
        <div className="browse-text">
          <span>or</span>
          <span className="browse-link">browse</span>
        </div>
      </div>
      <aside className="file-list">
        {renderFilesByStatus("To upload", "To Upload")}
        {renderFilesByStatus("Uploading", "Uploading")}
        {renderFilesByStatus("done", "Uploaded")}
      </aside>
      <ToastContainer />
    </div>
  );
};

export default Knowledge;
