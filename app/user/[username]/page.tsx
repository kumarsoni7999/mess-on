"use client"
import { UserDetail } from "@/components/user/userDetails";

interface PageProps {
    params: {
        username: string | any;
    };
}

const UserDashboard = ({ params }: PageProps) => {
    const { username } = params;

    return <UserDetail username={username} />
}

export default UserDashboard