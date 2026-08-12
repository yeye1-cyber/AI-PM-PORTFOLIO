type Props = {
  onButtonClick?: (buttonNumber: number) => void;
};

const toolbarButtons = Array.from({ length: 7 }, (_, index) => index + 1);

export function BottomToolbar({ onButtonClick }: Props) {
  return (
    <nav className="bottom-toolbar" aria-label="快捷功能">
      {toolbarButtons.map((buttonNumber) => (
        <button
          className="bottom-toolbar-button"
          key={buttonNumber}
          type="button"
          aria-label={`快捷功能 ${buttonNumber}`}
          onClick={() => onButtonClick?.(buttonNumber)}
        >
          <img
            src={`/toolbar-buttons/${buttonNumber}.png`}
            alt=""
            draggable="false"
          />
        </button>
      ))}
    </nav>
  );
}
