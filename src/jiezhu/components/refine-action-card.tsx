import { minimumActionMessage } from "@jiezhu/data/mock-data";

type RefineActionCardProps = {
  originalAction: string;
  currentAction: string;
  atMinimum: boolean;
  onTry: () => void;
  onRefine: () => void;
  onPause: () => void;
};

export function RefineActionCard(props: RefineActionCardProps) {
  return (
    <section className="refine-card">
      <div className="previous-action">
        <span>刚才的动作</span>
        <p>{props.originalAction}</p>
      </div>
      <div className="current-action">
        <span className="eyebrow">我们再缩小一点</span>
        <h1>{props.currentAction}</h1>
      </div>
      {props.atMinimum && <p className="gentle-stop">{minimumActionMessage}</p>}
      <div className="action-controls">
        <button className="button primary" type="button" onClick={props.onTry}>
          我可以试试
        </button>
        <div className="secondary-actions">
          <button
            className="text-button"
            type="button"
            onClick={props.onRefine}
            disabled={props.atMinimum}
          >
            还是太难
          </button>
          <button className="text-button" type="button" onClick={props.onPause}>
            先缓一缓
          </button>
        </div>
      </div>
    </section>
  );
}
