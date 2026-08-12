type ResponseActionsProps = {
  showCorrection: boolean;
  correction: string;
  confirmed: boolean;
  onConfirm: () => void;
  onCorrectionOpen: () => void;
  onCorrectionChange: (value: string) => void;
  onCorrectionSubmit: () => void;
  onCompanion: () => void;
  onAction: () => void;
};

export function ResponseActions(props: ResponseActionsProps) {
  return (
    <div className="response-actions">
      {props.confirmed && (
        <p className="inline-status" role="status">
          谢谢你告诉我。你的感受被我听见了。
        </p>
      )}
      {props.showCorrection && (
        <div className="correction-panel">
          <label className="field-label" htmlFor="correction">
            哪一部分不太对？
          </label>
          <textarea
            id="correction"
            rows={3}
            value={props.correction}
            onChange={(event) => props.onCorrectionChange(event.target.value)}
            placeholder="可以简单补充或纠正我"
          />
          <button
            className="button secondary"
            type="button"
            disabled={!props.correction.trim()}
            onClick={props.onCorrectionSubmit}
          >
            重新理解一下
          </button>
        </div>
      )}
      <div className="button-grid">
        <button className="button secondary" type="button" onClick={props.onConfirm}>
          你说对了
        </button>
        <button
          className="button secondary"
          type="button"
          onClick={props.onCorrectionOpen}
        >
          不完全是
        </button>
        <button
          className="button secondary"
          type="button"
          onClick={props.onCompanion}
        >
          先陪陪我
        </button>
        <button className="button primary" type="button" onClick={props.onAction}>
          帮我动一步
        </button>
      </div>
    </div>
  );
}
