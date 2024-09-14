import express from "express"

export const httpApp=express()
export const mainApp=express()

httpApp.use("/",(req,res,next)=>{
    res.redirect(`https://localhost:8443${req.url}`)
})

mainApp.get("/",(req,res)=>{
    res.send("Hello world!")
})