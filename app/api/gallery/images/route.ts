import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/db";

const MAX_IMAGES = 9;

const formatDate = (value: Date) =>
  value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const buildEventSvg = (name: string, date: string, location: string, index: number) => {
  const isAlt = index % 2 === 1;
  const bgStart = isAlt ? "#f8fafc" : "#eef2ff";
  const bgEnd = isAlt ? "#dbeafe" : "#e0f2fe";
  const accent = isAlt ? "#2f4b7c" : "#4a6fa5";
  const accentAlt = isAlt ? "#4a6fa5" : "#2f4b7c";
  const ink = "#1f2937";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" role="img" aria-label="${name} event">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bgStart}" />
      <stop offset="100%" stop-color="${bgEnd}" />
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${accent}" />
      <stop offset="100%" stop-color="${accentAlt}" />
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bg)" />
  <circle cx="470" cy="120" r="95" fill="url(#accent)" opacity="0.35" />
  <rect x="40" y="360" width="520" height="160" rx="24" fill="#ffffff" opacity="0.9" />
  <text x="60" y="408" fill="${ink}" font-family="Georgia, 'Times New Roman', serif" font-size="28" font-weight="700">${name}</text>
  <text x="60" y="448" fill="${ink}" font-family="Arial, sans-serif" font-size="18">${date}</text>
  <text x="60" y="478" fill="${ink}" font-family="Arial, sans-serif" font-size="16">${location}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export async function GET(request: NextRequest) {
  const userPayload = request.headers.get("x-user-payload");
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    orderBy: { schedule: "desc" },
    take: MAX_IMAGES,
    select: {
      name: true,
      schedule: true,
      location: {
        select: { name: true },
      },
    },
  });

  const images = events.map((event, index) => {
    const name = escapeXml(event.name || "Event");
    const date = escapeXml(formatDate(event.schedule));
    const location = escapeXml(event.location?.name ?? "Kids-U");
    return buildEventSvg(name, date, location, index);
  });

  return NextResponse.json({ images }, {
    status: 200,
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" },
  });
}
