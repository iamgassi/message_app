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
                        <Button className='w-full md:w-auto' onClick={()=>signOut()}>Logout</Button> 
                    </>
                ) : (
                    <Link className='mr-4' href={'/'}>
                        <Button className='w-full md:w-auto'>Log In</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar