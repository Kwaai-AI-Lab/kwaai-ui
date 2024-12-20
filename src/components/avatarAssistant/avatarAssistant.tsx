import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';

interface AvatarAssistantProps {
    personaImageUrl: string;
    toggleMuteHandler: () => void;
    isMuted: boolean;
}

const AvatarAssistant: React.FC<AvatarAssistantProps> = ({ personaImageUrl, toggleMuteHandler, isMuted }) => {

return(
    <div className="imageContainer">
            <img src={personaImageUrl} alt="Bot" className="botImage" />
            <button onClick={toggleMuteHandler} className="muteButton">
              <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} className="muteIcon" />
            </button>
          </div>
          );
}

export default AvatarAssistant;