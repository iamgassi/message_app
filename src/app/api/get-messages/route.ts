import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { getUserFromSession } from "@/utils/app-utils";
import mongoose from "mongoose";

export async function GET(request: Request){
  const user:any = await getUserFromSession()
  if(!user || !user._id){
    return Response.json({
        success: false,
        message: "Not authenticated"
    },
    {
        status: 401
    }
    )
  }
  const userId = new mongoose.Types.ObjectId(user._id)
  try {
    const userMessages = await UserModel.aggregate([
        { $match: { _id:userId } },
        { $unwind: '$messages' },
        { $sort: {'messages.createdAt': -1}},
        { $group: { _id: '$_id' , messages: { $push: '$messages'} } }
    ])
    if(!userMessages || userMessages?.length == 0){
        return Response.json({
            success: false,
            message: "No User Messages Found"
        },
        {
            status: 201
        }
        )
    } 
    return Response.json({
        success: true,
        messages: userMessages[0]?.messages
    },
    {
        status: 200
    }
    )
  } catch (error) {
    return Response.json({
        success: false,
        message: "Failed to get messages"
    },
    {
        status: 500
    }
    )
  }
}