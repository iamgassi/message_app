import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { getUserFromSession } from "@/utils/app-utils";

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
  
    const userId = user?._id
    try {
        const foundUser = await UserModel.findOne({ _id: userId })
        if(!foundUser){
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 401 }
            )
        }
        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage
        }, { status: 200 }
        )
    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to get user acceptingMessage status"
        }, { status: 500 }
        )  
    }

}

export async function POST(request: Request){
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

  const userId = user?._id
  const { acceptMessages } = await request.json()

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { isAcceptingMessage: acceptMessages},
        { new: true}
    )
    if(!updatedUser){
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, { status: 401 }
        )
    }
    return Response.json({
        success: true,
        message: "Successfully update user status to accept messages"
    },
    {
        status: 200
    })
    
  } catch (error) {
    return Response.json({
        success: false,
        message: "Failed to update user status to accept messages"
    },{
        status: 500
    }
    )
  }
}
