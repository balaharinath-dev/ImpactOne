import { NextFunction, RequestHandler, Request, Response } from "express";
import { loginModel } from "../models/loginModel";
import { checkCredentials } from "../services/authService";
import crypto from "crypto"
import env from "../../../main-server/src/utils/cleanEnv"
import jwt from "jsonwebtoken";

export const login:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    const credentials:loginModel=req.body

    try{
        const credentialsResponse=await checkCredentials(credentials)

        if(credentialsResponse.status===200){
            req.session.userId=credentialsResponse.details?.id
            
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
                userId:credentialsResponse.details?.id,
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
        
        res.status(credentialsResponse.status).json({"response":credentialsResponse.message})
    }
    catch(error){
        next(error)
    }
}