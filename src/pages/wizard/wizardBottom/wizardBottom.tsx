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
}

const WizardBottom: React.FC<WizardBottomProps> = ({ currentStep, totalSteps, onBack, onNext, onCancel, onDeploy }) => {
  return (
    <div className="wizard-bottom-container">
      {currentStep > 0 && <SecondaryButton text="Back" onClick={onBack} enabled={true} />}
      {currentStep === 0 && <SecondaryButton text="Cancel" onClick={onCancel} enabled={true} />}
      <PrimaryButton
        text={currentStep === totalSteps - 1 ? "Deploy" : "Continue"} // Update the button text based on the current step
        onClick={currentStep === totalSteps - 1 ? onDeploy : onNext}
        enabled={true}
      />
    </div>
  );
}

export default WizardBottom;
