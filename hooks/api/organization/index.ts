import { ENV } from "@/env";

export const organizationLogin = async (mobile: string, password: string) => {
    try {
        const path = `${ENV.API}/organizations/login`;
        const response = await fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ mobile, password }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error logging in organization:", error);
        throw error;
    }
}