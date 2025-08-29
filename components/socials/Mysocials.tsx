import { Facebook, Instagram, Github, Linkedin } from "lucide-react"

export const MySocialProfile = () => {
    return (
        <div className="text-center text-gray-500 text-sm mt-4 flex flex-col gap-2">
            <p>All Rights Reserved @ 2025</p>
            <p>Designed and Created by Rahul Soni</p>
            <p>For any queries, contact: <a href="mailto:rahulsoni@gmail.com" className="text-blue-500">rahulsoni@gmail.com</a> or <a href="tel:7999585307" className="text-blue-500">Call</a></p>

            <div className="flex justify-center gap-2">
                <div onClick={() => window.open('https://www.instagram.com/unreachable_rahul/', '_blank')}>
                    <Instagram />
                </div>
                <div onClick={() => window.open('https://www.facebook.com/profile.php?id=100028863981154', '_blank')}>
                    <Facebook />
                </div>
                <div onClick={() => window.open('https://www.linkedin.com/in/rahul-soni-275521224/', '_blank')}>
                    <Linkedin />
                </div>
                <div onClick={() => window.open('https://github.com/kumarsoni7999', '_blank')}>
                    <Github />
                </div>
            </div>
        </div>
    )
}