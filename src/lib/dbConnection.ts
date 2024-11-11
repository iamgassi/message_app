import mongoose from "mongoose";

interface connectionObject{
    isConnected?:number
}

const connection: connectionObject = {}

async function dbConnect(): Promise<void> {
 if(connection?.isConnected){
    console.log("Already connected to database");
    return
 }
 try {
    const db = await mongoose.connect(process.env.MONGO_URI || '', {})
    connection.isConnected = db.connections[0].readyState
    console.log('Connected successfully !')
 } catch (error) {
    console.log('Connection failed', error)
    process.exit(1)
 }
}

export default dbConnect;