import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id: params.id },
      select: { mimeType: true, data: true }
    });
    if (!asset) return new NextResponse("Not found", { status: 404 });

    return new NextResponse(Buffer.from(asset.data), {
      headers: {
        "Content-Type": asset.mimeType,
        // Asset ids are content-addressed by row, so a replaced image gets a
        // new id and a new URL. Safe to cache hard.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch {
    return new NextResponse("Unavailable", { status: 503 });
  }
}
