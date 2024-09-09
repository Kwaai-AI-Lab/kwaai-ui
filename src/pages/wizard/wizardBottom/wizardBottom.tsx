import React from "react";
import PrimaryButton from "../../../components/buttons/primaryButton/primaryButton";
import "./wizardBottom.css";
import SecondaryButton from "../../../components/buttons/secondaryButton/secondaryButton";

interface WizardBottomProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  onDeploy: () => void;
  onIndexing: () => void;
  isIndexing: boolean;
  isIndexingMode: boolean;
}

const WizardBottom: React.FC<WizardBottomProps> = ({ currentStep, totalSteps, onBack, onNext, onCancel, onDeploy, onIndexing, isIndexingMode, isIndexing }) => {
  return (
    <div className="wizard-bottom-container">
      {currentStep > 0 && <SecondaryButton text="Back" onClick={onBack} enabled={true} />}
      {currentStep === 0 && <SecondaryButton text="Cancel" onClick={onCancel} enabled={true} />}
      <PrimaryButton
        text={isIndexingMode ? "Index" : currentStep === totalSteps - 1 ? "Deploy" : "Continue"}
        onClick={isIndexingMode ? onIndexing : currentStep === totalSteps - 1 ? onDeploy : onNext}
        enabled={!isIndexing}
      />
    </div>
  );
}

export default WizardBottom;
