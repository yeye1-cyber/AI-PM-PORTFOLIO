import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

const VIDEO_FILE = "陪伴产品demo视频.mp4";

export const dynamic = "force-dynamic";

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(request: Request) {
  const filePath = path.join(process.cwd(), "素材", VIDEO_FILE);

  try {
    const fileStats = await stat(filePath);
    const range = request.headers.get("range");

    if (!range) {
      const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream;

      return new Response(stream, {
        headers: {
          ...noCacheHeaders,
          "Accept-Ranges": "bytes",
          "Content-Length": String(fileStats.size),
          "Content-Type": "video/mp4",
        },
      });
    }

    const match = /^bytes=(\d+)-(\d*)$/.exec(range);
    if (!match) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${fileStats.size}` },
      });
    }

    const start = Number(match[1]);
    const requestedEnd = match[2] ? Number(match[2]) : fileStats.size - 1;
    const end = Math.min(requestedEnd, fileStats.size - 1);

    if (start > end || start >= fileStats.size) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${fileStats.size}` },
      });
    }

    const stream = Readable.toWeb(createReadStream(filePath, { start, end })) as ReadableStream;

    return new Response(stream, {
      status: 206,
      headers: {
        ...noCacheHeaders,
        "Accept-Ranges": "bytes",
        "Content-Length": String(end - start + 1),
        "Content-Range": `bytes ${start}-${end}/${fileStats.size}`,
        "Content-Type": "video/mp4",
      },
    });
  } catch {
    return new Response(`Missing material: 素材/${VIDEO_FILE}`, { status: 404 });
  }
}
