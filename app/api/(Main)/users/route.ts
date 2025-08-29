import { NextRequest, NextResponse } from "next/server";
import { STATUS } from "@/lib/statusCodes";
import { createOrUpdateUser, deleteUser, getAllUsers } from "@/hooks/api/user/queries";

const validateUserData = (userData: any) => {
    const { full_name, email, mobile, address, preference, plan, joiningDate, organization } = userData;

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

    if(!organization){
        throw new Error("Organization ID is required.");
    }
};

export const GET = async (req: NextRequest) => {
    try {
        const searchParams = req.nextUrl.searchParams;
        const org_id = searchParams.get("organization");

        if(!org_id){
            return NextResponse.json(
                { message: "Organization ID is required" },
                { status: STATUS.BAD_REQUEST }
            );
        }

        const users = await getAllUsers(org_id);
        
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
    try {
        const { id, organization } = await req.json();

        if(!id){
            return NextResponse.json(
                { message: "User ID is required" },
                { status: STATUS.BAD_REQUEST }
            ); 
        }

        if(!organization){
            return NextResponse.json(
                { message: "Organization ID is required" },
                { status: STATUS.BAD_REQUEST }
            ); 
        }

        const result = await deleteUser(id, organization);

        return NextResponse.json(
            { message: result.message },
            { status: STATUS.OK }
        );
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { message: "Error deleting user" },
            { status: STATUS.INTERNAL_SERVER_ERROR }
        );
    }
}
