import { NextResponse } from "next/server";
import { getGroqFunFact } from "@/lib/groq";

export async function POST(req: Request) {
  const { country } = await req.json();

  if (!country) {
    return NextResponse.json({ error: "Country name required" }, { status: 400 });
  }

  try {
    const fact = await getGroqFunFact(country);
    return NextResponse.json({ fact });
  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json({ error: "Failed to fetch fun fact" }, { status: 500 });
  }
}
