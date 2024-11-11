import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import { getServerSession } from "next-auth";


export async function getUserFromSession(){
  await dbConnect() 
  const session = await getServerSession(authOptions)
  const user = session?.user || {}
  return user
}