import { readFile } from "node:fs/promises";
import path from "node:path";

const MATERIAL_FILES = {
  fullscreen: "全屏背景.png",
  fullscreenOverlay: "水波纹背景.png",
  hero: "首图背景.png",
  supportCat: "猫素材.png",
  supportFrameTop: "框上插图.png",
  supportFrameBackground: "框内素材.png",
  supportNavBackground: "support-nav-background-cat.png",
  supportNavPositioning: "support-nav-positioning-cat.png",
  supportNavContent: "support-nav-content-cat.png",
  supportNavAi: "support-nav-ai-cat.png",
  supportNavDecision: "support-nav-decision-cat.png",
  supportNavProgress: "support-nav-progress-cat.png",
  supportSectionBackground: "陪伴产品底图.png",
  knowledgeInterface: "插件产品界面.png",
  knowledgeSectionBackground: "插件整个背景底图.png",
} as const;

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/materials/[asset]">,
) {
  const { asset } = await context.params;
  const fileName = MATERIAL_FILES[asset as keyof typeof MATERIAL_FILES];

  if (!fileName) {
    return new Response("Material not found", { status: 404 });
  }

  try {
    const file = await readFile(path.join(process.cwd(), "素材", fileName));

    return new Response(file, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch {
    return new Response(`Missing material: 素材/${fileName}`, { status: 404 });
  }
}
