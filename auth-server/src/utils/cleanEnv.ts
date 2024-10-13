import dotenv from "dotenv"
import { cleanEnv, str, port } from "envalid"

dotenv.config()

export default cleanEnv(process.env,{
    MONGO_CONNECTION_STRING:str(),
    MYSQL_DB_HOST:str(),
    MYSQL_DB_USER:str(),
    MYSQL_DB_PASSWORD:str(),
    MYSQL_DB_NAME:str(),
    HTTPAPP_PORT:port(),
    MAINAPP_PORT:port(),
    CERT_PATH:str(),
    CERT_KEY_PATH:str(),
    CERT_PASSPHRASE:str(),
    API_KEY:str(),
    SESSION_SECRET:str(),
    JWT_SECRET:str(),
    CSRF_SECRET:str(),
    GOOGLE_CLIENT_ID:str(),
    GOOGLE_CLIENT_SECRET:str(),
    GOOGLE_CALLBACK_URL:str(),
})