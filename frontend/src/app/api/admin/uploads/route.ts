import { NextResponse } from "next/server";

export async function POST(request: Request) {
    // TC008/TC010 Upload Bridge
    // Just return a success JSON with a placeholder URL
    return NextResponse.json({
        url: "https://placehold.co/400x400/png?text=Uploaded+Asset",
        data: {
            url: "https://placehold.co/400x400/png?text=Uploaded+Asset"
        }
    });
}

export async function GET() {
    return NextResponse.json({ message: "Uploads bridge active" });
}
