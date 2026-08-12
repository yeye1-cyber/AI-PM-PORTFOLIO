import { understandingSteps } from "@jiezhu/data/mock-data";

type UnderstandingStepsProps = {
  activeIndex: number;
};

export function UnderstandingSteps({
  activeIndex,
}: UnderstandingStepsProps) {
  return (
    <ol className="understanding-list" aria-live="polite">
      {understandingSteps.map((step, index) => (
        <li className="understanding-step" data-active={index <= activeIndex} key={step}>
          <span className="step-indicator" aria-hidden="true">
            {index < activeIndex ? "✓" : index + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}
