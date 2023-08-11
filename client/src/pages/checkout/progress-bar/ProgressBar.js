import React from "react";
import { ProgressBar, Step } from "react-step-progress-bar";
import styling from "./ProgressBar.module.css";
import { ChevronRight } from "../../../images/icons/TablerIcons";

const StepBar = ({ steps, currentStep }) => {
  return (
    <div className={styling.stepBar}>
      {steps.map((step, index) => (
        <div key={index} className={styling.stepBar}>
          <div
            className={`${styling.step} ${
              index < currentStep ? styling.completed : ""
            }`}
          >
            {step}
          </div>
          {index < steps.length - 1 && (
            <div>
              <ChevronRight />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepBar;
