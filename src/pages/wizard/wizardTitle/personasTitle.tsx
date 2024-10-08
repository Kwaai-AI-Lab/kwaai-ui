import "./wizardTitle.css";

interface WizardTitleProps {
  currentStep: number;
  totalSteps: number;
}

const PersonaTitle: React.FC<WizardTitleProps> = ({ currentStep, totalSteps }) => {

  const getWizardSubTitle = () => {
    switch (currentStep) {
      case 0:
        return "Step 1: Set the new persona";
      case 1:
        return "Step 2: Choose a face for the persona";
      case 2:
        return "Step 3: Choose a voice";
      default:
        return "Step 4: Deploy!";
    }
  };

  const renderProgressDots = () => {
    return (
      <div className="progress-container">
        {[...Array(totalSteps)].map((_, index) => (
          <div key={index} className="progress-item">
            <div className={`dot-wrapper ${index <= currentStep ? 'active' : ''}`}>
              <div className={`dot ${index <= currentStep ? 'active' : ''}`} />
            </div>
            {index < totalSteps - 1 && (
              <div className={`line ${index < currentStep ? 'active-line' : ''}`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="wizard-title">
      {renderProgressDots()}
      <div className="wizard-title-content">
        <span>Add New Persona</span>
      </div>
      <div className="wizard-sub-title">
        <span>{getWizardSubTitle()}</span>
      </div>
    </div>
  );
};

export default PersonaTitle;
