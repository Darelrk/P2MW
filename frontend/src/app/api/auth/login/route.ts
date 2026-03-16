import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        console.log("[API Bridge Auth Login] POST:", body);

        // Dummy success for audit
        return NextResponse.json({ 
            access_token: "test-token-" + Math.random().toString(36).substr(2, 9),
            token: "test-token-mcp",
            message: "Auth login successful (API Bridge)" 
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
