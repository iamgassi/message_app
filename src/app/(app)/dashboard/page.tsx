'use client'
import MessageCard from "@/components/MessageCard"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Message, User } from "@/model/User"
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const DashBoard = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [switchLoading, setSwitchLoading] = useState(false)
    const [profileUrl, setProfileUrl] = useState('')
    const { toast } = useToast()
    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages?.filter((msg)=> msg?._id !== messageId))
    }

    const { data: session } = useSession()
    const form = useForm({
        resolver : zodResolver(acceptMessagesSchema)
    })

    const { register, watch, setValue } = form
    const acceptMessages =  watch('acceptMessages')
    const fetchAcceptMessages = useCallback(async () => {
        setSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages',{})
            setValue('acceptMessages', response.data.isAcceptingMessages)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || 'Failed to fetch messages setting',
                variant: 'destructive'
            })
        } finally {
          setSwitchLoading(false)
        }
    },[setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setSwitchLoading(true)
        setIsLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            if(refresh){
                toast({
                    title: 'Refreshed Messages',
                    description: 'Latest messages fetched',
                    variant: 'default'
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || 'Failed to refresh messages',
                variant: 'destructive'
            })
        } finally {
          setSwitchLoading(false)
          setIsLoading(false)
        }
    },[setIsLoading, setMessages, toast])

    useEffect(()=>{
        if(!session || !session?.user) return 
        fetchMessages()
        fetchAcceptMessages()
    },[session, setValue, fetchAcceptMessages, fetchMessages])

    const handleSwitchChange = async () => {
        try {
            const response = axios.post('/api/accept-messages',{acceptMessages: !acceptMessages})
            setValue('acceptMessages',!acceptMessages)
            toast({
                title: 'Success',
                description: 'Accepting Message status changed',
                variant: 'default'
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || 'Failed to change message status',
                variant: 'destructive'
            })
        }

    }

    useEffect(() => {
        if(!session?.user) return
        if (session?.user) {
          const baseUrl = `${window.location.protocol}//${window.location.host}`;
          const profileUrl = `${baseUrl}/u/${session?.user?.username}`;
          setProfileUrl(profileUrl);
        }
    }, [session?.user]);
      
    const copyToClipboard = () => {
        if(!session?.user) return
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: 'Success',
            description: 'Unique url copied, Successfully !',
            variant: 'default'
        })
    }

    if(!session || !session?.user){
        return  <Loader2 className="m-auto animate-spin" />
    }

    return (
    <>
        <Navbar/>
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
            <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
            <div className="flex items-center">   
                <input type="text" value={profileUrl} disabled className="input input-bordered w-full p-2 mr-2"/>
                <Button onClick={copyToClipboard}>Copy</Button>
            </div>
            </div>
            <div className="mb-4">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={switchLoading}
                />
                <span className="ml-2"> Accept Messages: {acceptMessages ? 'On' : 'Off'} </span>
            </div>
            <Separator />
            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                e.preventDefault()
                fetchMessages (true)
            }}>
                {isLoading? (
                <Loader2 className="h-4 w-4 animate-spin" />
                ): (
                <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {
                    messages.length > 0 ? (
                        messages?.map((message, index) => (
                        <MessageCard
                            key={index}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        /> ))
                ) : (
                    <p>No messages to display</p>
                ) 
                }
            </div>
        </div>
    </>)
}

export default DashBoard
