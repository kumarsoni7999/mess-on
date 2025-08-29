"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Spinner from "@/components/ui/spinner"
import { userLogin } from "@/hooks/api/user"
import { KeyRound } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const UserLogin = () => {

    const router = useRouter()
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        let res = await userLogin(username)
        if(res && res?.data){
            router.push(`/user/${username}`)
        } else {
            alert('No user found')
        }
        setLoading(false);
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 overflow-auto">
            <Card className="w-full max-w-md p-6 space-y-6">
                <div className="space-y-2 text-center">
                    <div className="flex justify-center">
                        <KeyRound className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-muted-foreground">
                        Sign in to your account to continue
                    </p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        id="username"
                        type="text"
                        placeholder="eg: ABCD_1234567"
                        value={username}
                        style={{
                            marginBottom: 10,
                            height: 45
                        }}
                        onChange={(e: any) => setUsername(e.target.value?.toUpperCase())}
                        required
                    />

                    <Button type="submit" className="w-full" disabled={loading || !username} style={{
                        backgroundColor: (loading || !username) ? 'gray' : 'green',
                        color: (loading || !username) ? 'black' : 'white',
                    }}>
                        {loading ? (
                            <Spinner size={20} />
                        ) : (
                            'Login'
                        )}
                    </Button>

                    <p className='text-center text-sm'>Don't have an account? <Link href="/user/register" className='underline'>Create Account</Link></p>
                </form>
            </Card>
        </main>
    )
}

export default UserLogin