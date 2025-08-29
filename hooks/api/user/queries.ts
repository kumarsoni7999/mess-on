import { generateUsername } from "@/lib/generateUsername";
import { query } from "../../../config/db";
import { v4 as uuidv4 } from 'uuid';

interface User {
  id?: string,
  full_name: string;
  email: string;
  mobile: string;
  address: string;
  preference: string;
  plan: string;
  joiningDate: string;
  organization: string;
}

export const getAllUsers = async (org_id: string): Promise<User[]> => {
  try {
    const sql = "SELECT * FROM mess_users WHERE active = 1 AND organization = ? ORDER BY created_at DESC";
    const result: any = await query(sql, [org_id]);
    return result;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

export const createOrUpdateUser = async (userData: User): Promise<string> => {
  const {
    id: userId,
    full_name,
    email,
    mobile,
    address,
    preference,
    plan,
    joiningDate,
    organization
  } = userData;

  const id = userId || uuidv4(); // Use existing ID or generate a new one
  const username = generateUsername(full_name);

  try {
    // Check if user with the given ID already exists
    let existingUserCheck: any = await query(
      `SELECT id FROM mess_users WHERE id = ? AND organization = ?`,
      [id, organization]
    );

    if (existingUserCheck.length > 0) {
      // User exists, perform an update
      const updateSql = `
        UPDATE mess_users 
        SET full_name = ?, email = ?, mobile = ?, address = ?, permanent_address = ?, 
            preference = ?, plan = ?, joiningDate = ?, username = ?
        WHERE id = ? AND organization = ?
      `;

      await query(updateSql, [
        full_name,
        email,
        mobile,
        address,
        address,
        preference,
        plan,
        joiningDate,
        username,
        id,
        organization
      ]);

      return id; // Return updated user ID
    } else {
      // User doesn't exist, insert new
      const insertSql = `
        INSERT INTO mess_users (id, full_name, email, mobile, address, permanent_address, preference, plan, joiningDate, username, organization) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await query(insertSql, [
        id,
        full_name,
        email,
        mobile,
        address,
        address,
        preference,
        plan,
        joiningDate,
        username,
        organization
      ]);

      return id; // Return new user ID
    }
  } catch (error) {
    console.error("Error in createOrUpdateUser:", error);
    throw error;
  }
};

export const getUsersAttandance = async (date: string, organization: string) => {
  try {
    return await query(`
      SELECT 
        u.*,
        MAX(CASE WHEN a.shift = 'morning' THEN true END) AS morning,
        MAX(CASE WHEN a.shift = 'night' THEN true END) AS night,
        MAX(CASE WHEN a.shift = 'nasta' THEN true END) AS nasta
      FROM mess_users u
      LEFT JOIN mess_user_attendance a 
        ON u.id = a.user_id AND a.date = ? AND a.active = 1
      WHERE u.active = 1 AND u.organization = ?
      GROUP BY u.id
      ORDER BY u.created_at DESC
      `, [date, organization])
  } catch (error) {
    console.error("Error getting users attendance:", error);
    throw error;
  }
}

export const addUserAttendance = async (attendanceData: { user_id: string, date: string, shift: string, organization: string }) => {
  const { user_id, date, shift, organization } = attendanceData;

  try {
    // First verify the user belongs to the organization
    const userCheck = await query(
      `SELECT id FROM mess_users WHERE id = ? AND organization = ? AND active = 1`,
      [user_id, organization]
    );

    if (userCheck.length === 0) {
      throw new Error("User not found in this organization");
    }

    let existingRecord = await query(
      `SELECT id, active FROM mess_user_attendance WHERE user_id = ? AND date = ? AND shift = ? AND organization = ?`, 
      [user_id, date, shift, organization]
    );

    if (existingRecord.length > 0) {
      const newActiveState = existingRecord[0].active === 1 ? 0 : 1;
      await query(`UPDATE mess_user_attendance SET active = ? WHERE id = ?`, [newActiveState, existingRecord[0].id]);
      return { id: existingRecord[0].id, active: newActiveState };
    } else {
      const id = uuidv4();
      await query(
        `INSERT INTO mess_user_attendance (id, user_id, shift, date, active, organization) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, user_id, shift, date, 1, organization]
      );
      return { id, active: 1 };
    }
  } catch (error) {
    console.error("Error toggling attendance:", error);
    throw error;
  }
};

export const getUserDetails = async (username: string, organization?: string) => {
  try {
    let sql = `SELECT * FROM mess_users WHERE (username = ? OR mobile = ?) AND active = 1`;
    let params = [username, username];
    
    if (organization) {
      sql += ` AND organization = ?`;
      params.push(organization);
    }
    
    let user = await query(sql, params);
    return user?.length > 0 ? user[0] : null;
  } catch (error) {
    console.error("Error getting user details:", error);
    throw error;
  }
}

export const getUserAllAttendance = async (username: string, organization: string) => {
  try {
    const existUser = await query(
      `SELECT id FROM mess_users WHERE username = ? AND organization = ? AND active = 1`,
      [username, organization]
    );

    if (!existUser || existUser.length === 0) return [];

    const attendanceRaw = await query(
      `SELECT date, shift FROM mess_user_attendance 
       WHERE user_id = ? AND organization = ? AND active = 1 
       ORDER BY date DESC`,
      [existUser[0].id, organization]
    );

    const groupedAttendance: Record<string, any> = {};

    attendanceRaw.forEach((entry: any) => {
      const { date, shift } = entry;
      if (!groupedAttendance[date]) {
        groupedAttendance[date] = {
          date,
          nasta: false,
          morning: false,
          night: false,
        };
      }

      if (shift === "nasta") groupedAttendance[date].nasta = true;
      if (shift === "morning") groupedAttendance[date].morning = true;
      if (shift === "night") groupedAttendance[date].night = true;
    });

    // Return last 45 days of grouped attendance
    return Object.values(groupedAttendance).slice(0, 45);
  } catch (error) {
    console.error("Error getting user's attendance:", error);
    throw error;
  }
};

export const deleteUser = async (id: string, organization: string) =>{
  try {
    const existUser = await query(
      `SELECT id FROM mess_users WHERE id = ? AND organization = ? AND active = 1`,
      [id, organization]
    );
    
    if(existUser && existUser.length > 0){
      await query(`UPDATE mess_users SET active = 0 WHERE id = ? AND organization = ?`, [id, organization]);
      return { message: "User deleted" };
    }

    return { message: "No user found" };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
