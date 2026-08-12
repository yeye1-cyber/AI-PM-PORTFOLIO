"use client";

import { useEffect, useRef } from "react";

type LiquidApp = {
  dispose?: () => void;
  loadImage: (source: string) => void;
  liquidPlane: {
    material: { metalness: number; roughness: number };
    uniforms: { displacementScale: { value: number } };
  };
  setRain: (enabled: boolean) => void;
};

async function createHorizontalMaterial(source: string) {
  const image = new Image();
  image.src = source;
  await image.decode();

  const canvas = document.createElement("canvas");
  canvas.width = image.naturalHeight;
  canvas.height = image.naturalWidth;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context unavailable");

  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(Math.PI / 2);
  context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);

  return canvas.toDataURL("image/png");
}

export function LiquidRefractionBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let active = true;
    let app: LiquidApp | undefined;

    async function initialise() {
      try {
        const [{ default: LiquidBackground }, material] = await Promise.all([
          import("threejs-components/build/backgrounds/liquid1.min.js"),
          createHorizontalMaterial("/api/materials/fullscreenOverlay"),
        ]);

        if (!active || !canvas) return;

        app = LiquidBackground(canvas) as LiquidApp;
        app.loadImage(material);
        app.liquidPlane.material.metalness = 0.35;
        app.liquidPlane.material.roughness = 0.45;
        app.liquidPlane.uniforms.displacementScale.value = 2;
        app.setRain(false);
        document.body.classList.add("liquid-refraction-ready");
      } catch {
        // Keep the static CSS background as a graceful fallback.
      }
    }

    void initialise();

    return () => {
      active = false;
      document.body.classList.remove("liquid-refraction-ready");
      app?.dispose?.();
    };
  }, []);

  return (
    <div className="liquid-refraction-layer" aria-hidden="true">
      <canvas ref={canvasRef} className="liquid-refraction-canvas" />
    </div>
  );
}
