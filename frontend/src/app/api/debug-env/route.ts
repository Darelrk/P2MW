import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Defined" : "Undefined",
        key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? "Defined" : "Undefined",
        service_role: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Defined" : "Undefined",
    });
}
