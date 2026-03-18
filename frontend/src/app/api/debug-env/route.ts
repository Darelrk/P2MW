import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL || "Undefined",
        database_url: process.env.DATABASE_URL ? `${process.env.DATABASE_URL.slice(0, 20)}...` : "Undefined",
        r2_bucket: process.env.R2_BUCKET_NAME || "Undefined",
        r2_public_url: process.env.R2_PUBLIC_URL || "Undefined",
        key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? "Defined" : "Undefined",
        service_role: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Defined" : "Undefined",
    });
}
