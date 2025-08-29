"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NotFound } from "@/components/notFound/notFound";
import getUsers, { createUser, getUser, userDelete } from "@/hooks/api/user";
import Spinner from "@/components/ui/spinner";  // Make sure you have a spinner component, or use any from a UI library like React Spinner
import { formatDate } from "@/lib/dateformat";
import Link from "next/link";
import { Pencil, Share2, Trash2, X, Phone } from "lucide-react";
import { getProfileImage } from "@/lib/utils";
import { ProfileImage } from "@/components/ui/profile-image";

const Users = () => {
    let today = new Date().toISOString().split("T")[0]
    const defaultUserDetails = {
        id: "",
        full_name: "",
        email: "",
        mobile: "",
        address: "",
        preference: "non-veg",
        plan: "basic",
        joiningDate: today,
        username: ""
    }
    const [user, setUser] = useState<any>(null);
    const [open, setOpen] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [users, setUsers] = useState<any>([]);
    const [formData, setFormData] = useState(defaultUserDetails);
    const [loading, setLoading] = useState(true);
    const [filteredUsers, setFilteredUsers] = useState<any>([]);
    const getAllUsers = async () => {
        setLoading(true);
        const { data } = await getUsers();
        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        (async () => {
            const user = await getUser();
            if(user){
                setUser(user);
            }
        })();
        getAllUsers();
    }, []);

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
                getAllUsers()
            }
            setLoading(false);
            setOpen(false);
        }
    };

    const deleteUser = async (user: any) => {
        if (confirm('Are you sure to delete')) {
            const res = await userDelete(user?.id)
            if (res) {
                getAllUsers()
                alert(res?.message || "User deleted successfully")
            }
        }
    }

    const share = async (textToShare: string) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Mess ON',
                    text: textToShare
                });
                console.log('Shared successfully');
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // fallback if Web Share API is not supported
            await navigator.clipboard.writeText(textToShare);
            alert('Copied registration link to clipboard.');
        }
    }

    const handleShareUserDetails = async (userItem: any) => {
        const textToShare = `Hii, ${userItem?.full_name}. Check your daily meal on ${window.location.origin}/user/${userItem?.username}. Your login ID is ${userItem?.username}.`;
        await share(textToShare)
    };

    const handleImageClick = (imageSrc: string) => {
        setSelectedImage(imageSrc);
        setImageModal(true);
    };

    const handleCall = (mobile: string) => {
        if (mobile) {
            window.open(`tel:${mobile}`, '_self');
        }
    };

    const handleSearch = (e: any) => {
        const searchTerm = e.target.value;
        const filteredUsers = users.filter((user: any) => user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || user.mobile.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredUsers(filteredUsers);
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="text-xl font-bold">Users ({users?.length || 0})</h4>
                <Button
                    variant="secondary"
                    className="bg-primary text-white hover:bg-gray-700 text-xs"
                    onClick={() => {
                        setOpen(true)
                        setFormData(defaultUserDetails)
                    }}
                >
                    Create New User
                </Button>
            </div>

            <div>
                <Input type="text" placeholder="Search by name" onChange={handleSearch}/>
            </div>

            {filteredUsers.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Profile</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Mobile</TableHead>
                            {/* <TableHead>Email</TableHead>
                            <TableHead>Preference</TableHead>
                            <TableHead>Plan</TableHead> */}
                            <TableHead>Address</TableHead>
                            <TableHead>Joining Date</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user: any, index: any) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell>
                                        <ProfileImage
                                            username={user?.username}
                                            className="w-10 h-10 rounded-full hover:opacity-80 transition-opacity"
                                            onClick={handleImageClick}
                                        />
                                    </TableCell>
                                    <TableCell><Link href={`/dashboard/users/${user.username}`} className="underline">{user.username || '-'}</Link></TableCell>
                                    <TableCell>{user.full_name || '-'}</TableCell>
                                    <TableCell>{user.mobile || '-'}</TableCell>
                                    {/* <TableCell>{user.email || '-'}</TableCell>
                                <TableCell>{user.preference || '-'}</TableCell>
                                <TableCell>{user.plan || '-'}</TableCell> */}
                                    <TableCell>{user.address || '-'}</TableCell>
                                    <TableCell>{formatDate(user.joiningDate) || '-'}</TableCell>
                                    <TableCell className="flex gap-3 items-center">
                                        {user?.whatsapp_group && <button className="text-green-500 hover:text-green-700 border border-green-500 rounded-md px-2 py-1" onClick={() => {
                                            const textToShare = `Hii, ${user?.full_name}. Join our Mess ON whatsapp group ${user?.whatsapp_group}. You can track your daily meal on ${window.location.origin}/user/${user?.username}.`;
                                            window.open(`https://wa.me/${user.mobile}?text=${encodeURIComponent(textToShare)}`, '_self');
                                        }}>
                                            Whatsapp
                                        </button>}
                                        {user.mobile && (
                                            <button
                                                className="text-green-500 hover:text-green-700"
                                                onClick={() => handleCall(user.mobile)}
                                                title="Call user"
                                            >
                                                <Phone size={18} />
                                            </button>
                                        )}
                                        <button className="text-green-500 hover:text-green-700" onClick={() => {
                                            setOpen(true)
                                            setFormData(user)
                                        }}>
                                            <Pencil size={18} />
                                        </button>
                                        <button className="text-blue-500 hover:text-blue-700" onClick={() => handleShareUserDetails(user)}>
                                            <Share2 size={18} />
                                        </button>
                                        <button className="text-red-500 hover:text-red-700" onClick={() => deleteUser(user)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            ) : (
                <>
                    {loading ? <Spinner size={30} /> : <NotFound />}
                </>
            )}

            {/* Off-Canvas Modal */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                    <div className="w-96 bg-black shadow-[0_4px_10px_rgba(200,200,200,0.2)] p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Create New User</h2>
                            <Button variant="ghost" onClick={() => setOpen(false)}>✕</Button>
                        </div>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <Label className="mb-2 block text-gray-500">Full Name</Label>
                                <Input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Enter full name" required />
                            </div>
                            {/* <div>
                                <Label className="mb-2 block text-gray-500">Email</Label>
                                <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" required />
                            </div> */}
                            <div>
                                <Label className="mb-2 block text-gray-500">Mobile</Label>
                                <Input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Enter mobile number" required />
                            </div>
                            <div>
                                <Label className="mb-2 block text-gray-500">Address</Label>
                                <Input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter address" />
                            </div>
                            {/* <div>
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
                            </div> */}
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
                        </form>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {imageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl max-h-[90vh] w-full">
                        <button
                            onClick={() => setImageModal(false)}
                            className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
                        >
                            <X size={24} />
                        </button>
                        <img
                            src={selectedImage}
                            alt="Full size profile"
                            className="w-full h-full object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
