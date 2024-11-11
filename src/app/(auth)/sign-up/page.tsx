'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/apiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const SignUp= () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, SetUsernameMessage] = useState('')
    const [isCheckingUsername, SetIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced = useDebounceCallback(setUsername,300)
    const { toast } = useToast()
    const router = useRouter()

    // zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues:{
            username:'',
            email:'',
            password:''
        }
    })

    useEffect(() => {
     const checkUsernameUnique = async () => {
        if(username){
            SetIsCheckingUsername(true)
            SetUsernameMessage('')
            try {
                const { data } = await axios.get(`/api/check-username-unique?username=${username}`)
                SetUsernameMessage(data?.message)
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
                SetUsernameMessage(axiosError.response?.data.message ?? 'Error checking username')
            }
            finally {
                SetIsCheckingUsername(false)
            }
        }
     }
     checkUsernameUnique()
    },[username])

    const onSubmit = async (formData: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const { data } = await axios.post<ApiResponse>('/api/sign-up', formData)
            toast({
                title: 'Success',
                description: data.message 
            })
            router.replace(`/verify/${username}`)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message ??  "Error in sign-up user"
            toast({
                title:'Sign-up failed',
                description: errorMessage,
                variant:"destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5l mb-6">
                    Join Mystery Message
                </h1>
                <p className="mb-4">Sign up to start your anonymous adventure</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input placeholder="Username" {...field} 
                        onChange={(e:any)=>{
                            field.onChange(e)
                            debounced(e.target.value)
                            if(form.formState.errors?.username?.message){
                                SetUsernameMessage(form.formState.errors?.username?.message)
                            }
                        }} />
                    </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin"/>}
                    {form.formState.errors?.username?.message ? <FormMessage /> : (
                        <p className={`text-sm ${usernameMessage === 'Username is unique!' ? 'text-green-600' : 'text-red-500 text-sm font-medium text-destructive'}`}>
                            {usernameMessage}
                        </p>
                    )}
                    </FormItem>
                   )}
                />
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                   )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type='password' placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                   )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {
                        isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        ) : ( 'SignUp')
                    }
                </Button>
                </form>
            </Form>
            <div className="text-center mt-4">
                <p>
                    Already a member?{' '}
                    <Link href='/sign-in' className="text-blue-600 hover:text-blue-800">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
      </div>
    </>
}

export default SignUp
// import { signIn, signOut, useSession } from "next-auth/react";
// export default function SignIn () {
//     const { data: session } = useSession()
//     if(session) {
//         return (
//             <>
//              Signed-in as { session.user.username} <br/>
//             <button onClick={() => signOut()}>
//                 SignOut
//             </button>
//             </>
//         )
//     }
//     return (
//      <>
//           No logged In <br/>
//           Please login in 
//           <button onClick={() => signIn()}>
//                 SignIn
//           </button>
//      </>
//     )
// }