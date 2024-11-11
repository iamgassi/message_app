import UserModel from "@/model/User";
import { getUserFromSession } from "@/utils/app-utils";

export async function DELETE(request: Request, { params }: any) {
    const { messageId } = await params;
    if (!messageId) {
      return Response.json(
        {
          success: false,
          message: "Message ID is required",
        },
        {
          status: 400,
        }
      );
    } 
    const user: any = await getUserFromSession();
    if (!user || !user._id) {
      return Response.json(
        {
          success: false,
          message: "Not authenticated",
        },
        {
          status: 401,
        }
      );
    }
  
    try {
      // Find and update the message
      const updatedMessage = await UserModel.updateOne(
        { _id: user._id, "messages._id": messageId },
        { $pull: { messages: { _id: messageId } } }
      );
   
      // If no message was found to delete
      if (updatedMessage.modifiedCount === 0) {
        return Response.json(
          {
            success: false,
            message: "No message found or already deleted",
          },
          {
            status: 404,  // 404 for not found, instead of 401
          }
        );
      }
  
      return Response.json(
        {
          success: true,
          message: "Message deleted",
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.error(error);
      return Response.json(
        {
          success: false,
          message: "Failed to delete message",
        },
        {
          status: 500,
        }
      );
    }
  }
  