import { emotions } from "@jiezhu/data/mock-data";

type EmotionSelectorProps = {
  selected: string | null;
  onSelect: (emotion: string) => void;
};

export function EmotionSelector({
  selected,
  onSelect,
}: EmotionSelectorProps) {
  return (
    <fieldset className="field-group">
      <legend className="field-label">此刻更接近哪种感受？（可不选）</legend>
      <div className="emotion-grid">
        {emotions.map((emotion) => {
          const active = emotion === selected;
          return (
            <button
              className="emotion-chip"
              data-selected={active}
              type="button"
              aria-pressed={active}
              key={emotion}
              onClick={() => onSelect(emotion)}
            >
              {emotion}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
