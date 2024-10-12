import { Request, Response, NextFunction } from "express"
import crypto from "crypto"
import env from "../utils/cleanEnv"
import session from "express-session"

interface customSession extends session.SessionData{
    csrfToken?:string
}

const CSRF_SECRET=env.CSRF_SECRET

const generateCSRFToken=(secret:string):string=>{
    return crypto.createHmac("sha256",secret)
                 .update(crypto.randomBytes(64))
                 .digest("hex")
}

export const csrfTokenMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const csrfToken:string=generateCSRFToken(CSRF_SECRET);

    (req.session as customSession).csrfToken=csrfToken

    res.json({"X-CSRF-Token":csrfToken})

    next()
}

export const verifyCSRFToken=(req:Request,res:Response,next:NextFunction)=>{
    const tokenFromClient=req.headers["X-CSRF-Token"]||req.body.csrfToken||""
    const storedToken=(req.session as customSession).csrfToken

    if(!storedToken||storedToken!==tokenFromClient)
        res.status(403).json({error:"CSRF Token invalidity"})

    next()
}