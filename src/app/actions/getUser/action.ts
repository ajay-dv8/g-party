// import { supabase } from "./supabase/auth-client";

import { supabase } from "@/utils/supabase/auth-client";

 
export const getCurrentUser = async () => {
  try {

        // // Implement rate limiting
        // const rateLimit = await checkRateLimit();
        // if (!rateLimit.allowed) {
        //   throw new Error('Too many requests. Please try again later.');
        // }
    
        // Validate Supabase client
        if (!supabase) {
          throw new Error('Invalid Supabase client configuration');
        }

    // Get the current authenticated user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    // console.log("Auth Data:", authData );
    if (authError) {
      console.error("Error getting authenticated user:", authError);
      return null;
    }

    const userId = authData?.user?.id; 
    if (!userId) return null;

    // Fetch user details from Supabase table
    const { data: userData, error: userError } = await supabase
      .from("User") // Your Supabase table name
      .select("full_name, email, username, phone, gender")
      .eq("user_id", userId) // Assuming the ID in your table matches Supabase user ID
      .single(); // Fetch a single user

    if (userError) {
      console.error("Error fetching user from Supabase table:", userError);
      return null;
    }

    return userData;
  } catch (error) {
    console.error("Unexpected error fetching user:", error);
    return null;
  }
};
 
