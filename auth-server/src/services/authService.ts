import { loginModel } from "../models/loginModel"
import { createMysqlConnection } from "../server"
import bcrypt from "bcrypt"

export const checkCredentials=async(credentials:loginModel)=>{
    const connection=await createMysqlConnection()

    const [roleRows]=await connection.query<any[]>(`
        SELECT id 
        FROM roles 
        WHERE role_name = ?`, 
        [credentials.roleName]
    )

    if(roleRows.length===0){
        await connection.end();
        return {status:404,message:"Role not found"};
    }

    const roleId=roleRows[0].id;

    const [rows]=await connection.query<any[]>(`
        SELECT id, username, password, role_id 
        FROM users 
        WHERE username = ? AND role_id = ?`, 
        [credentials.username, roleId]
    )

    await connection.end()

    if(rows.length===0) return {status:404,message:"Username not found"}

    const user:loginModel=rows[0]

    const checkPassword=await bcrypt.compare(credentials.password||"",user.password||"")

    if(!checkPassword) return {status:401,message:"Invalid password"}

    return {status:200,message:"Login successful",details:user}
}