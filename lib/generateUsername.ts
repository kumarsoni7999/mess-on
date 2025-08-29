export const generateUsername = (name: string) => {
    let firstName = name.split(" ")[0].toUpperCase(); // Extract first name and convert to uppercase
    firstName = firstName.length > 10 ? firstName.substring(0, 10) : firstName; // Limit to 8 chars
    
    const randomNum = Math.floor(1000000 + Math.random() * 9000000); // Generate a 7-digit number
    return `${firstName}_${randomNum}`;
}