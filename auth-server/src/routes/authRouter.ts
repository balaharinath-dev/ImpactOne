import express from "express"
import * as authControllers from "../controllers/authController"
import { loginLimiter } from "../middlewares/loginLimiter"
import { authMiddleware } from "../middlewares/authMiddleware"

const authRouter=express.Router()

declare module "express-session" {
    interface SessionData {
      userId:string,
      csrfToken:string,
    }
  }

authRouter.post("/login",loginLimiter,authControllers.login)

authRouter.get("/home",authMiddleware,(req,res,next)=>{
    try{
        res.json({message:"Auth Server"})
    }
    catch(error){
        next(error)
    }
})

export default authRouter