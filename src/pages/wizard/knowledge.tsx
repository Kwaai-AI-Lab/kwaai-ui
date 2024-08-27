import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import downloadIcon from "../../assets/download-icon.png";
import "./knowledge.css";

interface KnowledgeProps {
  onFilesChange: (files: File[]) => void;
}

const Knowledge: React.FC<KnowledgeProps> = ({ onFilesChange }) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);
      onFilesChange(newFiles);
    },
    [files, onFilesChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    }
  });

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
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
          {files.map((file: File, index: number) => (
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
