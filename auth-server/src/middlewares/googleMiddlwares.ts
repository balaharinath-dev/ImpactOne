import { Request, Response, NextFunction } from "express"
import passport from "passport"
import env from "../utils/cleanEnv"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { checkOAuthUser } from "../services/authService"

export const googleAuth=(req:Request,res:Response,next:NextFunction)=>{
    passport.authenticate("google",{
        scope:["profile","email"]
    })(req, res, next)
}

export const googleCallback=(req:Request,res:Response,next:NextFunction)=>{
    passport.authenticate("google",{
        failureRedirect:"/auth/redirect", //fill later
    })(req, res, next)
}

export const googleStrategy=new GoogleStrategy({
    clientID:env.GOOGLE_CLIENT_ID,
    clientSecret:env.GOOGLE_CLIENT_SECRET,
    callbackURL:env.GOOGLE_CALLBACK_URL,
  },
  (accessToken,refreshToken,profile:any,done)=>{
    return done(null,profile)
})