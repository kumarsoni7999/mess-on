import { getUserAttandances, getUserDetails } from "@/hooks/api/user"
import { formatDate } from "@/lib/dateformat"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Spinner from "../ui/spinner"
import { ProfileImage } from "../ui/profile-image"
import { X } from "lucide-react"
import { MySocialProfile } from "../socials/Mysocials"

export const UserDetail = ({ username }: any) => {

    const router = useRouter()

    const [userDetails, setUserDetails] = useState<any>(null)
    const [attendance, setAttendance] = useState([])
    const [loading, setLoading] = useState(true)
    const [imageModal, setImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const [enableCalculate, setEnableCalculate] = useState(false)
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const [missingDates, setMissingDates] = useState<string[]>([])
    const [mealCounts, setMealCounts] = useState({ nasta: 0, morning: 0, night: 0 })

    const handleImageClick = (imageSrc: string) => {
        setSelectedImage(imageSrc);
        setImageModal(true);
    };

    useEffect(() => {
        const getUserDetail = async () => {
            if (username) {
                const res = await getUserDetails(username)
                if (res?.data) {
                    setUserDetails(res.data)
                }

                const attend = await getUserAttandances(username)
                if (attend?.data) {
                    const data = attend.data
                    setAttendance(data)

                    const dates = data.map((a: any) => new Date(a.date))
                    const min = new Date(Math.min(...dates))
                    const max = new Date(Math.max(...dates))

                    // Format to yyyy-mm-dd for input
                    const formatInputDate = (d: Date) => d.toISOString().split('T')[0]
                    setFromDate(formatInputDate(min))
                    setToDate(formatInputDate(max))
                }
            } else {
                router.push('/user/login')
            }
        }

        setLoading(true)
        getUserDetail()
        setLoading(false)
    }, [username])

    const getAllDatesBetween = (start: string, end: string) => {
        const dateList = []
        let current = new Date(start)
        const last = new Date(end)
        while (current <= last) {
            dateList.push(current.toISOString().split('T')[0])
            current.setDate(current.getDate() + 1)
        }
        return dateList
    }

    const handleSubmit = () => {
        const allDates = getAllDatesBetween(fromDate, toDate)
        const attendanceDates = attendance.map((a: any) => a?.date?.split('T')[0])
        const missing = allDates.filter(date => !attendanceDates.includes(date))
        setMissingDates(missing)

        // Filter attendance within date range
        const filtered = attendance.filter((a: any) => {
            const date = a.date.split('T')[0]
            return date >= fromDate && date <= toDate
        })

        const nastaCount = filtered.filter((a: any) => a?.nasta).length
        const morningCount = filtered.filter((a: any) => a?.morning).length
        const nightCount = filtered.filter((a: any) => a?.night).length

        setMealCounts({
            nasta: nastaCount,
            morning: morningCount,
            night: nightCount
        })
    }

    const resetCalculate = () => {
        // Reset meal counts and missing dates
        setMealCounts({ nasta: 0, morning: 0, night: 0 })
        setMissingDates([])
    
        // Reset date range to full min-max based on attendance
        if (attendance.length > 0) {
            const dates: any = attendance.map((a: any) => new Date(a.date))
            const min = new Date(Math.min(...dates))
            const max = new Date(Math.max(...dates))
            const formatInputDate = (d: Date) => d.toISOString().split('T')[0]
            setFromDate(formatInputDate(min))
            setToDate(formatInputDate(max))
        }
    }

    return (
        <>
            {!loading ? <div className="p-0 pt-4 overflow-auto">
                <div className="my-3">
                    <h4>Personal Details</h4>
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <ProfileImage
                        username={userDetails?.username}
                        className="w-20 h-20 rounded-full hover:opacity-80 transition-opacity"
                        onClick={handleImageClick}
                    />
                    <div>
                        <h3 className="text-xl font-semibold">{userDetails?.full_name}</h3>
                        <p className="text-gray-400">{userDetails?.username}</p>
                    </div>
                </div>

                <div className="flex">
                    <h5 style={{ width: 120 }} className="text-gray-400">ID </h5>
                    <p>{userDetails?.username || '-'}</p>
                </div>
                <div className="flex">
                    <h5 style={{ width: 120 }} className="text-gray-400">Name </h5>
                    <p>{userDetails?.full_name}</p>
                </div>
                <div className="flex">
                    <h5 style={{ width: 120 }} className="text-gray-400">Email </h5>
                    <p>{userDetails?.email || '-'}</p>
                </div>
                <div className="flex">
                    <h5 style={{ width: 120 }} className="text-gray-400">Mobile </h5>
                    <p>{userDetails?.mobile || '-'}</p>
                </div>
                <div className="flex">
                    <h5 style={{ width: 120 }} className="text-gray-400">Address </h5>
                    <p>{userDetails?.address || '-'}</p>
                </div>
                <div className="flex">
                    <h5 style={{ width: 120 }} className="text-gray-400">Joining Date </h5>
                    <p>{userDetails?.joiningDate || '-'}</p>
                </div>
                <div className="flex">
                    <h5 style={{ width: 120 }} className="text-gray-400">Gender </h5>
                    <p>{userDetails?.gender || '-'}</p>
                </div>

                <div className="my-6">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold">Attendance (Last 45 days)</h4>
                        <div className="border p-1 px-3 border-1 border-[green] rounded" onClick={() => {
                            !enableCalculate && resetCalculate()
                            setEnableCalculate(true)
                        }}>
                            <p className="p-0 m-0 text-sm">Calculate</p>
                        </div>
                    </div>

                    {enableCalculate && (
                        <div className="my-4 space-y-2 border p-3 rounded">
                            <div className="flex gap-1 mb-3">
                                <div>
                                    <label className="text-sm">From Date</label>
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={e => setFromDate(e.target.value)}
                                        className="border p-2 rounded bg-[#00000000]"
                                        min={fromDate}
                                        max={toDate}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm">To Date</label>
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={e => setToDate(e.target.value)}
                                        className="border p-2 rounded bg-[#00000000]"
                                        min={fromDate}
                                        max={toDate}
                                    />
                                </div>
                            </div>
                            <button
                                className="mt-4 border text-white px-4 py-1 rounded me-2"
                                onClick={() => {
                                    resetCalculate()
                                    setEnableCalculate(false)
                                }}
                            >
                                Close
                            </button>
                            <button
                                className="mt-4 bg-green-600 text-white px-4 py-1 rounded"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                            {(mealCounts.nasta > 0 || mealCounts.morning > 0 || mealCounts.night > 0) && (
                                <div className="mt-4">
                                    <h4 className="font-semibold">Meal Counts:</h4>
                                    <div className="flex gap-6 text-sm mt-1">
                                        <p><strong>Nasta:</strong> {mealCounts.nasta}</p>
                                        <p><strong>Morning:</strong> {mealCounts.morning}</p>
                                        <p><strong>Night:</strong> {mealCounts.night}</p>
                                    </div>
                                </div>
                            )}
                            {missingDates.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="font-semibold">Missing Dates: {missingDates.length}</h4>
                                    <ul className="list-disc list-inside text-sm max-h-40 overflow-y-auto">
                                        {missingDates.map((date, i) => (
                                            <li key={i}>{date}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="overflow-x-auto rounded-lg border border-gray-300">
                        <table className="min-w-full table-auto">
                            <thead className="border-b border-gray-300">
                                <tr className="text-left">
                                    <th className="px-4 py-2">#</th>
                                    <th className="px-4 py-2 ps-1">Date</th>
                                    <th className="px-4 py-2">Nasta</th>
                                    <th className="px-4 py-2">Morning</th>
                                    <th className="px-4 py-2">Night</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance?.length > 0 && attendance?.map((item: any, index: number) => (
                                    <tr
                                        key={index}
                                        className={"bg-gray"}
                                    >
                                        <td className="px-4 pe-0 py-2">{index + 1}</td>
                                        <td className="px-4 ps-1 py-2">{formatDate(item?.date)}</td>
                                        <td className="px-4 py-2">
                                            {item?.nasta ? "✅" : "❌"}
                                        </td>
                                        <td className="px-4 py-2">
                                            {item?.morning ? "✅" : "❌"}
                                        </td>
                                        <td className="px-4 py-2">
                                            {item?.night ? "✅" : "❌"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {attendance?.length == 0 && <p className="text-center w-100 my-5">No attendance</p>}
                    </div>
                </div>

            </div> : <Spinner size={30} />}

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

            <MySocialProfile />
        </>
    )
}