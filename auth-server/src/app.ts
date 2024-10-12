import express, { Request, Response, NextFunction } from "express"
import helmet from "helmet"
import cors from "cors"
// import sessionMiddleware from "./middlewares/sessionMiddleware"

export const httpApp=express()
export const mainApp=express()

httpApp.use((req:Request,res:Response,next:NextFunction)=>{
    if(req.secure) next()
    else res.redirect(`https://localhost:8843${req.url}`)
})

mainApp.use(helmet())

mainApp.use(cors())

// mainApp.use(sessionMiddleware)

mainApp.get("/",(req,res)=>{
    res.send("Auth Server")
})