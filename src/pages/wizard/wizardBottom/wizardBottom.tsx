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
}

const WizardBottom: React.FC<WizardBottomProps> = ({ currentStep, totalSteps, onBack, onNext, onCancel, onDeploy, onIndexing }) => {
  return (
    <div className="wizard-bottom-container">
      {currentStep > 0 && <SecondaryButton text="Back" onClick={onBack} enabled={true} />}
      {currentStep === 0 && <SecondaryButton text="Cancel" onClick={onCancel} enabled={true} />}
      <PrimaryButton
        text={currentStep === 3 ? "Index" : currentStep === totalSteps - 1 ? "Deploy" : "Continue"}
        onClick={currentStep === 3 ? onIndexing : currentStep === totalSteps - 1 ? onDeploy : onNext}
        enabled={true}
      />
    </div>
  );
}

export default WizardBottom;
