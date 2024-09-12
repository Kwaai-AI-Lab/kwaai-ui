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

const PersonaTitle: React.FC<WizardTitleProps> = ({ currentStep }) => {
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
        return "Step 1: Set the new persona";
      case 1:
        return "Step 2: Choose a face to the persona ";
      case 2:
        return "Step 3: Choose a voice";
      default:
        return "Step 4: Deploy!";
    }
  };

  return (
    <div className="wizard-title">
      <div className="wizard-title-content">
        <span>Add New Persona</span>
      </div>
      <img src={getWizardImage()} alt="wizard" />
      <div className="wizard-sub-title">
          <span>{getWizardSubTitle()}</span>
        </div>
    </div>
  );
};

export default PersonaTitle;
