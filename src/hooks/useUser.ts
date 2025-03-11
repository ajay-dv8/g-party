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

 