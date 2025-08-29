import { ENV } from "@/env";

// Function to get all users
export default async function getUsers() {
    const path = `${ENV.API}/users`;

    try {
        const response = await fetch(path, { 
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            console.error("API Error:", response.status, response.statusText);
            return null; 
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch failed:", error);
        return null;
    }
}
// Function to create a new user
export async function createUser(userData: any) {
    const path = `${ENV.API}/users`;

    try {
        const response = await fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            console.error("API Error:", response.status, response.statusText);
            return null; 
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch failed:", error);
        return null;
    }
}

export async function getUsersAttandance(date: string, username?: string) {
    let path = `${ENV.API}/attendance?date=${date}`;

    if(username){
        path += `&username=${username}`
    }

    try {
        const response = await fetch(path, { 
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            console.error("API Error:", response.status, response.statusText);
            return null; 
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch failed:", error);
        return null;
    }
}

export async function getUserAttandances(username?: string) {
    let path = `${ENV.API}/attendance/${username}`;

    try {
        const response = await fetch(path, { 
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            console.error("API Error:", response.status, response.statusText);
            return null; 
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch failed:", error);
        return null;
    }
}

export async function addAttendance(attendanceData: any) {
    const path = `${ENV.API}/attendance`;

    try {
        const response = await fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(attendanceData),
        });

        if (!response.ok) {
            console.error("API Error:", response.status, response.statusText);
            return null; 
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch failed:", error);
        return null;
    }
}

export async function userLogin(username: string) {
    const path = `${ENV.API}/users/${username}`;

    try {
        const response = await fetch(path, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            console.error("API Error:", response.status, response.statusText);
            return null; 
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch failed:", error);
        return null;
    }
}

export async function getUserDetails(username: string){
    const path = `${ENV.API}/users/${username}`;

    try {
        const response = await fetch(path, { 
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            console.error("API Error:", response.status, response.statusText);
            return null; 
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch failed:", error);
        return null;
    }
}

export async function userDelete(id: string) {
    const path = `${ENV.API}/users`;

    try {
        const response = await fetch(path, { 
            method: "DELETE",
            body: JSON.stringify( {
                id: id
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            console.error("API Error:", response.status, response.statusText);
            return null; 
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch failed:", error);
        return null;
    }
}
