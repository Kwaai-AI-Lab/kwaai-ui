import React, { useEffect } from "react";
import { Persona, Voices } from "../../../data/types";
import OptionSelect from "../optionSelect/optionSelect";
import PersonasService from "../../../services/personas.service";
import "./voice.css";

interface VoiceProps {
  bot: Persona;
  setBot: React.Dispatch<React.SetStateAction<Persona>>;
}

const Voice: React.FC<VoiceProps> = ({ bot, setBot }) => {
  const [voiceList, setVoiceList] = React.useState<Voices[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = React.useState<string | null>(
    bot.voice_id || null
  );
  const selectedVoice = voiceList.find((voice) => voice.id === selectedVoiceId);
  const [audio, setAudio] = React.useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const personasService = new PersonasService();
        const voices = await personasService.getVoices();

        const transformedVoices = voices.slice(0, 4).map((voice: any) => ({
          id: voice.id,
          name: voice.name,
          imageURL: voice.image_url,
          sampleURL: voice.sample_url,
          videoURL: "",
        }));

        setVoiceList(transformedVoices);
        console.log("First 4 Voices fetched and transformed:", transformedVoices);
      } catch (error) {
        console.error("Error fetching voices:", error);
      }
    };

    fetchData();
  }, [bot.id]);

  const handleSelect = (voice: Voices) => {
    setSelectedVoiceId(voice.id);
    setBot((prevBot) => ({ ...prevBot, voice_id: voice.id }));

    if (voice.sampleURL) {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      const newAudio = new Audio(voice.sampleURL);
      setAudio(newAudio);
      newAudio.play().catch((error) => console.error("Error playing audio:", error));
    }
  };

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
        ))}
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
                <img src="/voice-icon.png" alt="Voice Icon" className="voice-icon" />
              </div>
            )
          ) : null}
          {selectedVoice && <p className="selected-voice-text">{selectedVoice.name}</p>}
        </div>
      </div>
    </div>
  );
};

export default Voice;
