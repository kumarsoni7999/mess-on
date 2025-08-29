import { getUserAllAttendance, getUserDetails } from "@/hooks/api/user/queries";
import { STATUS } from "@/lib/statusCodes";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { username: string } }) => {
    try {
        const { username } = params;
        const searchParams = req.nextUrl.searchParams;
        const organization = searchParams.get("organization");

        if(!username){
            return NextResponse.json(
                { message: "Username is required" },
                { status: STATUS.BAD_REQUEST }
            ); 
        }

        if(!organization){
            return NextResponse.json(
                { message: "Organization ID is required" },
                { status: STATUS.BAD_REQUEST }
            );
        }

        const attendance = await getUserAllAttendance(username, organization);
        
        return NextResponse.json(
            { data: attendance },
            { status: STATUS.OK }
        );
    } catch (error) {
        console.error("Error fetching attendance:", error);
        return NextResponse.json(
            { message: "Error fetching attendance" },
            { status: STATUS.INTERNAL_SERVER_ERROR }
        );
    }
};