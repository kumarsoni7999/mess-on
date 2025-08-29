import { getUserDetails } from "@/hooks/api/user/queries";
import { STATUS } from "@/lib/statusCodes";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { username: string } }) => {
    try {
        const { username } = params;
        const searchParams = req.nextUrl.searchParams;
        const organization = searchParams.get("organization");

        if(!username){
            return NextResponse.json(
                { data: null },
                { status: STATUS.BAD_REQUEST }
            ); 
        }

        if(!organization){
            return NextResponse.json(
                { message: "Organization ID is required" },
                { status: STATUS.BAD_REQUEST }
            );
        }

        const user = await getUserDetails(username, organization);
        
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: STATUS.NOT_FOUND }
            );
        }
        
        return NextResponse.json(
            { data: user },
            { status: STATUS.OK }
        );
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { message: "Error fetching user" },
            { status: STATUS.INTERNAL_SERVER_ERROR }
        );
    }
};

export const POST = async (req: NextRequest, { params }: { params: { username: string } }) => {
    try {
        const { username } = params;
        const { organization } = await req.json();

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

        const user = await getUserDetails(username, organization);
        
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: STATUS.NOT_FOUND }
            );
        }
        
        return NextResponse.json(
            { data: user },
            { status: STATUS.OK }
        );
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { message: "Error fetching user" },
            { status: STATUS.INTERNAL_SERVER_ERROR }
        );
    }
};