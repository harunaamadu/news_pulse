import { createBrandIcon } from "@/lib/brand-icon";

const ALLOWED_SIZES = new Set([192, 512]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ size: string }> },
) {
  const { size } = await params;
  const px = Number(size);

  if (!ALLOWED_SIZES.has(px)) {
    return new Response("Not found", { status: 404 });
  }

  return createBrandIcon(px);
}