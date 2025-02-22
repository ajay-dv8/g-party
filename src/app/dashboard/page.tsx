"use client"; 
import React from 'react' 
import { ActionCard, BalanceCard, ConnectedAccountCard } from './_component/dash-cards';
import { useUser } from '@/hooks/useUser'; 
import { Plus, Receipt, Send } from 'lucide-react';
import { RecentActivityTable } from './_component/recent-table';

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
 
  return (
    <div className='w-full grid grid-cols-5 gap-x-10 mt-10 ~px-4/24'> 
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

      <div className='col-span-3 px-10'>
          <div className="w-full  bg-white shadow-sm hover:shadow-md transition-all duration-500 py-4 px-6 border border-gray-200 rounded-md">
            <div className="flex items-center justify-between border-b pb-2 mb-2 border-primary/20">
              <h3 className="text-primary font-bold">Recent Activity</h3>
              {/* <p className="text-gray-400 text-xs">filter</p> */}
            </div>
            <RecentActivityTable/>
          </div>
      </div> 
    </div>
  )
}

export default Dashboard