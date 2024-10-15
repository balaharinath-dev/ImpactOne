import express, { Request, Response, NextFunction, json } from "express"
import helmet from "helmet"
import cors from "cors"
import sessionMiddleware from "./middlewares/sessionMiddleware"
import createHttpError, {isHttpError} from "http-errors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import authRouter from "./routes/authRouter"
import passport from "passport"
import { googleStrategy } from "./middlewares/googleMiddlwares"

export const httpApp=express()
export const mainApp=express()

httpApp.use((req:Request,res:Response,next:NextFunction)=>{
    if(req.secure) next()
    else res.redirect(`https://localhost:8843${req.url}`)
})

mainApp.use(helmet())

mainApp.use(cors({
    origin:"https://localhost:8443/",
    methods:"*",
    credentials:true,
}))

mainApp.use(morgan("dev"))

mainApp.use(cookieParser())

mainApp.use(sessionMiddleware)

mainApp.use(express.json())

mainApp.use(passport.initialize())

mainApp.use(passport.session())

passport.use(googleStrategy)

passport.serializeUser((user,done)=>{
    done(null,user)
})

passport.deserializeUser((obj:any,done)=>{
    done(null,obj)
})

mainApp.use("/auth",authRouter)

mainApp.use((req:Request,res:Response,next:NextFunction)=>{
    next(createHttpError(404,"Endpoint not found"))
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
mainApp.use((error:unknown,req:Request,res:Response,next:NextFunction)=>{
    console.error(error)
    let statusCode=500
    let errorMessage="An unknown error occured"
    if(isHttpError(error)){
        statusCode=error.statusCode
        errorMessage=error.message
    }
    res.status(statusCode).json({message:errorMessage})
})