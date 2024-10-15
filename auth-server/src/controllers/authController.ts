import { NextFunction, RequestHandler, Request, Response } from "express";
import { loginModel } from "../models/loginModel";
import { checkCredentials, checkOAuthUser, checkUserExists, createCredentials } from "../services/authService";
import { createAuthVar } from "../services/authService";

export const login:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    const credentials:loginModel=req.body

    try{
        const credentialsResponse=await checkCredentials(credentials)

        if(credentialsResponse.status===200){
            createAuthVar(req,res,credentialsResponse.details?.id||"","user")
        }
        
        res.status(credentialsResponse.status).json({"response":credentialsResponse.message})
    }
    catch(error){
        next(error)
    }
}

export const googleCallback:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    const googleProfile=req.user?._json
    console.log(googleProfile)

    try{
        const userCheck=await checkOAuthUser(googleProfile)

        if(userCheck.status==200){
             createAuthVar(req,res,googleProfile?.sub||"","user")

            return res.json({"status":userCheck.status,"response":userCheck.message})
        }
        else{
            createAuthVar(req,res,googleProfile?.sub||"","registerGoogle")

            res.json({"status":userCheck.status,"response":userCheck.message,"details":googleProfile})
        }
    }
    catch(error){
        next(error)
    }
}

export const googleNewUser:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    const credentials:loginModel=req.body

    try{
        await createCredentials(credentials)
        res.json({"status":200,"message":"User created"})
    }
    catch(error){
        next(error)
    }
}

