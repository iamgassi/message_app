import { getGeminiMessages } from "@/helpers/getGeminiResponse";

export async function GET(request: Request){
  try {
   const response = await getGeminiMessages()
   return Response.json({
     success: true,
     messages: response
     },
     {
         status: 200
     }
   )
 } catch (error) {
    return Response.json({
        success: false,
        messages: []
        },
        {
            status: 500
        }
      )
 }
}