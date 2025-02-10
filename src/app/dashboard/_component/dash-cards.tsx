import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export const BalanceCard = () => {
  return (
    <div className='w-full shadow-sm hover:shadow-md transition-all duration-500 py-4 px-6 border border-gray-200 rounded-md'>
      <div className="flex items-center justify-between border-b border-primary/20">
        <h3 className="text-primary font-bold">Current Balance</h3>
        <p className="text-gray-400 text-sm">Balance History</p>
      </div>

      <div className="flex my-10 items-baseline gap-x-4">
        <div className="flex">
          <span className='text-gray-900 font-light text-7xl'>$</span>
          <span className='text-gray-900 font-light text-7xl'>1000.00</span>
        </div>
        <span className='text-sm text-gray-400'>Available</span>
      </div>

      <div className="flex gap-x-2 mb-3 ">
        <Button variant={"outline"} size={"sm"} className='py-0 rounded-full text-primary hover:bg-primary hover:text-white w-full transition-colors ease-in-out duration-500'>Send</Button>
        <Button variant={"outline"} size={"sm"} className='py-0 rounded-full text-primary hover:bg-primary hover:text-white w-full transition-colors ease-in-out duration-500'>Deposit</Button>
        <Button variant={"outline"} size={"sm"} className='py-0 rounded-full text-primary hover:bg-primary hover:text-white w-full transition-colors ease-in-out duration-500'>Withdraw</Button>
      </div>
    </div>
  )
}


// SMALL CARDS 
interface ActionCardProps {
  icon: LucideIcon
  label: string
  sublabel?: string
  // link?: string
  variant : "default" | "outline" | string
}

export const ActionCard = ({ icon:Icon, label, sublabel, variant = "default" }: ActionCardProps) => {
  return (
    <div className="cursor-pointer hover:shadow-md transition-transform ease-in-out duration-500 rounded-md" >
      <div
        className={`flex flex-col items-center justify-center py-4 px-3 text-center rounded-md border border-primary/70 ${
          variant === "default" ? "bg-primary text-white" : "text-primary"
        }`}
      >
        <Icon className="h-5 w-5 " />
        <div className=" ">{label}</div>
        {sublabel && <div className={`text-xs text-muted-foreground opacity-70 ${
          variant === "default" ? "text-white" : "text-primary"
          }`}>
          {sublabel}
        </div>}
      </div>
    </div>
  )
}



interface ConnectedAccountCardProps {
  image : string
  accountType : string
  accountNumber?: string | null
}

export const ConnectedAccountCard = ({ image, accountType, accountNumber }: ConnectedAccountCardProps) => {
  return (
    <div className='w-full shadow-sm hover:shadow-md transition-all duration-500 py-4 px-6 border border-gray-200 rounded-md'>
      <div className="flex items-center justify-between border-b border-primary/20">
        <h3 className="text-primary font-bold">Connected Account</h3>
        {/* <p className="text-gray-400 text-sm">Balance History</p> */}
      </div>

      <div className="flex my-10 items-center gap-x-8">
        <Image  src={image} alt={accountType} width={70} height={70} />
        <div className="flex flex-col ">
          <span className='text-xl font-semibold capitalize'>{accountType}</span>
          <span className='text-sm text-gray-400'>{accountNumber}</span>
        </div>
      </div>

      <div className="flex gap-x-2 mb-3 ">
        <Button variant={"outline"} size={"sm"} className='py-0 rounded-full text-primary hover:bg-primary hover:text-white w-full transition-colors ease-in-out duration-500'>Send</Button>
        <Button variant={"outline"} size={"sm"} className='py-0 rounded-full text-primary hover:bg-primary hover:text-white w-full transition-colors ease-in-out duration-500'>Deposit</Button>
        <Button variant={"outline"} size={"sm"} className='py-0 rounded-full text-primary hover:bg-primary hover:text-white w-full transition-colors ease-in-out duration-500'>Withdraw</Button>
      </div>
    </div>
  )
}