import axios from "axios";
import FormData from "form-data";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Audio file missing" }, { status: 400 });
    }

    // Convert Next.js File → Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const formData = new FormData();
    formData.append("api_token", process.env.AUDD_API_TOKEN || "");
    formData.append("return", "spotify,apple_music,deezer,napster,musicbrainz");
    formData.append("file", buffer, {
      filename: file.name,
      contentType: file.type,
      knownLength: buffer.length,
    });

    const auddResponse = await axios.post("https://api.audd.io/", formData, {
      headers: formData.getHeaders(),
    });

    return NextResponse.json(auddResponse.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}

// Using Node.js runtime for form-data package compatibility
