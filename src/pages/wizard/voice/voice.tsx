import React from "react";
import { Persona, Voices } from "../../../data/types";
import OptionSelect from "../optionSelect/optionSelect";
import voiceIcon from "../../../assets/voice-icon.png";
import VoiceList from "../../../assets/voices.json";
import "./voice.css";

interface VoiceProps {
  bot: Persona;
  setBot: React.Dispatch<React.SetStateAction<Persona>>;
}

const Voice: React.FC<VoiceProps> = ({ bot, setBot }) => {
  const voiceList = VoiceList;
  const [selectedVoiceId, setSelectedVoiceId] = React.useState<string | null>(
    bot.voice_id || null
  );
  const selectedVoice = voiceList.find((voice) => voice.id === selectedVoiceId);

  const handleSelect = (voice: Voices) => {
    setSelectedVoiceId(voice.id);
    setBot((prevBot) => ({ ...prevBot, voice }));
  }

  return (
    <div className="voice-container">
      <div className="voice-left-container">
        {voiceList.map((voice) => (
          <OptionSelect
            key={voice.id}
            feature={voice}
            isSelected={voice.id === selectedVoiceId}
            onSelect={() => handleSelect(voice)}
          />
        ))
        }
      </div>

      <div className="voice-right-container">
        <div className="voice-preview-container">
          {selectedVoice ? (
            selectedVoice.imageURL ? (
              <img
                src={selectedVoice.imageURL}
                alt={selectedVoice.name}
                className="selected-voice-image"
              />
            ) : (
              <div className="voice-placeholder">
                <img src={voiceIcon} alt="Voice Icon" className="voice-icon" />
              </div>
            )
          ) : null}
          {selectedVoice && <p className="selected-voice-text">{selectedVoice.name}</p>}
        </div>
      </div>
    </div>
  );
}

export default Voice;
