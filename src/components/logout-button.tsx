'use client'
import { supabase } from '@/utils/supabase/auth-client'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface LogoutProps {
	className?: string;
}
export const LogoutButton = ({className}: LogoutProps) => {
	const router = useRouter()

	const signout = async () => {
		await supabase.auth.signOut()
		router.push('/sign-in')
	}
	return (
		<Button variant={"outline"} onClick={signout} className={cn("", className)}>
			Logout
		</Button>
	)
}
