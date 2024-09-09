import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import downloadIcon from "../../assets/download-icon.png";
import { AssistantFile} from "../../data/types";
import AssistantsService from "../../services/assistants.service";
import "./knowledge.css";

interface KnowledgeProps {
  onFilesChange: (files: File[]) => void;
  assistantId: string | undefined;
  onFilesAdded: (isIndexig:boolean) => void;
}

const Knowledge: React.FC<KnowledgeProps> = ({ onFilesChange, assistantId, onFilesAdded }) => {
  const [localfiles, setLocalFiles] = useState<File[]>([]);
  const [allFiles, setAllFiles] = useState<AssistantFile[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
 
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      if (acceptedFiles.length > 0) {
        onFilesAdded(true); // Trigger the prop when files are added
      }
      if (fileRejections.length > 0) {
        const firstError = fileRejections[0].errors[0];
        setErrorMessage(firstError.message);
      } else {
        setErrorMessage(null);
      }

      const newAssistantFiles: AssistantFile[] = acceptedFiles.map((file) => ({
        name: file.name,
        num_chunks: null,
        id: ""
      }));

      const updatedAllFiles = [...allFiles, ...newAssistantFiles];
      setAllFiles(updatedAllFiles);

      const newFiles = [...localfiles, ...acceptedFiles];
      setLocalFiles(newFiles);
      onFilesChange(newFiles);
    },
    [localfiles, onFilesChange, allFiles, onFilesAdded]
  );

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        console.log("fetching Files assistanId = " + assistantId);
        const assistantsService = new AssistantsService();
        if (!assistantId) {
          return;
        }
        const filesFromServer = await assistantsService.getFiles(assistantId);
        console.log("filesFromServer = " + filesFromServer);
        setAllFiles(filesFromServer);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [assistantId]);

  function duplicateNameValidator(file: File) {
    const isDuplicate = allFiles.some(existingFile => existingFile.name === file.name);
    if (isDuplicate) {
      console.log(`File with name "${file.name}" already exists.`);
      return {
        code: "name-duplicate",
        message: `File with name "${file.name}" already exists.`
      };
    }
    return null;
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"]
    },
    validator: duplicateNameValidator
  });

  const handleRemoveFile = async (index: number) => {
    const fileToRemove = allFiles[index];
  
    const updateFileLists = () => {
      const newAllFiles = allFiles.filter((file) => file.id !== fileToRemove.id);
      setAllFiles(newAllFiles);
  
      const newLocalFiles = localfiles.filter((file) => file.name !== fileToRemove.name);
      setLocalFiles(newLocalFiles);
      onFilesChange(newLocalFiles);

      console.log("All files length = ", allFiles.length);

      if(newAllFiles.length === 0){
        onFilesAdded(false);
      }
    };

  
    if (fileToRemove.id) {
      // If the file has an ID, it exists on the server, so we delete it
      try {
        const assistantsService = new AssistantsService();
        await assistantsService.deleteFiles(assistantId!, [fileToRemove.id]);
        console.log("File deleted from server:", fileToRemove.id);
  
        // Update files list
        updateFileLists();
      } catch (error) {
        console.error("Error deleting file from server:", error);
      }
    } else {
      console.log("Try to remove file locally with name =", fileToRemove.name);
      // If the file has no ID, it's a local file that needs to be removed by matching the name
      updateFileLists();
      console.log("Local file removed:", fileToRemove.name);
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
          {allFiles.map((file: AssistantFile, index: number) => (
              <li key={index} className="file-item">
                {file.name}
                <button
                  className="remove-file-button"
                  onClick={() => handleRemoveFile(index)}
                >
                  Remove
                </button>
              </li>
            ))}
        </ul>
      </aside>
    </div>
  );
}

export default Knowledge;
