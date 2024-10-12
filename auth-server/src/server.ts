import https from "https"
import http from "http"
import fs from "fs"
import path from "path"
import env from "./utils/cleanEnv"
import mongoose from "mongoose"
import mysql from "mysql2"
import { httpApp, mainApp } from "./app"

const httpServer=http.createServer(httpApp)

const key=fs.readFileSync(path.resolve(__dirname,env.CERT_KEY_PATH))
const cert=fs.readFileSync(path.resolve(__dirname,env.CERT_PATH))

const credentials={
    key,
    cert,
    passphrase:env.CERT_PASSPHRASE,
}

const mainServer=https.createServer(credentials,mainApp)

const mysqlConnection=mysql.createConnection({
    host:env.MYSQL_DB_HOST,
    user:env.MYSQL_DB_USER,
    password:env.MYSQL_DB_PASSWORD,
    database:env.MYSQL_DB_NAME,
})

mongoose.connect(env.MONGO_CONNECTION_STRING)
.then(()=>{
    console.log("MongoDB Atlas connected successfully")

    mysqlConnection.connect((err)=>{
        if(err) console.log("Error connecting to MySQL Server")
        else console.log("MySQL Server connected successfully")
    })

    httpServer.listen(env.HTTPAPP_PORT,()=>{
        console.log(`HTTP server listening at port ${env.HTTPAPP_PORT}`)
    })

    mainServer.listen(env.MAINAPP_PORT,()=>{
        console.log(`Main server listening at port ${env.MAINAPP_PORT}`)
    })
})
.catch(console.error)