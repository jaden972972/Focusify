import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const materia = searchParams.get("q")?.trim();
  if (!materia) {
    return NextResponse.json({ error: "Missing q param" }, { status: 400 });
  }
  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  // Append "estudio" so YouTube prioritises educational content over entertainment
  const query = `${materia} estudio`;

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("maxResults", "4");
  url.searchParams.set("q", query);
  url.searchParams.set("type", "video");
  url.searchParams.set("relevanceLanguage", "es");
  url.searchParams.set("key", API_KEY);

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) {
    return NextResponse.json({ error: "YouTube API error" }, { status: 502 });
  }

  const data = await res.json();
  const items: { id: string; title: string; thumbnail: string }[] =
    (data.items ?? []).map((item: any) => ({
      id: item.id?.videoId ?? "",
      title: item.snippet?.title ?? "",
      thumbnail: item.snippet?.thumbnails?.medium?.url ?? "",
    }));

  return NextResponse.json({ items });
}
