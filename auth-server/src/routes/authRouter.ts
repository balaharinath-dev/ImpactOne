import express from "express"
import * as authControllers from "../controllers/authController"
import { loginLimiter } from "../middlewares/loginLimiter"
import { authMiddleware } from "../middlewares/authMiddleware"
import { googleCallback, googleAuth } from "../middlewares/googleMiddlwares"
import { Profile } from 'passport-google-oauth20'

const authRouter=express.Router()
declare module "express-session" {
    interface SessionData {
      userId:string,
      csrfToken:string,
      type:string,
      otp:string,
      optSecret:string,
    }
  }
declare global{
  namespace Express{
    interface User extends Profile{
      _json:{
        sub:string,
        email:string,
        name:string,
        picture:string
      }
    }
  }
}

authRouter.post("/login",loginLimiter,authControllers.login)

authRouter.get("/google",loginLimiter,googleAuth)

authRouter.get("/google/callback",googleCallback,authControllers.googleCallback,authControllers.googleNewUser)

authRouter.post("/google/new",authControllers.googleNewUser)

authRouter.post("/signup",authControllers.googleNewUser)

authRouter.post("/new",authControllers.googleNewUser)

authRouter.post("/logout",authControllers.googleNewUser)

authRouter.get("/home",authMiddleware,(req,res,next)=>{
    try{
      console.log("Hello")
      res.json({message:req.session.id})
    }
    catch(error){
        next(error)
    }
})

authRouter.get("/googlehome",authMiddleware,(req,res,next)=>{
    try{
        res.json({message:req.session.userId})
    }
    catch(error){
        next(error)
    }
})

export default authRouter