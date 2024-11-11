'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { Message } from '@/model/User'
import axios from 'axios'
import { useToast } from './ui/use-toast'
import { ApiResponse } from '@/types/apiResponse'
  
type MessageCardProps = {
    message : Message,
    onMessageDelete: (messageId: any) => void
}
const MessageCard = ({onMessageDelete, message}: MessageCardProps) => {
  const {toast} = useToast()
  const handleDeleteConfirm = async ()=> {
    try {
        await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        onMessageDelete(message?._id)
        toast({
            title: 'Success',
            description: 'Message deleted.'
        })
    } catch (error) {
        toast({
            title: 'Failed',
            description: 'Message delete failed'
        })
    }
  }
  return (
    <>
        <Card className='py-5'>
            {/* <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader> */}
            <CardContent>
                <p className='mb-2'>{message?.content}</p>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Message</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
            {/* <CardFooter>
                <p>Card Footer</p>
            </CardFooter> */}
        </Card>
    </>

  )
}

export default MessageCard