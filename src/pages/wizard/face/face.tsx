import React from "react";
import facesList from "../../../assets/faces.json";
import "./face.css";
import OptionSelect from "../optionSelect/optionSelect";
import type { Persona, Face } from "../../../data/types";

interface FaceProps {
  bot: Persona;
  setBot: React.Dispatch<React.SetStateAction<Persona>>;
}

const Faces: React.FC<FaceProps> = ({ bot, setBot }) => {
    const faceList = facesList;
    console.log("faceList",faceList);
    const [selectedFaceId, setSelectedFaceId] = React.useState<string | null>(
        bot.face_id || null
    );
  
  const selectedFace = faceList.find((face) => face.id === selectedFaceId);

  const handleSelect = (face: Face) => {
    setSelectedFaceId(face.id);
    setBot((prevBot) => ({ ...prevBot, face_id: face.id }));
  };

  return (
    <div className="face-container">
      <div className="face-left-container">
        {faceList.map((face) => (
          <OptionSelect
            key={face.id}
            feature={face}
            isSelected={face.id === selectedFaceId}
            onSelect={() => handleSelect(face)}
          />
        ))}
      </div>
      <div className="face-right-container">
        <div className="face-preview-container">
          {selectedFace && (
            <>
              <img
                src={selectedFace.imageURL}
                alt={selectedFace.name}
                className="selected-face-image"
              />
              <p className="selected-face-text">{selectedFace.name}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Faces;
