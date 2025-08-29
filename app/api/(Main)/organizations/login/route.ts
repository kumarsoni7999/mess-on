import { query } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { mobile, password } = await req.json();
        const organization = await query(`SELECT id, name, mobile, whatsapp_group, latitude, longitude, alternate_mobile, profile FROM mess_organizations WHERE mobile = ? AND password = ? AND active = 1`, [mobile, password]);
        
        if (!organization || organization.length === 0) {
            return NextResponse.json({ message: "Organization not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Organization logged in successfully", data: organization[0] }, { status: 200 });
    } catch (error) {
        console.error("Error logging in organization:", error);
        return NextResponse.json({ message: "Error logging in organization" }, { status: 500 });
    }
}