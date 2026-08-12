type EmotionInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function EmotionInput({ value, onChange }: EmotionInputProps) {
  return (
    <div className="field-group">
      <label className="field-label" htmlFor="emotion-detail">
        想说多少都可以
      </label>
      <textarea
        id="emotion-detail"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="比如：看到岗位要求实习经历，我有点后悔之前没早点准备……"
        rows={6}
        maxLength={1000}
      />
      <span className="char-count">{value.length}/1000</span>
    </div>
  );
}
