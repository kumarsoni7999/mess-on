import { getUserAllAttendance, getUserDetails } from "@/hooks/api/user/queries";
import { STATUS } from "@/lib/statusCodes";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { username: string } }) => {
    try {
        const { username } = params

        if(!username){
            return NextResponse.json(
                { data: null },
                { status: STATUS.BAD_REQUEST }
            ); 
        }
        const users = await getUserAllAttendance(username);
        
        return NextResponse.json(
            { data: users },
            { status: STATUS.OK }
        );
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { message: "Error fetching users" },
            { status: STATUS.INTERNAL_SERVER_ERROR }
        );
    }
};