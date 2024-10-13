import session from "express-session"
import env from "../utils/cleanEnv"

export default session({
    name:"ImpactOne-Session-ID",
    secret:env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        secure:true,
    },
})