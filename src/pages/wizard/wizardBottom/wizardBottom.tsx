import React from "react";
import PrimaryButton from "../../../components/buttons/primaryButton/primaryButton";
import "./wizardBottom.css";
import PrevButton from "../../../components/buttons/prevButton/prevButton";

interface WizardBottomProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  onDeploy: () => void;
  onIndexing?: () => void;
  isIndexing?: boolean;
  isIndexingMode?: boolean;
}

const WizardBottom: React.FC<WizardBottomProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onCancel,
  onDeploy,
  onIndexing = () => {},
  isIndexingMode = false,
  isIndexing = false,
}) => {
  const isFinalStep = currentStep === totalSteps - 1;

  return (
    <div className="wizard-bottom-container">
      {currentStep > 0 && <PrevButton text="Back" onClick={onBack} enabled={true} />}
      {currentStep === 0 && <PrevButton text="Cancel" onClick={onCancel} enabled={true} />}

      <PrimaryButton
        text={isIndexingMode ? "Index" : isFinalStep ? "Deploy" : "Continue"}
        onClick={isIndexingMode ? onIndexing : isFinalStep ? onDeploy : onNext}
        enabled={!isIndexing}
      />
    </div>
  );
};

export default WizardBottom;
