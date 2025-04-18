import PropTypes from "prop-types";
import After from "../assets/svgs/After.svg";
import Before from "../assets/svgs/Before.svg";

const FormStepper = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="rounded-md relative mb-8">
      <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-between items-center gap-4 relative">
        {steps.map((step, index) => {
          const isActive = currentStep >= index;
          const isLast = index === steps.length - 1;

          return (
            <div
              key={step}
              className={`flex-1 flex flex-col items-center relative cursor-pointer ${
                isActive ? "text-white" : "text-bgprimaryhover"
              }`}
              onClick={() => onStepClick && onStepClick(index)}>
              {/* Step Icon with SVG */}
              <div className="relative flex items-center justify-center w-full">
                <div className="relative">
                  <img
                    src={isActive ? After : Before}
                    alt={isActive ? "after complete" : "before complete"}
                    className="w-10 h-10 sm:w-14 sm:h-14"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-semibold">
                    {index + 1}
                  </span>
                </div>

                {/* Responsive connecting line */}
                {!isLast && (
                  <div
                    className={`hidden sm:block absolute h-1 ${
                      currentStep > index ? "bg-sky-900" : "bg-gray-300"
                    }`}
                    style={{
                      left: "calc(50% + 20px)" /* Half icon width + some padding */,
                      right: "calc(-50% )" /* Connect to next step's center */,
                      top: "50%",
                      transform: "translateY(-55%)",
                    }}
                  />
                )}
              </div>

              {/* Step Label */}
              <div className="mt-2 text-[0.75rem] sm:text-sm text-center text-bgprimaryhover">
                {step}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

FormStepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentStep: PropTypes.number.isRequired,
  onStepClick: PropTypes.func,
};

export default FormStepper;
