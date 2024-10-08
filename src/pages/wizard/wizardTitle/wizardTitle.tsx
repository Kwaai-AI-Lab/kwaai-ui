import wizard1 from "../../../assets/wizard-step1.png";
import wizard2 from "../../../assets/wizard-step2.png";
import wizard3 from "../../../assets/wizard-step3.png";
import wizard4 from "../../../assets/wizard-step4.png";
import wizard5 from "../../../assets/wizard-step5.png";
import wizard6 from "../../../assets/wizard-step6.png";
import "./wizardTitle.css";

interface WizardTitleProps {
  currentStep: number;
}

const WizardTitle: React.FC<WizardTitleProps> = ({ currentStep }) => {
  const getWizardImage = () => {
    switch (currentStep) {
      case 0:
        return wizard1;
      case 1:
        return wizard2;
      case 2:
        return wizard3;
      case 3:
        return wizard4;
      case 4:
        return wizard5;
      case 5:
        return wizard6;
      default:
        return wizard1;
    }
  };

  const getWizardSubTitle = () => {
    switch (currentStep) {
      case 0:
        return "Step 1: Set the new assistant";
      case 1:
        return "Step 2: Choose the assistant persona ";
      case 2:
        return "Step 3: Choose an AI";
      case 3:
        return "Step 4: Share your knowledge";
      case 4:
        return "Step 5: Test the assistant";
      case 5:
        return "Step 6: Deploy";
      default:
        return "Step 7: Deploy!";
    }
  };

  return (
    <div className="wizard-title">
      <div className="wizard-title-content">
        <span>Add New Assistant</span>
      </div>
      <img src={getWizardImage()} alt="wizard" />
      <div className="wizard-sub-title">
          <span>{getWizardSubTitle()}</span>
        </div>
    </div>
  );
};

export default WizardTitle;
