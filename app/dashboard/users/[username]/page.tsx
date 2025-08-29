"use client"
import { UserDetail } from "@/components/user/userDetails";
import { useParams } from "next/navigation"

const UserDetailPage = () => {

    const { username } = useParams()

    if (typeof username !== 'string') return <div>Invalid username</div>;

    return <UserDetail username={username} />;
}

export default UserDetailPage