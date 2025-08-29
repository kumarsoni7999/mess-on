import { addUserAttendance, getAllUsers, getUsersAttandance } from "@/hooks/api/user/queries";
import { STATUS } from "@/lib/statusCodes";
import { NextRequest, NextResponse } from "next/server";

const validateAttandanceDetails = (userData: any) => {
    const { user_id, date, shift } = userData;

    if (!user_id || typeof user_id !== 'string') {
        throw new Error("User id required.");
    }

    if (!date || typeof date !== 'string') {
        throw new Error("Select attandance date");
    }

    if (!shift || typeof shift !== 'string') {
        throw new Error("Add morning or night shift value");
    }
}

export const GET = async (req: NextRequest) => {
    const date: string | null = req.nextUrl.searchParams.get("date")

    if(!date){
        return NextResponse.json(
            { message: "Invalid date input" },
            { status: STATUS.BAD_REQUEST }
        );
    }
    try {
        const users = await getUsersAttandance(date);
        return NextResponse.json(
            { data: users },
            { status: STATUS.OK }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching users" },
            { status: STATUS.INTERNAL_SERVER_ERROR }
        );
    }
};

export const POST = async (req: NextRequest) => {

    try {
        const userData = await req.json();

        validateAttandanceDetails(userData);

        const id = await addUserAttendance(userData);

        return NextResponse.json(
            { message: "Attendance added", id },
            { status: STATUS.CREATED }
        );
    } catch (error: any) {
        console.error("Error adding attendance:", error.message || error);

        return NextResponse.json(
            { message: error.message || "Error adding attendance" },
            { status: STATUS.BAD_REQUEST }
        );
    }
};