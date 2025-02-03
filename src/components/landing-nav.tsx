 import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { app } from '@/constants/ganeral-info';
 
 export const LandingNav = () => {
   return (
     <div className="w-full flex justify-between items-center ~px-4/20 ~py-2/4 ">
        <div className="flex items-center gap-x-3">
          <Image src="/logo.svg" alt="logo" width={50} height={50}/>  
          <h1 className="text-2xl font-bold">{app.name}</h1>
        </div>

        <div className="flex items-center gap-x-4">
          <Link href="/sign-in" passHref>
            <Button
              variant="outline" 
              className='text-primary hover:bg-primary/80 hover:text-primary-foreground transition-all duration-500'
            >
              Login
            </Button>
          </Link>
          
          <Link href="/sign-up" passHref>
            <Button>Sign Up</Button>  
          </Link> 
        </div>
     </div>
   )
 }
 