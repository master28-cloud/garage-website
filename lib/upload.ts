export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // Netlify Functions cap payloads ~6MB

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

/** Magic-byte check — a caller can set any Content-Type they like. */
function sniff(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return "image/png";
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" &&
      buf.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  return null;
}

export type UploadResult =
  | { ok: true; buffer: Buffer; mimeType: string; bytes: number }
  | { ok: false; error: string };

export async function readImageUpload(file: unknown): Promise<UploadResult> {
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No file received." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      error: `That image is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is 4MB — compress it at squoosh.app and try again.`
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const sniffed = sniff(buffer);

  if (!sniffed || !ALLOWED.has(sniffed)) {
    return { ok: false, error: "Only JPG, PNG and WebP images are accepted." };
  }

  return { ok: true, buffer, mimeType: sniffed, bytes: buffer.length };
}
