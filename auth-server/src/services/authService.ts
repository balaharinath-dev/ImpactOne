import { loginModel } from "../models/loginModel"
import { createMysqlConnection } from "../server"
import bcrypt from "bcrypt"
import crypto from "crypto"
import env from "../../../main-server/src/utils/cleanEnv"
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express"

export const checkUserExists=async(username:string)=>{
    const connection=await createMysqlConnection()

    const [rows]=await connection.query<any[]>(`
        SELECT id, username, password
        FROM users 
        WHERE username = ?`, 
        [username]
    )

    await connection.end()

    if(rows.length===0) return false
    else return rows
}

export const checkCredentials=async(credentials:loginModel)=>{
    const rows=await checkUserExists(credentials.username)

    if(!rows) return {status:404,message:"Username not found"}

    const user:loginModel=rows[0]

    const checkPassword=await bcrypt.compare(credentials.password||"",user.password||"")

    if(!checkPassword) return {status:401,message:"Invalid password"}

    return {status:200,message:"Login successful",details:user}
}

export const checkOAuthUser=async(profile:any)=>{
    const rows=await checkUserExists(profile.email)

    if(!rows) return {status:202,message:"Google authenticated! But user not found in ImpactOne"}
    else return {status:200,message:"Logged in with Google successfully"}
}

export const createCredentials=async(credentials:loginModel)=>{

    const connection=await createMysqlConnection()

    const [rows]=await connection.query<any[]>(`
        SELECT id
        FROM role 
        WHERE role_name = ?`, 
        [credentials.roleName]
    )

    if(rows.length>0){
        const roleId=rows[0].id

        const sql='INSERT INTO users (id, username, password, role, photo) VALUES (?, ?, ?, ?, ?)'

        const [result] = await connection.query(sql,[credentials.id,credentials.username,credentials.password,roleId,credentials.picture])

        return {status:200,message:"New Google user created"}
    }

    await connection.end()
}



export const createAuthVar=(req:Request,res:Response,id:string,type:string)=>{
    req.session.userId=id
    req.session.type=type
    
    const csrfToken=crypto.createHmac("sha256",env.CSRF_SECRET).update(crypto.randomBytes(64)).digest("hex")
    
    req.session.csrfToken=csrfToken

    res.cookie("ImpactOne-CSRF-Token",csrfToken,{
        httpOnly:true,
        secure:true,
        maxAge:24*60*60*1000,
        sameSite:"strict"
    })

    const header={
        alg:'HS256',
        typ:'JWT'
        }
        
    const payload = {
        userId:id,
        iat:Math.floor(Date.now()/1000),
        exp:Math.floor(Date.now()/1000)+(24*60*60)
    }

    res.cookie("ImpactOne-JWT-Token",jwt.sign(payload,env.JWT_SECRET,{header}),{
        httpOnly:true,
        secure:true,
        maxAge:24*60*60*1000,
        sameSite:"strict"
    })
}