'use client'
import React from 'react'
import { signOut, useSession  } from 'next-auth/react'
import Link from 'next/link';
import { Button } from './ui/button';

const Navbar = () => {
    const { data: session } = useSession();
    const user = session?.user
    return (
    <nav className='p-4 md:p-6'>
        <div className='container mx-auto flex md:flex-grow justify-between items-center'>
            <Link className='text-xl font-bold mb-4 md:mb-0' href={`#`}>Mystry Message</Link>
            {
                session ? (
                    <>
                        <span className='mr-4'>Welcome, {user?.username}</span>
                        <Link className='mr-4' href={'/'}>
                            <Button className='w-full md:w-auto' onClick={()=>signOut()}>Sign out</Button> 
                        </Link>
                    </>
                ) : (
                    <Link className='mr-4' href={'/sign-in'}>
                        <Button className='w-full md:w-auto'>Sign In</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar
