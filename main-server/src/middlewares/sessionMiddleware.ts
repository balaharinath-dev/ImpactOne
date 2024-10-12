import session from "express-session"
import env from "../utils/cleanEnv"

export default session({
    secret:env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        secure:true,
    },
})