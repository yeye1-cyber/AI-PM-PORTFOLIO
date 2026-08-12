"use client";

import { useEffect, useRef, useState } from "react";
import { playerTracks } from "@jiezhu/data/dashboard-config";

export function MusicPlayerPanel({ onNotice }: { onNotice: (value: string) => void }) {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, selected]);

  const move = (delta: number) => {
    const next = (selected + delta + playerTracks.length) % playerTracks.length;
    setSelected(next);
    setPlaying(playerTracks[next].enabled);
    if (!playerTracks[next].enabled) {
      onNotice("这段猫片还没有放入音频，咪先替你留好位置啦。");
    }
  };
  const selectTrack = (index: number) => {
    setSelected(index);
    setPlaying(playerTracks[index].enabled);
    if (!playerTracks[index].enabled) {
      onNotice("这段猫片还没有放入音频，咪先替你留好位置啦。");
    }
  };
  const toggle = () => {
    if (!playerTracks[selected].enabled) {
      onNotice("这段猫片还没有放入音频，咪先替你留好位置啦。");
      return;
    }
    setPlaying((value) => !value);
  };
  return (
    <section className="cozy-panel player-panel">
      <div className="cat-track-grid">
        {playerTracks.map((track, index) => (
          <button
            aria-label={`选择音乐：${track.title}`}
            aria-pressed={index === selected}
            className={index === selected ? "selected" : ""}
            key={track.id}
            onClick={() => selectTrack(index)}
          >
            <img alt="" className="track-cover" src={`/music-player/${index + 1}.png`} />
          </button>
        ))}
      </div>
      <div className="player-control">
        <audio
          key={playerTracks[selected].audioUrl}
          onEnded={() => setPlaying(false)}
          ref={audioRef}
          src={playerTracks[selected].audioUrl || undefined}
        />
        <img
          alt={`${playerTracks[selected].title}专辑封面`}
          className="album-cover"
          src={`/music-player/${selected + 1}.png`}
        />
        <div><strong>{playerTracks[selected].title}</strong><small>{playing ? "正在播放" : "nature sounds"}</small></div>
        <button onClick={() => move(-1)}>◀</button>
        <button className="play" onClick={toggle}>{playing ? "Ⅱ" : "▶"}</button>
        <button onClick={() => move(1)}>▶</button>
      </div>
    </section>
  );
}
