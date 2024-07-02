import { useState, useEffect } from "react";
import Details from "./details/details";
import Knowledge from "./knowledge";
import Llm from "./llm/llm";
import Status from "./status/status";
import Test from "./test/test";
import { LlmOption, Bot } from "../../data/types";
import ConfirmationModal from "../../components/confirmationModal";
import { useAgents } from "../../context/botsContext";
import { v4 as uuidv4 } from "uuid";
import "./wizard.css";
import WizardTitle from "./wizardTitle/wizardTitle";
import WizardBottom from "./wizardBottom/wizardBottom";
import Face from "./face/face";
import Voice from "./voice/voice";

interface WizardProps {
  showList: () => void;
  botToEdit?: Bot | null; // Optional prop for bot to edit
  setShowWizard: React.Dispatch<React.SetStateAction<boolean>>; // New prop for controlling wizard visibility
}

const Wizard: React.FC<WizardProps> = ({ showList, botToEdit, setShowWizard }) => {
  const { addToMyAgent, updateAgent } = useAgents(); // Use updateAgent
  const [currentStep, setCurrentStep] = useState(0);
  const [newBot, setNewBot] = useState<Bot>({
    id: uuidv4(),
    name: "",
    description: "",
    img: "",
    llm: { id: uuidv4(), name: "", image: "" },
    files: [],
    status: "",
    voice: { id: "", name: "", imageURL: "", videoURL: "" },
    face: { id: "", name: "", imageURL: "", videoURL: "" },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (botToEdit) {
      setNewBot(botToEdit); // Load data from botToEdit if provided
    }
  }, [botToEdit]);

  const steps = [
    <Details key="details" bot={newBot} setBot={setNewBot} />,
    <Llm
      key="llm"
      onSelect={(llmOption: LlmOption) =>
        setNewBot({ ...newBot, llm: llmOption })
      }
      selectedLlmOption={newBot.llm}
    />,
    <Knowledge key="knowledge" bot={newBot} setBot={setNewBot} />,
    <Face key="face" bot={newBot} setBot={setNewBot} />,
    <Voice key="voice" bot={newBot} setBot={setNewBot} />,
    <Test key="test" />,
    <Status key="status" bot={newBot} setBot={setNewBot} />,
  ];

  const handleNext = () => {
    console.log("currentStep", currentStep);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
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

  const handleConfirmCancel = () => {
    setIsModalOpen(false);
    setShowWizard(false); // Ensure to update this state to close the wizard
    showList();
  };

  const handleDeploy = () => {
    if (botToEdit) {
      updateAgent(newBot); // Update existing bot
    } else {
      addToMyAgent(newBot); // Add new bot
    }
    setShowWizard(false); // Ensure to update this state to close the wizard
    showList();
  };

  return (
    <div className="wizard-container">
      <WizardTitle currentStep={currentStep} />
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
    </div>
  );
};

export default Wizard;
