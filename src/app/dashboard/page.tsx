"use client";
import { Button } from '@/components/ui/button'
import { supabase } from '@/utils/supabase/auth-client'
import React from 'react' 
import { useRouter } from 'next/navigation' 
import { UserProfile } from '@/components/currentUserDummy';
import { ActionCard, BalanceCard, ConnectedAccountCard } from './_component/dash-cards';
import { useUser } from '@/hooks/use-user'; 
import { Plus, Receipt, Send } from 'lucide-react';

const actionCardInfo = [
  {
    icon: Send,
    label: "Send ",
    sublabel: "Money Now",
    variant: "default"
  },
  {
    icon: Receipt,
    label: "Request ",
    sublabel: "Money Now",
    variant: "outline"
  },
  {
    icon: Plus,
    label: "More",
    sublabel: "Funds Options",
    variant: "outline"
  },
]

const Dashboard = () => {
  const { user, loading, error } = useUser();

  if (loading) return <div className="animate-pulse w-8 h-8 rounded-full bg-gray-200" />;
  if (error || !user) return null;

  const router = useRouter()

  const signout = async () => {
    await supabase.auth.signOut()
    router.push('/sign-in')
  }

  return (
    <div className='w-full grid grid-cols-5 gap-x-10 mt-10'> 
      <div className='col-span-2 flex flex-col gap-y-10'> 
        <BalanceCard 
        currency ={'$'}
        balanceAmount={1010.47}
        /> 

        <div className="flex gap-x-3 items-center justify-around">
          {actionCardInfo.map((card, index) => (
            <ActionCard
              key={index}
              icon={card.icon}
              label={card.label}
              sublabel={card.sublabel}
              variant={card.variant}
            />
          ))}
        </div>

        <ConnectedAccountCard
          image ={'/momoIcons/tcash.webp'}
          accountType ={'telecel cash'}
          accountNumber ={user.phone} 
        />
      </div>

      <div className='col-span-3'>
        <Button onClick={signout}> 
          Logout
        </Button> 
        <UserProfile />
      </div> 
    </div>
  )
}

export default Dashboard