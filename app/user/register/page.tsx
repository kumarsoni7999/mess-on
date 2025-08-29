'use client'

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Spinner from '@/components/ui/spinner';
import { createUser } from '@/hooks/api/user';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Loader2, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {

    const router = useRouter();
    let today = new Date().toISOString().split("T")[0]
    const defaultUserDetails = {
        full_name: "",
        email: "",
        mobile: "",
        address: "",
        preference: "non-veg",
        plan: "basic",
        joiningDate: today,
    }
    const [formData, setFormData] = useState(defaultUserDetails);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateUser = () => {
        let message = ''
        if (!formData.full_name) {
            message = 'Enter user full name'
        } else if (!formData.mobile) {
            message = "Enter mobile no"
        } else if (formData.mobile && formData.mobile?.length != 10) {
            message = "Enter a 10 didgit mobile no"
        } else if (!formData.joiningDate) {
            message = "Select joining date"
        }
        if (message) {
            alert(message)
            return false
        }
        return true
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (validateUser()) {
            setLoading(true);
            const result = await createUser(formData);
            if (result) {
                setFormData(defaultUserDetails);
                alert('Thank you, you are now a member of APNA Mess')
                router.push('/')
            }
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 overflow-auto">
            <Card className="w-full max-w-md p-6 space-y-6">
                <div className="space-y-2 text-center">
                    <div className="flex justify-center">
                        <UtensilsCrossed className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Apna Mess</h1>
                    <p className="text-muted-foreground">
                        Sign up to create account and join APNA Mess
                    </p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <Label className="mb-2 block text-gray-500">Full Name</Label>
                        <Input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Enter full name" required />
                    </div>
                    <div>
                        <Label className="mb-2 block text-gray-500">Email</Label>
                        <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" required />
                    </div>
                    <div>
                        <Label className="mb-2 block text-gray-500">Mobile</Label>
                        <Input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Enter mobile number" required />
                    </div>
                    <div>
                        <Label className="mb-2 block text-gray-500">Address</Label>
                        <Input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter address" />
                    </div>
                    <div>
                        <Label className="mb-2 block text-gray-500">Veg or Non-Veg</Label>
                        <Select value={formData.preference} onValueChange={(value) => setFormData({ ...formData, preference: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select preference" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="veg">Veg</SelectItem>
                                <SelectItem value="non-veg">Non-Veg</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="mb-2 block text-gray-500">Plan</Label>
                        <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="premium">Premium</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="mb-2 block text-gray-500">Joining Date</Label>
                        <Input type="date" name="joiningDate" max={today} value={formData.joiningDate} onChange={handleChange} required />
                    </div>
                    <Button
                        type="submit"
                        variant={"ghost"}
                        className="w-full bg-green-800 text-white"
                        disabled={loading}
                    >
                        {loading ? (
                            <Spinner size={20} />
                        ) : (
                            "Submit"
                        )}
                    </Button>

                    <p className='text-center text-sm'>Already have an account? <Link href="/user/login" className='underline'>Login</Link></p>
                </form>
            </Card>
        </main>
    );
}
