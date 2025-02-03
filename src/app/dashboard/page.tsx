"use client";
import { Button } from '@/components/ui/button'
import { supabase } from '@/utils/supabase/auth-client'
import React from 'react' 
import { useRouter } from 'next/navigation'

const Dashboard = async () => {
  const router = useRouter()
const signout = async () => {
  await supabase.auth.signOut()
  router.push('/sign-in')
}

  return (
    <>
    <div className="w-full ~p-8/14 text-5xl">Dashboard</div>

    <Button onClick={signout}> 
      Logout
    </Button>
    </>
  )
}

export default Dashboard