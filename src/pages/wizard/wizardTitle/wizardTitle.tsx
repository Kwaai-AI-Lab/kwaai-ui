import "./wizardTitle.css";

interface WizardTitleProps {
  currentStep: number;
  totalSteps: number;
}

const WizardTitle: React.FC<WizardTitleProps> = ({ currentStep, totalSteps }) => {

  const getWizardSubTitle = () => {
    switch (currentStep) {
      case 0:
        return "Step 1: Set the new assistant";
      case 1:
        return "Step 2: Choose the assistant persona";
      case 2:
        return "Step 3: Choose an AI";
      case 3:
        return "Step 4: Share your knowledge";
      case 4:
        return "Step 5: Test the assistant";
      case 5:
        return "Step 6: Deploy!";
      default:
        return "Step 7: Deploy!";
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
        <span>Add New Assistant</span>
      </div>
      <div className="wizard-sub-title">
        <span>{getWizardSubTitle()}</span>
      </div>
    </div>
  );
};

export default WizardTitle;
