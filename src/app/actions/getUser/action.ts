// actions/getUser/action.ts
"use server"; // Ensure it's a Server Action 

import { prisma } from "@/lib/prisma"; 
import { supabase } from "@/utils/supabase/auth-client"; 

export async function getCurrentUser(accessToken: string) { 
  try {
    if (!supabase) {
      throw new Error("Invalid Supabase client configuration");
    } 

    // Ensure access token is provided
    if (!accessToken) {
      console.error("Access token is missing!");
      return null;
    }

    // Get the authenticated user session
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken); 
    if (authError || !user) {
      console.error("Error getting authenticated user:", authError);
      return null;
    } 

    const userId = user.id; 
    if (!userId) return null;  

    // Fetch user details from Prisma
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        full_name: true,
        email: true,
        username: true,
        phone: true,
        gender: true,
      },
    });

    if (!userData) {
      console.error("User not found in database");
      return null;
    }

    return JSON.parse(JSON.stringify(userData));  
  } catch (error) {
    console.error("Unexpected error fetching user:", error);
    return null;
  }
}

 