import { type NextRequest, NextResponse } from "next/server";
import { getArticles } from "@/lib/data/articles";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    const pageSize = searchParams.get("pageSize");

    const articles = await getArticles(
      cursor ? Number(cursor) : undefined,
      pageSize ? Number(pageSize) : 5,
    );

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 },
    );
  }
}
