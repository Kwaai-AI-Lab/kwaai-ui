import { useState, useEffect } from "react";
import Details from "./details/details";
import { Persona } from "../../data/types";
import ConfirmationModal from "../../components/confirmationModal";
import ContinueModal from "../../components/continueModal";
import { v4 as uuidv4 } from "uuid";
import "./wizard.css";
import PersonaTitle from "./wizardTitle/personasTitle";
import WizardBottom from "./wizardBottom/wizardBottom";
import Face from "./face/face";
import PersonasService from "../../services/personas.service";
import { AgentViewType } from "../../context/botsContext";
import Voice from "./voice/voice"; 

interface WizardProps {
  showList: () => void;
  botToEdit?: Persona | null;
  setShowWizard: React.Dispatch<React.SetStateAction<boolean>>;
  viewType: AgentViewType;
}

const PersonasWizard: React.FC<WizardProps> = ({ viewType, showList, botToEdit, setShowWizard }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newBot, setNewBot] = useState<Persona>({
    id: botToEdit ? botToEdit.id : uuidv4(),
    name: "",
    description: "",
    voice_id: "",
    face_id: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContinueModalOpen, setIsContinueModalOpen] = useState(false);

  useEffect(() => {
    console.log("You're in the useEffect");
    if (botToEdit) {
      console.log("You're in the botToEdit useEffect");
      setNewBot(botToEdit);
      setIsUpdateMode(true);
    }
  }, [botToEdit]);

  const steps = [
    <Details key="details" bot={newBot} setBot={setNewBot} errors={errors} viewType={viewType} />,
    <Face key="persona" bot={newBot} setBot={setNewBot} errors={errors} />,
    <Voice key="voice" bot={newBot} setBot={setNewBot} errors={errors} />,
  ];

  const validateFields = (): boolean => {
    let newErrors: { [key: string]: string } = {};

    if (currentStep === 0) {
      if (!newBot.name.trim()) {
        newErrors.name = "Name is required";
      }
      if (!newBot.description.trim()) {
        newErrors.description = "Description is required";
      }
    } else if (currentStep === 1) {
      if (!newBot.face_id) {
        newErrors.face_id = "Face selection is required";
      }
    } 
    else if (currentStep === 2) {
      if (!newBot.voice_id) {
        newErrors.voice_id = "Voice selection is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      let response: Persona;

      if (currentStep === 2) {
        setNewBot((prevBot) => ({
          ...prevBot,
          ...response,
        }));
      } else if (currentStep === 3 && !isUpdateMode) {
        setNewBot((prevBot) => ({
          ...prevBot,
          ...response,
        }));
        setIsContinueModalOpen(true);
      } else if (isUpdateMode && currentStep === 3) {
        setNewBot((prevBot) => ({
          ...prevBot,
          ...response,
        }));
      }

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error("Error creating or updating assistant:", error);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!isUpdateMode) {
      try {
        const personasService = new PersonasService();
        await personasService.deletePersona(newBot.id || "");
      } catch (error) {
        console.error("Error deleting assistant:", error);
      }
    }
    setIsModalOpen(false);
    setShowWizard(false);
    showList();
  };

  const handleContinue = () => {
    setIsContinueModalOpen(false);
    setCurrentStep(currentStep + 1);
  };

  const resetBot = () => {
    setNewBot({
      id: uuidv4(),
      name: "",
      description: "",
      voice_id: "",
      face_id: "",
    });
    setIsUpdateMode(false);
    setCurrentStep(0);
  };

  const handleDeploy = async () => {
    if (!isUpdateMode) {
      try {
        const personasService = new PersonasService();
        const { id, ...personaData } = newBot;
        await personasService.createPersona(personaData);
      } catch (error) {
        console.error("Error creating or updating assistant:", error);
      }
    } else {
      try {
        const personasService = new PersonasService();
        await personasService.updatePersona(newBot.id || "", {
          name: newBot.name,
          description: newBot.description,
          voice_id: newBot.voice_id,
          face_id: newBot.face_id,
        });
      } catch (error) {
        console.error("Error creating or updating assistant:", error);
      }
    }
    resetBot();
    setShowWizard(false);
    showList();
  };

  return (
    <div className="wizard-container">
      <PersonaTitle currentStep={currentStep} />
      <div className="sections-container">
        <div className="right-section-wizard">{steps[currentStep]}</div>
      </div>
      <div className="buttons-container">
        <WizardBottom
          currentStep={currentStep}
          totalSteps={steps.length}
          onBack={handleBack}
          onNext={handleNext}
          onCancel={handleCancel}
          onDeploy={handleDeploy}
        />
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />

      <ContinueModal
        isOpen={isContinueModalOpen}
        onRequestClose={() => setIsContinueModalOpen(false)}
        onConfirm={handleContinue}
      />
    </div>
  );
};

export default PersonasWizard;
