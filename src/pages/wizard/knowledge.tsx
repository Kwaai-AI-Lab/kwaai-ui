import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import downloadIcon from "../../assets/download-icon.png";
import { AssistantFile} from "../../data/types";
import AssistantsService from "../../services/assistants.service";
import "./knowledge.css";

interface KnowledgeProps {
  onFilesChange: (files: File[]) => void;
  assistantId: string | undefined;
}

const Knowledge: React.FC<KnowledgeProps> = ({ onFilesChange, assistantId }) => {
  const [localfiles, setLocalFiles] = useState<File[]>([]);
  const [allFiles, setAllFiles] = useState<AssistantFile[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {

       // Map the dropped files to AssistantFile objects
      const newAssistantFiles: AssistantFile[] = acceptedFiles.map((file) => ({
        name: file.name,
        num_chunks: null, // or set it to an empty string or null as per your requirement
        id: '' // ID is empty for local files, as these have not been uploaded yet
      }));

      // Push the new AssistantFiles to allFiles state
      const updatedAllFiles = [...allFiles, ...newAssistantFiles];
      setAllFiles(updatedAllFiles);

      const newFiles = [...localfiles, ...acceptedFiles];
      setLocalFiles(newFiles);
      onFilesChange(newFiles);
    },
    [localfiles, onFilesChange, allFiles]
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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    }
  });

  const handleRemoveFile = async (index: number) => {
    const fileToRemove = allFiles[index];
  
    const updateFileLists = () => {
      const newAllFiles = allFiles.filter((file) => file.id !== fileToRemove.id);
      setAllFiles(newAllFiles);
  
      const newLocalFiles = localfiles.filter((file) => file.name !== fileToRemove.name);
      setLocalFiles(newLocalFiles);
      onFilesChange(newLocalFiles);
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
