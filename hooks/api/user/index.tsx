import { ENV } from "@/env";

const getOrganizationId = async () => {
    const admin = localStorage.getItem('admin');
    const organizationId = admin ? JSON.parse(admin).id : null;
    return organizationId;
}

export const getUser = async () => {
    const user = localStorage.getItem('user');
    const userData = user ? JSON.parse(user) : null;
    return userData;
}

// Function to get all users
export default async function getUsers() {
    const org_id = await getOrganizationId();
    if(!org_id){
        return null;
    }
    const path = `${ENV.API}/users?organization=${org_id}`;

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
    const org_id = await getOrganizationId();
    if(!org_id){
        return null;
    }
    const path = `${ENV.API}/users`;

    try {
        const response = await fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({...userData, organization: org_id}),
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
    const org_id = await getOrganizationId();
    if(!org_id){
        return null;
    }
    let path = `${ENV.API}/attendance?date=${date}&organization=${org_id}`;

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
    const org_id = await getOrganizationId();
    if(!org_id){
        return null;
    }
    let path = `${ENV.API}/attendance/${username}?organization=${org_id}`;

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
    const org_id = await getOrganizationId();
    if(!org_id){
        return null;
    }
    const path = `${ENV.API}/attendance`;

    try {
        const response = await fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({...attendanceData, organization: org_id}),
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
    const org_id = await getOrganizationId();
    if(!org_id){
        return null;
    }
    const path = `${ENV.API}/users/${username}`;

    try {
        const response = await fetch(path, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({organization: org_id}),
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
    const org_id = await getOrganizationId();
    if(!org_id){
        return null;
    }
    const path = `${ENV.API}/users`;

    try {
        const response = await fetch(path, {
            method: "DELETE",
            body: JSON.stringify( {
                id: id,
                organization: org_id
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
