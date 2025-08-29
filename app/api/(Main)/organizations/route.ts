import { query } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export const GET = async (req: NextRequest, res: NextResponse) => {
    try {
        let queryString = `SELECT * FROM mess_organizations WHERE active = 1`;
        const organizations = await query(queryString);
        return NextResponse.json({ data: organizations }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching organizations" }, { status: 500 });
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const {
            name,
            address,
            mobile,
            email,
            alternate_mobile,
            whatsapp_group,
            latitude,
            longitude,
        } = await req.json();

        if (!name || !address || !mobile) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        if (mobile && mobile.length !== 10) {
            return NextResponse.json(
                { message: "Invalid mobile number" },
                { status: 400 }
            );
        }

        if (alternate_mobile && alternate_mobile.length !== 10) {
            return NextResponse.json(
                { message: "Invalid alternate mobile number" },
                { status: 400 }
            );
        }

        let id = uuidv4();

        let paramsString = "id, name, address, mobile, `key`";
        let params = "?, ?, ?, ?, ?";
        let values = [
            id,
            name,
            address,
            mobile,
            name.trim().replace(/\s+/g, "_").toLowerCase(),
        ];

        if (alternate_mobile) {
            paramsString += `, alternate_mobile`;
            params += `, ?`;
            values.push(alternate_mobile);
        }
        if (whatsapp_group) {
            paramsString += `, whatsapp_group`;
            params += `, ?`;
            values.push(whatsapp_group);
        }
        if (latitude) {
            paramsString += `, latitude`;
            params += `, ?`;
            values.push(latitude);
        }
        if (longitude) {
            paramsString += `, longitude`;
            params += `, ?`;
            values.push(longitude);
        }
        if (email) {
            paramsString += `, email`;
            params += `, ?`;
            values.push(email);
        }

        const insertQueryString = `INSERT INTO mess_organizations (${paramsString}) VALUES (${params})`;

        const result: any = await query(insertQueryString, values);
        if (result.affectedRows > 0) {
            const organization = await query(
                `SELECT * FROM mess_organizations WHERE id = ?`,
                [id]
            );
            return NextResponse.json(
                {
                    message: "Organization created",
                    data: organization[0],
                    organization: `https://mess-on.vercel.app/${organization[0]?.key}`
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { message: "Error creating organization" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error creating organization:", error);
        return NextResponse.json(
            { message: "Error creating organization" },
            { status: 500 }
        );
    }
};