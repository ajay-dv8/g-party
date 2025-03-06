// hooks/useUser.ts
"use client";
import { useUserStore } from "@/store/userStore"; 
import { useEffect } from "react";


export const useUser = () => {
  const { user, loading, error, fetchUser, setUser } = useUserStore();

  // Fetch user only if not already loaded
  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, loading, error, fetchUser]);

  return {
    user,
    loading,
    error,
    setUser, // Expose setUser if you need to update the user externally
    refreshUser: fetchUser, // Renamed for clarity
  };
};












// Custom hook to manage user data without zustand
// export const useUser = () => {
//   const [user, setUser] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const userData = await getCurrentUser();
//         setUser(userData);
//       } catch (err) {
//         setError('Failed to load user data');
//         console.error('Error loading user:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   return { user, loading, error };
// };
