import { NextRequest, NextResponse } from "next/server";
import { STATUS } from "@/lib/statusCodes";
import { createOrUpdateUser, deleteUser, getAllUsers } from "@/hooks/api/user/queries";

const validateUserData = (userData: any) => {
    const { full_name, email, mobile, address, preference, plan, joiningDate } = userData;

    if (!full_name || typeof full_name !== 'string') {
        throw new Error("Full Name is required and must be a string.");
    }

    if (!mobile || typeof mobile !== 'string' || !/^\d{10}$/.test(mobile)) {
        throw new Error("Valid Mobile number is required (10 digits).");
    }

    if (!preference || !['veg', 'non-veg'].includes(preference)) {
        throw new Error("Preference must be either 'veg' or 'non-veg'.");
    }

    if (!plan || !['basic', 'premium'].includes(plan)) {
        throw new Error("Plan must be either 'basic' or 'premium'.");
    }

    if (!joiningDate || isNaN(Date.parse(joiningDate))) {
        throw new Error("Joining Date must be a valid date.");
    }
};

export const GET = async (req: NextRequest) => {
    try {
        const users = await getAllUsers();
        
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

export const POST = async (req: NextRequest) => {

    try {
        const userData = await req.json();

        validateUserData(userData);

        const userId = await createOrUpdateUser(userData);

        return NextResponse.json(
            { message: "User created successfully", userId },
            { status: STATUS.CREATED }
        );
    } catch (error: any) {
        console.error("Error creating user:", error.message || error);

        return NextResponse.json(
            { message: error.message || "Error creating user" },
            { status: STATUS.BAD_REQUEST }
        );
    }
};

export const DELETE = async (req: NextRequest) => {
    const { id } = await req.json()

    if(!id){
        return NextResponse.json(
            { data: null },
            { status: STATUS.BAD_REQUEST }
        ); 
    }

    await deleteUser(id)

    return NextResponse.json(
        { message: "User deleted" },
        { status: STATUS.CREATED }
    );
}
