"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Adjust import paths as needed
import { getCurrentUser } from "@/app/actions/getUser/action";
import { UserData } from "@/types";
 
 

export const UserProfile = () => {
  const [user, setUser] = useState<UserData>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        
        if (!userData) {
          setError('No user data found');
          return;
        }

        setUser(userData);
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error loading user:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-md bg-red-50">
        <p>{error}</p>
      </div>
    );
  }


  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">User Profile</h1>
      <Avatar>
        <AvatarImage src="https://github.co " alt="Profile Image" />
        <AvatarFallback>{user?.username?.slice(0, 1).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <p><strong>Full Name:</strong> {user?.full_name || "Not set"}</p>
        <p><strong>Email:</strong> {user?.email || "Not set"}</p>
        <p><strong>Username:</strong> {user?.username || "Not set"}</p>
        <p><strong>Phone:</strong> {user?.phone || "Not set"}</p>
        <p><strong>Gender:</strong> {user?.gender || "Not set"}</p>
      </div>
    </div>
  );
};