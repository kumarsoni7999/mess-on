"use client";
import { useEffect, useState } from "react";
import moment from "moment";
import { addAttendance, getUsersAttandance } from "@/hooks/api/user";
import Spinner from "@/components/ui/spinner";
import { X, Phone } from "lucide-react";
import { getProfileImage } from "@/lib/utils";
import { ProfileImage } from "@/components/ui/profile-image";
import { Input } from "@/components/ui/input";

const Attendance = () => {
    const today = moment().format("YYYY-MM-DD");
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState<any>([])
    const [selectedDate, setSelectedDate] = useState(today);
    const [loading, setLoading] = useState(true);
    const [selectedIdDisable, setSelectedIdDisable] = useState("")
    const [imageModal, setImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        (async () => {
            setLoading(true);
            const { data } = await getUsersAttandance(selectedDate);
            setUsers(data);
            setFilteredUsers(data);
            setLoading(false);
        })()
    }, [selectedDate])

    const handleAttendanceToggle = async (userId: string, shift: "nasta" | "morning" | "night") => {
        setSelectedIdDisable(userId)
        try {
            const res = await addAttendance({
                user_id: userId,
                shift,
                date: selectedDate
            });

            if (res && res?.id) {
                setUsers((prevUsers: any) =>
                    prevUsers.map((user: any) =>
                        user.id === userId
                            ? { ...user, [shift]: user[shift] ? !user[shift] : 1 }
                            : user
                    )
                );
                setFilteredUsers((prevUsers: any) =>
                    prevUsers.map((user: any) =>
                        user.id === userId
                            ? { ...user, [shift]: user[shift] ? !user[shift] : 1 }
                            : user
                    )
                );
            }

        } catch (error) {
            console.error("Error toggling attendance:", error);
        }
        setSelectedIdDisable("")
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
        <div className="flex flex-col h-screen text-white">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="p-4 font-semibold">
                    Attendance
                </div>

                <div className="flex space-x-6">
                    <div className="text-white font-semibold">
                        Morning ({users.filter((user: any) => user?.morning).length})
                    </div>
                    <div className="text-white font-semibold">
                        Night ({users.filter((user: any) => user?.night).length})
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row flex-1">
                <div className="w-full md:w-2/5 lg:w-1/5 p-1 pb-3 sticky top-0 z-10 bg-background">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            {/* Left Button */}
                            <button
                                onClick={() => {
                                    const newDate = new Date(selectedDate);
                                    newDate.setDate(newDate.getDate() - 1);
                                    setSelectedDate(newDate.toISOString().split('T')[0]);
                                }}
                                className="px-3 py-2 bg-green-600 text-white rounded"
                            >
                                ←
                            </button>

                            {/* Date Input */}
                            <input
                                type="date"
                                max={today}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full p-2 bg-gray-800 text-white border border-green-600 rounded"
                            />

                            {/* Right Button */}
                            <button
                                onClick={() => {
                                    const newDate = new Date(selectedDate);
                                    newDate.setDate(newDate.getDate() + 1);
                                    const newDateStr = newDate.toISOString().split('T')[0];
                                    if (newDateStr <= today) {
                                        setSelectedDate(newDateStr);
                                    }
                                }}
                                className="px-3 py-2 bg-green-600 text-white rounded"
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>

                <div className="my-3">
                    <Input type="text" placeholder="Search by name or mobile" onChange={handleSearch}/>
                </div>

                <div className="w-full md:w-3/5 lg:w-4/5 p-1">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-2 w-full">
                        {loading ? <Spinner size={30} /> : (
                            <>
                                {filteredUsers?.length > 0 && filteredUsers?.map((user: any) => {
                                    return (
                                        <div key={user?.id} className="bg-gray-800 p-2 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <ProfileImage 
                                                    username={user?.username} 
                                                    className="w-10 h-10 rounded-full hover:opacity-80 transition-opacity" 
                                                    onClick={handleImageClick} 
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-green-300 italic p-0 m-0">{user.full_name}</h3>
                                                    <small className="text-green-300 italic p-0 m-0">({user.mobile})</small>
                                                </div>
                                                {user.mobile && (
                                                    <button 
                                                        onClick={() => handleCall(user.mobile)}
                                                        className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-100 hover:bg-opacity-10 transition-all"
                                                        title="Call user"
                                                    >
                                                        <Phone size={16} />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex justify-between mt-2">
                                                <div
                                                    className={`w-1/3 p-1 text-center cursor-pointer rounded me-1 ${user?.nasta ? "bg-green-500" : "bg-gray-700"
                                                        }`}
                                                    onClick={() => selectedIdDisable == user?.id ? () => { } : handleAttendanceToggle(user.id, "nasta")}
                                                >
                                                    {selectedIdDisable == user?.id ? <Spinner size={20} /> : "Nasta"}
                                                </div>
                                                <div
                                                    className={`w-1/3 p-1 text-center cursor-pointer rounded me-1 ${user?.morning ? "bg-green-500" : "bg-gray-700"
                                                        }`}
                                                    onClick={() => selectedIdDisable == user?.id ? () => { } : handleAttendanceToggle(user.id, "morning")}
                                                >
                                                    {selectedIdDisable == user?.id ? <Spinner size={20} /> : "Morning"}
                                                </div>
                                                <div
                                                    className={`w-1/3 p-1 text-center cursor-pointer rounded ${user?.night ? "bg-green-500" : "bg-gray-700"
                                                        }`}
                                                    onClick={() => selectedIdDisable == user?.id ? () => { } : handleAttendanceToggle(user.id, "night")}
                                                >
                                                    {selectedIdDisable == user?.id ? <Spinner size={20} /> : "Night"}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </>
                        )}
                    </div>
                </div>

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
        </div>
    );
};

export default Attendance;
