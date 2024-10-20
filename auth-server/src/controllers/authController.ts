import { NextFunction, RequestHandler, Request, Response } from "express";
import { loginModel } from "../models/loginModel";
import { checkCredentials, checkNewUser, checkOAuthUser, createNewUser, sendOTP, verifyOTPValue } from "../services/authService";
import { createAuthVar } from "../services/authService";

export const login:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    const credentials:loginModel=req.body

    try{
        const response=await checkCredentials(credentials)

        if(response.status===200){
            createAuthVar(req,res,response.details?.id||"","user")
        }
        
        res.status(response.status).json({"response":response.message})
    }
    catch(error){
        next(error)
    }
}

export const googleCallback:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    const googleProfile=req.user?._json

    try{
        const response=await checkOAuthUser(googleProfile)

        if(response.status==200){
             createAuthVar(req,res,googleProfile?.sub||"","user")

            return res.json({"status":response.status,"response":response.message})
        }
        else{
            createAuthVar(req,res,googleProfile?.sub||"","registerGoogle")

            res.json({"status":response.status,"response":response.message,"details":googleProfile})
        }
    }
    catch(error){
        next(error)
    }
}

export const googleNewUser:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    const credentials:loginModel=req.body

    try{
        const response=await createNewUser(credentials,true)

        res.json({"status":response?.status,"message":response?.message})
    }
    catch(error){
        next(error)
    }
}

export const signup:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    const username:string=req.body.username

    try{
        const response=await checkNewUser(username)

        if(response?.status===202){
            await sendOTP(response.details?.otpValue||"")
            return res.json({"status":response?.status,"message":response?.message,details:response.details?.otpValue})
        }
        else res.json({"status":response?.status,"message":response?.message})

    }
    catch(error){
        next(error)
    }
}

export const verifyOTP:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    const username:string=req.body.username
    const otp:string=req.body.otp

    try{
        const response=await verifyOTPValue(otp)

        if(response.status===200){
            createAuthVar(req,res,`temp_${username}_${Date.now()}`||"","register")
        }
        res.json({"status":response?.status,"message":response?.message})
    }
    catch(error){
        next(error)
    }
}

export const newUser:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    const credentials:loginModel=req.body

    try{
        const response=await createNewUser(credentials,false)
        
    }
    catch(error){
        next(error)
    }
}