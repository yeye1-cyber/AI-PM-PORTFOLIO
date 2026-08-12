import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const musicSlots = new Set(["m1", "m2"]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slot: string }> },
) {
  const { slot } = await params;

  if (!musicSlots.has(slot)) {
    return new NextResponse("Music slot not found", { status: 404 });
  }

  try {
    const audio = await readFile(
      path.join(process.cwd(), "网页素材", "音乐播放器", `${slot}.mp3`),
    );

    return new NextResponse(audio, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "audio/mpeg",
      },
    });
  } catch {
    return new NextResponse("Music file not found", { status: 404 });
  }
}
