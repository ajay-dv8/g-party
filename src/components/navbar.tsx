"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { app } from '@/constants/ganeral-info';
import { useUser } from '@/hooks/use-user';
import { ChevronDown } from 'lucide-react'; 
import { usePathname } from 'next/navigation'; 

 
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet" 
import { ProfileImageCard } from './profile-image-card';
import { LogoutButton } from './logout-button';
import { hideNavbarPaths } from './hide-navbar-routes';

// Auth buttons component
const AuthButtons = () => (
  <div className="flex gap-4">
    <Link href="/sign-in" passHref>
      <Button
        variant="outline"
        className="text-primary hover:bg-primary/80 hover:text-primary-foreground transition-all duration-500"
      >
        Login
      </Button>
    </Link>
  </div>
);

// Profile image component
export const ProfileImage = () => {
  const { user, loading, error } = useUser();

  if (loading) return <div className="animate-pulse w-8 h-8 rounded-full bg-gray-200" />;
  if (error || !user) return null;

  return (
    <>
    <p className='~text-xs/normal '>Hi, {user.username}</p>
 
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex items-center gap-x-2 cursor-pointer">
        <Avatar>
          <AvatarImage src="{user.image}" alt="dp" />
          <AvatarFallback className='font-bold'>
            {user.username?.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <ChevronDown className='h-4 w-4' />
        </div>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Account</SheetTitle>
          <SheetDescription>
            Check basic account details
          </SheetDescription>
        </SheetHeader>

        <div className="w-full flex items-center my-10 justify-center">
          <ProfileImageCard 
            name={user.full_name ?? "Unknown"}
            username={user.username ?? "Unknown"}
            imageUrl={"https://github.com/shadcn.png"}
            onAvatarClick={() => {
              console.log("Avatar clicked")
            }}
          /> 
        </div>
        
        <SheetFooter>
          <SheetClose asChild>
            <LogoutButton className='w-full text-primary/70 hover:text-primary hover:bg-primary/10'/>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet> 
    </>
  );
};

// Main navbar component
export const Navbar = () => {
  const { user, loading } = useUser();

  return (
    <nav className="w-full flex justify-between items-center ~px-4/20 ~py-2/4 ">
      <Link href="/" className="flex items-center gap-x-3">
        <Image src={app.logo} alt="logo" width={50} height={50} />
        <h1 className="text-2xl font-bold">{app.name}</h1>
      </Link>

      {!loading && (
        <div className="flex items-center gap-4">
          {user ? <ProfileImage /> : <AuthButtons />}
        </div>
      )}
    </nav>
  );
};

 
// Navbar wrapper component
// to tell places to hide navbar
export default function NavbarWrapper() {
  const pathname = usePathname();
 
  if (hideNavbarPaths.includes(pathname)) {
    return null;
  } 
  return <Navbar />;
}






 
// export const Navbar = () => {

//   const [user, setUser] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const userData = await getCurrentUser();
//         setUser(userData);
//       } catch (error) {
//         console.error('Error fetching user:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   return (
//     <div className="w-full flex justify-between items-center ~px-4/20 ~py-2/4 ">
//       <div className="flex items-center gap-x-3">
//         <Image src={app.logo} alt="logo" width={50} height={50}/>  
//         <h1 className="text-2xl font-bold">{app.name}</h1>
//       </div>

//       {/* Auth Buttons or Profile Section */}
//       {!loading && (
//         <div className="flex items-center gap-x-4">
//           {!user ? (
//             // Show auth buttons when user is not logged in
//             <>
//               <Link href="/sign-in" passHref>
//                 <Button
//                   variant="outline"
//                   className="text-primary hover:bg-primary/80 hover:text-primary-foreground transition-all duration-500"
//                 >
//                   Login
//                 </Button>
//               </Link>
              
//               <Link href="/sign-up" passHref>
//                 <Button>Sign Up</Button>
//               </Link>
//             </>
//           ) : (
//             // Show profile image when user is logged in
//             <div className="flex items-center gap-x-2">
//               {/* You can add user name or other elements here */}
//               <ProfileImage />
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }
 
 