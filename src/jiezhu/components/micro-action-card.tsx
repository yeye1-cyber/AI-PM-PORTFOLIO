import type { MicroAction } from "@jiezhu/types/support";

type MicroActionCardProps = {
  action: MicroAction;
  started: boolean;
  completed: boolean;
  onStart: () => void;
  onComplete: () => void;
  onTooHard: () => void;
  onReplace: () => void;
  onPause: () => void;
};

export function MicroActionCard(props: MicroActionCardProps) {
  return (
    <section className="action-card">
      <span className="eyebrow">一个微行动</span>
      <h1>{props.action.text}</h1>
      <p className="time">预计 {props.action.minutes} 分钟</p>
      <div className="reason">
        <strong>为什么是这一步：</strong>
        <p>{props.action.reason}</p>
      </div>
      <div className="action-controls">
        {!props.started ? (
          <button className="button primary" type="button" onClick={props.onStart}>
            我开始了
          </button>
        ) : (
          <button
            className="button primary"
            type="button"
            onClick={props.onComplete}
            disabled={props.completed}
          >
            {props.completed ? "已完成" : "我完成了"}
          </button>
        )}
        <div className="secondary-actions">
          <button className="text-button" type="button" onClick={props.onTooHard}>
            还是太难
          </button>
          <button className="text-button" type="button" onClick={props.onReplace}>
            换一个动作
          </button>
          <button className="text-button" type="button" onClick={props.onPause}>
            我想先缓一缓
          </button>
        </div>
      </div>
    </section>
  );
}
