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
import Persona from "./persona/persona";
import AssistantsService from "../../services/assistants.service";

interface WizardProps {
  showList: () => void;
  botToEdit?: Bot | null;
  setShowWizard: React.Dispatch<React.SetStateAction<boolean>>;
}

const Wizard: React.FC<WizardProps> = ({ showList, botToEdit, setShowWizard }) => {
  const { addToMyAgent, updateAgent } = useAgents();
  const [currentStep, setCurrentStep] = useState(0);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newBot, setNewBot] = useState<Bot>({
    id: botToEdit ? botToEdit.id : uuidv4(),
    name: "",
    description: "",
    uri: "",
    resource_llm_id: "",
    persona_id: "",
    files: [],
    status: "public",
    allow_edit: "True",
    kind: "assistant",
    icon: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (botToEdit) {
      setNewBot(botToEdit);
      setIsUpdateMode(true);
    }
  }, [botToEdit]);

  const steps = [
    <Details key="details" bot={newBot} setBot={setNewBot} errors={errors} />,
    <Persona key="persona" bot={newBot} setBot={setNewBot} errors={errors} />,
    <Llm
      key="llm"
      onSelect={(llmOption: LlmOption) =>
        setNewBot({ ...newBot, resource_llm_id: llmOption.id })
      }
      selectedLlmOption={{ id: newBot.resource_llm_id, name: newBot.name, image: "" }}
      errors={errors}
    />,
    <Knowledge key="knowledge" bot={newBot} setBot={setNewBot} />,
    <Test key="test" />,
    <Status key="status" bot={newBot} setBot={setNewBot} />,
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
      if (!newBot.persona_id) {
        newErrors.persona_id = "Persona selection is required";
      }
    } else if (currentStep === 2) {
      if (!newBot.resource_llm_id) {
        newErrors.resource_llm_id = "LLM selection is required";
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
      const assistantsService = new AssistantsService();
      let response: Bot;

      if (currentStep === 2 && !isUpdateMode) {
        response = await assistantsService.createAssistant(
          newBot.name,
          newBot.description,
          newBot.kind,
          {
            uri: newBot.uri,
            resource_llm_id: newBot.resource_llm_id,
            persona_id: newBot.persona_id,
            files: newBot.files,
            status: newBot.status,
            allow_edit: newBot.allow_edit ? "True" : "False",
            icon: newBot.icon,
          }
        );
        setNewBot((prevBot) => ({
          ...prevBot,
          ...response,
        }));
        setIsUpdateMode(true);
      } else if (isUpdateMode) {
        response = await assistantsService.updateAssistant(
          newBot.id || "",
          {
            name: newBot.name,
            description: newBot.description,
            uri: newBot.uri,
            resource_llm_id: newBot.resource_llm_id,
            persona_id: newBot.persona_id,
            files: newBot.files,
            status: newBot.status,
            allow_edit: newBot.allow_edit ? "True" : "False",
            kind: newBot.kind,
            icon: newBot.icon || "",
          }
        );
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
    if (currentStep === 0 && isUpdateMode) {
      try {
        const assistantsService = new AssistantsService();
        await assistantsService.deleteAssistant(newBot.id || "");
      } catch (error) {
        console.error("Error deleting assistant:", error);
      }
    }
    setIsModalOpen(false);
    setShowWizard(false);
    showList();
  };

  const handleDeploy = () => {
    if (isUpdateMode) {
      updateAgent(newBot);
    } else {
      addToMyAgent(newBot);
    }
    setShowWizard(false);
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
