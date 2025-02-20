import { Request, Response, NextFunction } from "express"
import env from "../../../main-server/src/utils/cleanEnv"
import jwt, { decode } from "jsonwebtoken"

export const authMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    console.log("Reached")
    if(!req.session.userId||req.session.type!=="user") return res.status(401).json({message:"Unauthorized access"})
    
    const tokenFromClient=req.cookies["ImpactOne-CSRF-Token"]
    const storedToken=req.session.csrfToken

    if(!storedToken||storedToken!==tokenFromClient) return res.status(401).json({error:"CSRF Token invalidity"})

    const jwToken=req.cookies["ImpactOne-JWT-Token"]

    if(!jwToken) return res.status(401).json({error:"No JWT Token provided"})

    jwt.verify(jwToken,env.JWT_SECRET,(err:any,decoded:any)=>{
        if(err) return res.status(401).json({error:"JWT Token invalidity"})

        next()
    })
}